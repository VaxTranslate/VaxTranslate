import openai
import os
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
    texts = response.text_annotations[0]
    
    translated_texts = translate_client.translate(texts.description, target_language='en')['translatedText']
    
    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    
    return translated_texts

# Cluster the data based on the similarity between each text data
def text_formatting(translated_texts):
    openai.api_key = openai_api_key

    # Little formatting for the translated_texts
    combined_texts = "\n\n".join(translated_texts)
    
    # Command propmt for OpenAI API
    prompt = f"Cluster the following texts into two categories: 'personal information' and 'vaccination details'. Organize and display them under these exact headings only:\n\n{translated_texts}"

    # Response from OpenAI API
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", "content": "Cluster texts into personal information and vaccination details:"},
            {"role": "user", "content": prompt}
        ]
    )
    
    # Return the message as a string
    return response.choices[0].message.content.strip()
      
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

# main function
def text_clustering(path):
    translated_texts = detect_and_translate_texts(path)
    formatted_texts = text_formatting(translated_texts)
    draw_texts_on_image(path,formatted_texts, "result.png")