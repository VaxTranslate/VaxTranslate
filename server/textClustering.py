import openai
import os
import editdistance
import json
import difflib
import re
from PIL import Image, ImageDraw, ImageFont
from google.cloud import vision
from google.cloud import translate_v2 as translate
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the API keys from the environment variables
openai_api_key = os.getenv('OPENAI_API_KEY')

# Load vaccine translations JSON data
def load_vaccine_translations():
    # The JSON data can be loaded from a file or hardcoded
    vaccine_data = {
  "countries": [
    {
      "country": "Angola",
      "language": "Angolan Portuguese",
      "vaccines": [
        {"local": "DTwp-Hib-HepB (Vacina conjugada 5 em 1)", "english": "DTaP/Tdap", "equivalency": "not equal"},
        {"local": "MR", "english": "MMR", "equivalency": "not equal"},
        {"local": "IPV", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "OPV", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "PCV13", "english": "PCV13", "equivalency": "not equal"},
        {"local": "Hepatitis B", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp-Hib-HepB (Vacina conjugada 5 em 1)", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp-Hib-HepB (5 in 1 conjugate vaccine)", "english": "Haemophilus influenzae type B", "equivalency": "equal"},
        {"local": "Varicella", "english": "Varicella (VAR)", "equivalency": "not equal"}
      ]
    },
    {
      "country": "Colombia",
      "language": "Spanish",
      "vaccines": [
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "DTap/Tdap", "equivalency": "equal"},
        {"local": "DT", "english": "DTap/Tdap", "equivalency": "equal"},
        {"local": "DTwp", "english": "DTap/Tdap", "equivalency": "equal"},
        {"local": "Triple Viral SRP (MMR)", "english": "MMR", "equivalency": "equal"},
        {"local": "IPV", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "Sabin (OPV)", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "PCV10", "english": "PCV13", "equivalency": "equal"},
        {"local": "Antihepatitis B pediátrico", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp-Hib-HepB (Pentavalente)", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "Haemophilus influenzae type B", "equivalency": "equal"},
        {"local": "Varicella (VAR)", "english": "Varicella (VAR)", "equivalency": "equal"}
      ]
    },
    {
      "country": "Democratic Republic of Congo",
      "language": "French",
      "vaccines": [
        {"local": "DTwp-Hib-HepB", "english": "DTaP/Tdap", "equivalency": "not equal"},
        {"local": "MR", "english": "MMR", "equivalency": "not equal"},
        {"local": "IPV", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "OPV", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "PCV13", "english": "PCV13", "equivalency": "not equal"},
        {"local": "DTwp-Hib-HepB", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp-Hib-HepB", "english": "Haemophilus influenzae", "equivalency": "equal"},
        {"local": "Varicella", "english": "Varicella VAR", "equivalency": "not equal"}
      ]
    },
    {
      "country": "Guatemala",
      "language": "Spanish",
      "vaccines": [
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "DTaP/Tdap", "equivalency": "not equal"},
        {"local": "DTwp", "english": "DTaP/Tdap", "equivalency": "not equal"},
        {"local": "Td", "english": "DTaP/Tdap", "equivalency": "not equal"},
        {"local": "Triple Viral SRP (MMR)", "english": "MMR", "equivalency": "equal"},
        {"local": "IPV", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "Sabin (OPV)", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "PCV13", "english": "PCV13", "equivalency": "not equal"},
        {"local": "Antihepatitis B Pediatric Hepatitis B Vaccine", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp+Hib+HepB (5 in 1 conjugate vaccine)", "english": "Haemophilus influenzae type B", "equivalency": "equal"},
        {"local": "Varicella", "english": "Varicella VAR", "equivalency": "not equal"}
      ]
    },
    {
      "country": "Mexico",
      "language": "Spanish",
      "vaccines": [
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "DTaP/Tdap", "equivalency": "not equal"},
        {"local": "Td (toxoide tetánico y difteria para niños mayores y adultos)", "english": "DTaP/Tdap", "equivalency": "not equal"},
        {"local": "Triple Viral SRP (MMR)", "english": "MMR", "equivalency": "equal"},
        {"local": "Sabin OPV", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "PCV13", "english": "PCV13", "equivalency": "not equal"},
        {"local": "Antihepatitis B pediátrico", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "Haemophilus influenzae type B", "equivalency": "equal"},
        {"local": "Varicela", "english": "Varicella VAR", "equivalency": "not equal"}
      ]
    },
    {
      "country": "Venezuela",
      "language": "Spanish",
      "vaccines": [
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "DTaP/Tdap", "equivalency": "not equal"},
        {"local": "Td (toxoide tetánico y difteria para niños mayores y adultos)", "english": "DTaP/Tdap", "equivalency": "not equal"},
        {"local": "Triple Viral SRP (MMR)", "english": "MMR", "equivalency": "equal"},
        {"local": "IPV", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "Sabin OPV", "english": "IPV or OPV", "equivalency": "equal"},
        {"local": "PCV13", "english": "PCV13", "equivalency": "not equal"},
        {"local": "Antihepatitis B pediátrico", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "Hep B", "equivalency": "equal"},
        {"local": "DTwp+Hib+HepB (Pentavalente)", "english": "Haemophilus influenzae type B", "equivalency": "equal"},
        {"local": "Varicela", "english": "Varicella VAR", "equivalency": "not equal"}
      ]
    }
  ]
}
    return vaccine_data

def get_country_vaccine_translations(country):
    vaccine_data = load_vaccine_translations()
    
    # Fix Venezuela spelling if needed (Venezuala → Venezuela)
    if country == "Venezuala":
        country = "Venezuela"
    
    # Look for matching country data
    for country_data in vaccine_data["countries"]:
        if country_data["country"].lower() == country.lower():
            return country_data
    
    # Return None if country not found
    return None

def format_vaccine_translations_for_prompt(country_data):
    """Format the vaccine translations into a string for the OpenAI prompt"""
    if not country_data:
        return ""
    
    result = f"\nVaccine name translations for {country_data['country']} ({country_data['language']}):\n"
    result += "| Local Name | US Equivalent | Equivalency |\n"
    result += "|-----------|--------------|--------------|\n"
    
    for vaccine in country_data["vaccines"]:
        result += f"| {vaccine['local']} | {vaccine['english']} | {vaccine['equivalency']} |\n"
    
    return result

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
        return {"texts_without_newline": "", "texts_with_newline": "", "original_lines": []}
    
    # Extract the full text description
    full_text = texts[0].description

    translated_texts = {
        "texts_without_newline": "",
        "texts_with_newline": "",
        "original_lines": []  # Store original lines for reference
    }
    
    # 1. Extract the translated texts, which aren't split by \n
    translated_texts["texts_without_newline"] = translate_client.translate(full_text, target_language='en')['translatedText']

    # 2. Extract the translated texts, which are split by \n
    # Split the text into lines
    lines = full_text.split('\n')

    # Store original lines for reference
    translated_texts["original_lines"] = lines.copy()

    translated_lines = []
    for line in lines:
        # Translate each line of texts into English
        translated_text = translate_client.translate(line, target_language='en')['translatedText']
        # Add each line of translated texts in the list
        translated_lines.append(translated_text)
    
    # Join the translated lines of texts with newline characters
    translated_texts["texts_with_newline"] = "\n".join(translated_lines)

    return translated_texts

def match_vaccines_with_original_text(vaccine_names, original_lines, translated_lines):
    """
    Match vaccine names from the processed JSON with their original counterparts
    in the source document by comparing line by line between original and translated text.
    
    Args:
        vaccine_names: List of vaccine names extracted from the JSON result
        original_lines: Original text lines before translation
        translated_lines: Translated text lines
    
    Returns:
        Dictionary mapping vaccine names to their original text
    """
    matches = {}
    
    # Common vaccine-related terms to help with matching
    vaccine_indicators = [
        'vaccine', 'vac', 'vacc', 'vacuna', 'vacina', 'immunization', 
        'dta', 'dtap', 'tdap', 'mmr', 'polio', 'ipv', 'opv', 
        'hep', 'hepatitis', 'bcg', 'pent', 'triple'
    ]
    
    # Preprocess the translated lines to extract potential vaccine mentions
    translated_vaccine_lines = []
    for i, line in enumerate(translated_lines):
        line_lower = line.lower()
        if any(indicator in line_lower for indicator in vaccine_indicators):
            translated_vaccine_lines.append((i, line))
    
    # For each vaccine name, find the best matching line
    for vaccine_name in vaccine_names:
        vaccine_lower = vaccine_name.lower()
        best_match = None
        best_score = 0
        best_index = -1
        
        # Try to find exact substring match first
        for i, (line_idx, line) in enumerate(translated_vaccine_lines):
            if vaccine_lower in line.lower():
                similarity = 1.0  # Perfect substring match
                if similarity > best_score:
                    best_score = similarity
                    best_match = line
                    best_index = line_idx
        
        # If no exact match, use string similarity
        if best_match is None:
            for i, (line_idx, line) in enumerate(translated_vaccine_lines):
                # Calculate similarity using difflib
                similarity = difflib.SequenceMatcher(None, vaccine_lower, line.lower()).ratio()
                
                # Calculate edit distance and normalize
                max_len = max(len(vaccine_lower), len(line.lower()))
                if max_len > 0:
                    ed_score = 1 - (editdistance.eval(vaccine_lower, line.lower()) / max_len)
                else:
                    ed_score = 0
                
                # Combine metrics (weighted average)
                combined_score = (similarity * 0.7) + (ed_score * 0.3)
                
                if combined_score > best_score:
                    best_score = combined_score
                    best_match = line
                    best_index = line_idx
        
        # If we found a match with reasonable confidence
        if best_score > 0.4 and best_index >= 0:
            # Use the corresponding original line
            matches[vaccine_name] = original_lines[best_index]
    
    return matches

def simple_enhance_with_ai_metadata(vaccines_dict, original_text_matches):
    """
    Add AI translation metadata to vaccine entries when no country data is available
    
    Args:
        vaccines_dict: Dictionary of vaccine data to enhance
        original_text_matches: Dictionary mapping vaccine names to original text
    """
    for vaccine_name, vaccine_data in list(vaccines_dict.items()):
        # Get original text match if available
        original_text = original_text_matches.get(vaccine_name, "")
        
        if isinstance(vaccine_data, dict):
            # Add metadata to the existing dictionary
            vaccine_data["__translationMeta"] = {
                "source": "ai",
                "original": original_text
            }
        else:
            # Convert string value to a dictionary with metadata
            vaccines_dict[vaccine_name] = {
                "date": vaccine_data,
                "__translationMeta": {
                    "source": "ai",
                    "original": original_text
                }
            }

def enhance_vaccines_with_translation_metadata(vaccines_dict, country_data, original_text_matches=None):
    """
    Add translation metadata to each vaccine entry based on matches from the country data
    and original text matches.
    
    Args:
        vaccines_dict: Dictionary of vaccine data to enhance
        country_data: Dictionary containing country-specific vaccine translations
        original_text_matches: Dictionary mapping vaccine names to original text
    """
    if not country_data or "vaccines" not in country_data:
        simple_enhance_with_ai_metadata(vaccines_dict, original_text_matches or {})
        return
    
    # Create a mapping of local vaccine names to their English equivalents
    local_to_english = {}
    english_to_local = {}
    
    for vaccine in country_data["vaccines"]:
        local_name = vaccine["local"].lower()
        english_name = vaccine["english"].lower()
        
        local_to_english[local_name] = vaccine
        
        # Also create a reverse mapping from English to local names
        if english_name not in english_to_local:
            english_to_local[english_name] = []
        english_to_local[english_name].append(vaccine)
    
    # Function to check if a vaccine name matches any in our dataset
    def find_matching_vaccine(vaccine_name, original_name=None):
        """
        Find a matching vaccine in our country-specific data
        
        Args:
            vaccine_name: The English vaccine name to match
            original_name: The original untranslated name (if available)
            
        Returns:
            Matched vaccine data or None
        """
        # Try direct match with original name first if available
        if original_name:
            original_lower = original_name.lower()
            if original_lower in local_to_english:
                return local_to_english[original_lower]
            
            # Try partial match with original name
            for local_name, data in local_to_english.items():
                # Check if local name is a substring of original or vice versa
                if local_name in original_lower or original_lower in local_name:
                    # Calculate similarity to ensure it's a good match
                    similarity = difflib.SequenceMatcher(None, local_name, original_lower).ratio()
                    if similarity > 0.7:  # Threshold for partial match
                        return data
        
        # Try matching the English name
        vaccine_lower = vaccine_name.lower()
        
        # Direct match with translated name
        if vaccine_lower in english_to_local:
            return english_to_local[vaccine_lower][0]  # Return the first match
        
        # Check for partial English name matches
        for english_name, data_list in english_to_local.items():
            # Check if English name is a substring of vaccine or vice versa
            if english_name in vaccine_lower or vaccine_lower in english_name:
                # Calculate similarity to ensure it's a good match
                similarity = difflib.SequenceMatcher(None, english_name, vaccine_lower).ratio()
                if similarity > 0.7:  # Threshold for partial match
                    return data_list[0]  # Return the first match
        
        # No match found
        return None
    
    # Process each vaccine in the dictionary
    for vaccine_name, vaccine_data in list(vaccines_dict.items()):
        # Get original text match if available
        original_text = original_text_matches.get(vaccine_name, "") if original_text_matches else ""
        
        # Try to find a matching vaccine
        matched_vaccine = find_matching_vaccine(vaccine_name, original_text)
        
        if matched_vaccine:
            # This is a match from our dataset
            if isinstance(vaccine_data, dict):
                # Add metadata to the existing dictionary
                vaccine_data["__translationMeta"] = {
                    "source": "dataset",
                    "original": original_text or matched_vaccine["local"],
                    "english": matched_vaccine["english"],
                    "equivalency": matched_vaccine["equivalency"]
                }
            else:
                # Convert string value to a dictionary with metadata
                vaccines_dict[vaccine_name] = {
                    "date": vaccine_data,
                    "__translationMeta": {
                        "source": "dataset",
                        "original": original_text or matched_vaccine["local"],
                        "english": matched_vaccine["english"],
                        "equivalency": matched_vaccine["equivalency"]
                    }
                }
        else:
            # This is an AI-translated vaccine name
            if isinstance(vaccine_data, dict):
                # Add metadata to the existing dictionary
                vaccine_data["__translationMeta"] = {
                    "source": "ai",
                    "original": original_text
                }
            else:
                # Convert string value to a dictionary with metadata
                vaccines_dict[vaccine_name] = {
                    "date": vaccine_data,
                    "__translationMeta": {
                        "source": "ai",
                        "original": original_text
                    }
                }

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
    # Print the final prompt being sent to OpenAI
    print("Final prompt being sent to OpenAI:")
    print(prompt)
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

def cis(translated_texts, country=None):
    openai.api_key = openai_api_key
    
    # Get country-specific vaccine translations if available
    country_data = None
    vaccine_translations_text = ""
    
    if country and country != "Other":
        country_data = get_country_vaccine_translations(country)
        if country_data:
            vaccine_translations_text = format_vaccine_translations_for_prompt(country_data)
    
    prompt = f"""
    Extract the relevant data from the provided immunization record and format it into the following consistent JSON structure. Each field should always appear, even if the values are empty or marked as "N/A." Use this example JSON as a template:

    {{
      "child": {{
        "last_name": "Doe",
        "first_name": "John",
        "middle_initial": "A",
        "birthdate": "01/15/2010"
      }},
      "required_vaccines": {{
        "DTaP": {{
          "date_1": "01/01/2011",
          "date_2": "03/01/2011",
          "date_3": "05/01/2011",
          "date_4": "08/01/2011",
          "date_5": "12/01/2011"
        }},
        "Tdap": {{
          "date_1": "01/01/2017"
        }},
        "DT_or_Td": {{
          "date_1": "N/A"
        }},
        "Hepatitis_B": {{
          "date_1": "02/01/2011",
          "date_2": "06/01/2011",
          "date_3": "10/01/2011"
        }},
        "Hib": {{
          "date_1": "N/A"
        }},
        "IPV": {{
          "date_1": "02/01/2011",
          "date_2": "04/01/2011",
          "date_3": "06/01/2011",
          "date_4": "09/01/2011"
        }},
        "OPV": {{
          "date_1": "N/A"
        }},
        "MMR": {{
          "date_1": "02/01/2012",
          "date_2": "04/01/2012"
        }},
        "PCV_or_PPSV": {{
          "date_1": "N/A"
        }},
        "Varicella": {{
          "date_1": "03/01/2012"
        }}
      }},
      "recommended_vaccines": {{
        "COVID_19": "N/A",
        "Flu": "N/A",
        "Hepatitis_A": "N/A",
        "HPV": "N/A",
        "MCV_or_MPSV": "N/A",
        "MenB": "N/A",
        "Rotavirus": "N/A"
      }},
      "parent_guardian_signature": {{
        "signature": "John Doe",
        "date": "09/01/2023"
      }},
      "conditional_status": {{
        "status": false,
        "note": "All vaccinations complete"
      }},
      "health_care_provider": {{
        "name": "Dr. Smith",
        "signature": "Dr. Smith",
        "date": "09/01/2023"
      }},
      "documentation_of_disease_immunity": {{
        "verified": true,
        "diseases": [
          "Varicella"
        ]
      }}
    }}
    {vaccine_translations_text}
    Extract and format the data from the following text:

    {translated_texts}
    """
    print("FINAL PROMPT", prompt)
    # Call OpenAI API to extract vaccination information
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "Cluster texts into vaccination details:"},
            {"role": "user", "content": prompt}
        ]
    )

    organized_json = response

    return organized_json

# main function
def text_clustering(path, country=None):
    """
    Main function to process an image of a vaccination record, extract text,
    translate it, and format it according to the CIS standard.
    
    Args:
        path: Path to the image file
        country: Country of origin for the vaccination record (optional)
        
    Returns:
        Formatted JSON with vaccination data and translation metadata
    """
    # Get translated text and original lines
    translated_result = detect_and_translate_texts(path)
    translated_texts = translated_result["texts_with_newline"]
    original_lines = translated_result["original_lines"]
    
    # Split the translated text into lines for matching
    translated_lines = translated_texts.split('\n')
    
    # Pass the country parameter to the cis function
    response = cis(translated_texts, country)
    
    # Parse the JSON content from the OpenAI response
    try:
        import json
        formatted_json = json.loads(response.choices[0].message.content)
        
        # Ensure the required structure exists to prevent errors in the frontend
        if "child" not in formatted_json:
            formatted_json["child"] = {
                "first_name": "",
                "middle_initial": "",
                "last_name": "",
                "birthdate": ""
            }
        
        if "required_vaccines" not in formatted_json:
            formatted_json["required_vaccines"] = {}
            
        if "recommended_vaccines" not in formatted_json:
            formatted_json["recommended_vaccines"] = {}
        
        # Add country information
        formatted_json["country_of_origin"] = country or "Other"
        
        # Extract all vaccine names
        all_vaccines = list(formatted_json["required_vaccines"].keys()) + list(formatted_json["recommended_vaccines"].keys())
        
        # Match vaccines with their original names
        original_vaccine_matches = match_vaccines_with_original_text(all_vaccines, original_lines, translated_lines)
        
        # If country is specified and exists in our database, check vaccine names against translations
        if country and country != "Other":
            country_data = get_country_vaccine_translations(country)
            if country_data:
                # Process required vaccines
                enhance_vaccines_with_translation_metadata(
                    formatted_json["required_vaccines"], 
                    country_data,
                    original_vaccine_matches
                )
                
                # Process recommended vaccines
                enhance_vaccines_with_translation_metadata(
                    formatted_json["recommended_vaccines"], 
                    country_data,
                    original_vaccine_matches
                )
        else:
            # Even without country data, we can add AI translation metadata
            simple_enhance_with_ai_metadata(formatted_json["required_vaccines"], original_vaccine_matches)
            simple_enhance_with_ai_metadata(formatted_json["recommended_vaccines"], original_vaccine_matches)
        
        return formatted_json
    except json.JSONDecodeError:
        # If JSON parsing fails, return a properly structured object with the raw text
        default_json = {
            "child": {
                "first_name": "",
                "middle_initial": "",
                "last_name": "",
                "birthdate": ""
            },
            "required_vaccines": {},
            "recommended_vaccines": {},
            "raw_text": response.choices[0].message.content,
            "country_of_origin": country or "Other"
        }
        return default_json