import deepl

auth_key = "32e2f76a-2e5a-4385-bbc6-d6962f4d4816:fx"
translator = deepl.Translator(auth_key)

input_path = "./test.pdf"
output_path = "./result.pdf"

try:
    translator.translate_document_from_filepath(
        input_path,
        output_path,
        source_lang="KO",
        target_lang="EN-US",
        formality="more"
    )
except deepl.DocumentTranslationException as error:
    doc_id = error.document_handle.id
    doc_key = error.document_handle.key
    print(f"Error after uploading: {error}, id: {doc_id} key: {doc_key}")
except deepl.DeepLException as error:
    print(error)































# from google.cloud import vision, translate_v2 as translate
# from PIL import Image, ImageDraw, ImageFont
# import io, requests
# from zipfile import ZipFile
# from io import BytesIO

# def downloaded_font(detected_language, font_size):
#     font_path = {
#         'ko': './NotoSans-VariableFont_wdth,wght.ttf',
#         'en': './NotoSansKR-VariableFont_wght.ttf',
#     }
#     font_url = font_path.get(detected_language, font_path['en']) # Use font URL matched with the language, Default: English
#     font = ImageFont.truetype(font_url, font_size)
#     return font 

# def download_font(language_code, font_size):
#     #Download the font depending on the matched language code and return the URL
#     font_urls = {
#         'ko': 'https://noto-website-2.storage.googleapis.com/pkgs/NotoSansCJKkr-hinted.zip',
#         'en': 'https://noto-website-2.storage.googleapis.com/pkgs/NotoSans-hinted.zip',
#         # Add more font URL of other languages if necessary
#     }
#     font_url = font_urls.get(language_code, font_urls['en'])  # Use font URL matched with the language, Default: English
#     response = requests.get(font_url)
#     zip_file = ZipFile(BytesIO(response.content))
#     font_file = zip_file.extract(zip_file.namelist()[1])  # Extract the font file
#     font = ImageFont.truetype(font_file, font_size)
#     return font

# def write_text_in_image(text, font, width, height, image_name):
#     image = Image.new('RGB', (width, height), color = (255, 255, 255))
#     draw = ImageDraw.Draw(image)
#     margin = 10
#     offset = 10
#     for line in text:
#         draw.text((margin, offset), line, font=font, fill=(0, 0, 0))
#         offset += (font.getbbox(line)[3] - font.getbbox(line)[1]) + 5
#     image.save(image_name)
#     image.show()

# def write_text_in_file(text, file_name):
#     # Open a file in write mode
#     with open(file_name, "w") as file:
#         # Write the text to the file
#         file.write(text)

# # API Client Initialization
# vision_client = vision.ImageAnnotatorClient()
# translate_client = translate.Client()

# # Read the image file
# file_path = './VAXRecord-Korea1.png'
# with io.open(file_path, 'rb') as image_file:
#     content = image_file.read()

# # Extract the text from the image
# image = vision.Image(content=content)
# response = vision_client.document_text_detection(image=image)
# detected_texts = ""
# texts = ""
# if response.text_annotations:
#    detected_texts = response.text_annotations[0].description
#    texts = response.text_annotations

# # Figure out the language of the text
# detected_language = translate_client.detect_language(detected_texts)['language']
# font = downloaded_font(detected_language, 20)

# # Create an empty txt file and image and fill out with the extracted text
# write_text_in_file(detected_texts, "detected_result.txt")
# write_text_in_image(detected_texts.split('\n'), font, 800, 2000, 'output_image1.png')

# if detected_language != 'en':
#    translated_text = translate_client.translate(detected_texts, target_language='en')['translatedText']
#    translated_words = translated_text.split()
#    # Download the font and fill the empty txt file and image with the translated text
#    font = downloaded_font('en', 20)
#    write_text_in_file(translated_text, "translated_result.txt")
#    write_text_in_image(translated_words, font, 800, 2000, 'output_image2.png')
# else:
#    print("Don't need to translate")