def detect_text_and_draw(path):
    """Detects text in the file, translates it to English, and draws bounding boxes around detected text with translated text inside."""
    from google.cloud import vision
    from google.cloud import translate_v2 as translate
    import cv2
    import numpy as np

    client = vision.ImageAnnotatorClient()

    translate_client = translate.Client()

    with open(path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations

    img = cv2.imread(path)

    print("Texts:")
    text_boxes = []
    for text in texts:
        print(f'\n"{text.description}"')

        vertices = [
            (vertex.x, vertex.y) for vertex in text.bounding_poly.vertices
        ]

        for i in range(len(vertices)):
            start_point = vertices[i]
            end_point = vertices[(i + 1) % len(vertices)]
            cv2.line(img, start_point, end_point, (0, 255, 0), 1)

        print("bounds: {}".format(",".join([f"({v[0]},{v[1]})" for v in vertices])))

        translated_text = translate_client.translate(text.description, target_language='en')['translatedText']

        # Calculate the size of the translated text
        (text_width, text_height), _ = cv2.getTextSize(translated_text, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)

        x_coords = [v[0] for v in vertices]
        y_coords = [v[1] for v in vertices]
        min_x, max_x = min(x_coords), max(x_coords)
        min_y, max_y = min(y_coords), max(y_coords)

        # Adjust the max_x to fit the translated text if it's larger
        if text_width > (max_x - min_x):
           max_x = min_x + text_width
        # Adjust the max_y to fit the translated text if it's larger
        if text_height > (max_y - min_y):
           max_y = min_y + text_height
           
        text_boxes.append({
            'min_x': min_x,
            'min_y': min_y,
            'max_x': max_x,
            'max_y': min_y + 20,
            'translated_text': translated_text
        })

    def adjust_text_boxes(boxes):
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                # Adjust x position if boxes overlap horizontally
                while (
                    boxes[i]['min_x'] < boxes[j]['max_x'] and
                    boxes[i]['max_x'] > boxes[j]['min_x'] and
                    boxes[i]['min_y'] == boxes[j]['min_y']
                ):
                    boxes[j]['min_x'] += 20
                    boxes[j]['max_x'] += 20
                # Adjust y position if boxes overlap vertically
                while (
                    boxes[i]['min_x'] < boxes[j]['max_x'] and
                    boxes[i]['max_x'] > boxes[j]['min_x'] and
                    boxes[i]['min_y'] < boxes[j]['max_y'] and
                    boxes[i]['max_y'] > boxes[j]['min_y']
                ):
                    boxes[j]['min_y'] += 20
                    boxes[j]['max_y'] += 20
        return boxes

    text_boxes = adjust_text_boxes(text_boxes)

    for box in text_boxes:
        cv2.rectangle(img, (box['min_x'], box['min_y']), (box['max_x'], box['max_y']), (255, 255, 255), cv2.FILLED)
        cv2.putText(img, box['translated_text'], (box['min_x'], box['min_y'] + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )

    output_path = "result.png"
    cv2.imwrite(output_path, img)
    print(f"Output image saved to {output_path}")