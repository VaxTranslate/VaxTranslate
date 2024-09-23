def detect_text_and_return_json(path):
    """Detects text in the image, translates it to English, and returns the detected information in JSON format."""
    from google.cloud import vision
    from google.cloud import translate_v2 as translate

    # Initialize the Google Cloud Vision and Translation clients
    client = vision.ImageAnnotatorClient()
    translate_client = translate.Client()

    # Read the image file
    with open(path, "rb") as image_file:
        content = image_file.read()

    # Perform text detection on the image
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if response.error.message:
        raise Exception(
            f"Error: {response.error.message}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors"
        )

    detected_text_info = []
    
    # Process each detected text annotation
    for i, text in enumerate(texts):
        # Skip the first annotation (contains the entire block of text)
        if i == 0:
            continue

        # Get the bounding box coordinates
        vertices = [(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices]

        # Translate the text to English if necessary
        translated_text = translate_client.translate(text.description, target_language='en')['translatedText']

        # Store the detected text and its bounding box info
        detected_text_info.append({
            'detected_text': text.description,
            'translated_text': translated_text,
            'bounding_box': {
                'vertices': vertices
            }
        })

    return detected_text_info
