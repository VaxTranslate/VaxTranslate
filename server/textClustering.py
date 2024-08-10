import openai
import os
import editdistance
from PIL import Image, ImageDraw, ImageFont
from google.cloud import vision
from google.cloud import translate_v2 as translate
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the API keys from the environment variables
openai_api_key = os.getenv('OPENAI_API_KEY')

def detect_and_translate_texts(image_path):
    client = vision.ImageAnnotatorClient()
    translate_client = translate.Client()

    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    
    response = client.text_detection(image=image)
    texts = response.text_annotations
    
    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )

    if not texts:
        return ""
    
    # Extract the full text description
    full_text = texts[0].description

    translated_texts = {
        "texts_without_newline": "",
        "texts_with_newline": ""
    }
    
    # 1. Extract the translated texts, which aren't splited by \n
    translated_texts["texts_without_newline"] = translate_client.translate(full_text, target_language='en')['translatedText']

    # 2. Extract the translated texts, which are splited by \n
    # Split the text into lines
    lines = full_text.split('\n')

    translated_lines = []
    for line in lines:
        # Translate each line of texts into English
        translated_text = translate_client.translate(line, target_language='en')['translatedText']
        # Add each line of translated texts in the list
        translated_lines.append(translated_text)
    
    # Join the translated lines of texts with newline characters
    translated_texts["texts_with_newline"] = "\n".join(translated_lines)

    return translated_texts

def cluster_personal_info_and_vaccination_info(translated_texts):
    
    # An object to contain clustered information
    cluster_texts = {
        "personal_info": {
            "Name": "X",
            "Gender": "X", 
            "Birth of Date": "X",
            "Address": "X"
        },
        "vaccination_info": "X"
    }
    
    # Define Keywords for personal information
    keywords = {
        "Name": ["Name"],
        "Gender": ["Gender", "Sex"],
        "Birth of date": ["Date of Birth", "Birth of date", "Birth date", "Birthday"],
        "Address": ["Address"]
    }
    
    # Extracted personal information
    extracted_info = {
        "Name": "",
        "Gender": "",
        "Birth of date": "",
        "Address": ""
    }

    lines = translated_texts.split('\n')
    skip_lines = set()  # A set of tracking lines of texts related to personal information
    keyword_positions = {key: [] for key in keywords}  # A dictionary to track each keyword's location(a number of line)

    # Track each keyword's location 
    for i, line in enumerate(lines):
        for key, keyword_list in keywords.items():
            for keyword in keyword_list:
                if keyword.lower() == line.lower():
                    keyword_positions[key].append(i)
                    if len(keyword_positions[key]) > 1 and i != keyword_positions[key][0]+1:
                       keyword_positions[key].pop()
                    break

    # Extract the text coming right after the keyword
    for key, positions in keyword_positions.items():
        if positions:
            # The position of the first keyword
            first_pos = positions[0]
            # The position of the second occurrence of the keyword when it is repeated twice
            target_pos = positions[1] if len(positions) > 1 else first_pos
            if target_pos + 1 < len(lines):
                extracted_info[key] = lines[target_pos + 1].strip()
                skip_lines.add(target_pos)      
                skip_lines.add(target_pos + 1)

    cluster_texts["personal_info"]["Name"] = extracted_info["Name"]
    cluster_texts["personal_info"]["Gender"] = extracted_info["Gender"]
    cluster_texts["personal_info"]["Birth of Date"] = extracted_info["Birth of date"]
    cluster_texts["personal_info"]["Address"] = extracted_info["Address"]

    # Extract the vaccination information separately from the personal information
    vaccination_lines = []
    
    # Iterate over the lines with their indices
    for i, line in enumerate(lines):
        # Check if the current index is not in the skip_lines list
        if i not in skip_lines:
            # If the index is not in skip_lines, add the line to the vaccination_lines list
            vaccination_lines.append(line)
  
    cluster_texts["vaccination_info"] = "\n".join(vaccination_lines)
    vaccination_info_texts = cluster_texts["vaccination_info"]

    # Cluster Vaccination Information
    openai.api_key = openai_api_key
    
    # Command propmt for OpenAI API
    prompt = f"Extract and organize the vaccination details from the following text, then cluster the information and format it under the header 'vaccination details':\n\n{vaccination_info_texts}"

    # Response from OpenAI API
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": "Cluster texts into vaccination details:"},
            {"role": "user", "content": prompt}
        ]
    )
    
    # Let this string message to be vaccination information
    cluster_texts["vaccination_info"] = response.choices[0].message.content.strip()
    
    return cluster_texts

# Cluster the data based on the similarity between each text data
def format_texts(personal_info, vaccination_info):
    name = "".join(personal_info['Name'])
    gender = "".join(personal_info['Gender'])
    birth_of_date = "".join(personal_info['Birth of Date'])
    address = "".join(personal_info['Address'])

    formatted_texts = f"Personal Info\nName: {name}\nGender: {gender}\nBirth_of_Date: {birth_of_date}\nAddress: {address}\n\n{vaccination_info}"
    return formatted_texts
      
def draw_texts_on_image(image_path, formatted_texts, output_path):
    original_image = Image.open(image_path)
    width, height = original_image.size
    
    # Create an empty white image with the same size as the original image
    new_image = Image.new('RGB', (width,height), (255,255,255))
    
    # Draw the formatted texts on the image
    draw = ImageDraw.Draw(new_image)

    # Set up the font for drawing the texts
    font = ImageFont.load_default()
 
    print(formatted_texts)
    # Drawing texts from the upper-left side in order
    text_y_position = 10
    for text in formatted_texts.split('\n'):
        draw.text((10, text_y_position), text, fill=(0, 0, 0), font=font)
        text_y_position += 20  # Next y location of text
    
    # Store the image
    new_image.save(output_path)
    
    print(f"Output image saved to {output_path}")

    return new_image

def calculate_cer_and_wer(ocr_result, ground_truth):
    # Remove spaces and convert to lowercase for comparison
    ocr_clean = ocr_result.replace(" ", "").lower()
    gt_clean = ground_truth.replace(" ", "").lower()

    # Compute edit distance (Levenshtein distance) between cleaned strings
    distance = editdistance.eval(ocr_clean, gt_clean)

    # Calculate CER
    cer = distance / len(gt_clean)

    # Split into words
    ocr_words = ocr_result.split()
    gt_words = ground_truth.split()

    # Compute edit distance (Levenshtein distance) between word lists
    distance_words = editdistance.eval(ocr_words, gt_words)

    # Calculate WER
    wer = distance_words / len(gt_words)

    # Find matched words
    matched_words = [word for word in ocr_words if word in gt_words]

    return cer, wer, matched_words

# main function
def text_clustering(path):
    translated_texts = detect_and_translate_texts(path)
    cluster_texts = cluster_personal_info_and_vaccination_info(translated_texts["texts_with_newline"])

    # Ground truth (reference) text
    ground_truth = "Diphtheria tetanus pertussis Measles mumps rubella"

    # OCR result from your provided data
    ocr_result = translated_texts["texts_without_newline"]

    # Calculate CER, WER, and get matched words
    cer, wer, matched_words = calculate_cer_and_wer(ocr_result, ground_truth)

    print(f"CER: {cer:.4f}")
    print(f"WER: {wer:.4f}")
    print(f"Matched words: {', '.join(matched_words)}")
    # print("\n")

    formatted_texts = format_texts(cluster_texts["personal_info"], cluster_texts["vaccination_info"])
    draw_texts_on_image(path,formatted_texts, "result.png")