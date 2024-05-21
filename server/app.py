from flask import Flask, request, send_file
import os
from textDetect import detect_text_and_draw

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Define a simple route
@app.route('/')
def hello_world():
    return 'Hello, World!'

# Define an API endpoint
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'message': 'Hello, API!',
        'status': 'success'
    }
    return jsonify(data)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file and file.filename.endswith('.png'):
        input_image_path = os.path.join(UPLOAD_FOLDER, file.filename)
        output_image_path = os.path.join(PROCESSED_FOLDER, 'processed_' + file.filename)
        file.save(input_image_path)
        
        # Process the image
        detect_text_and_draw(input_image_path)
        
        return send_file('result.png', mimetype='image/png')
    else:
        return 'File is not a PNG image', 400

if __name__ == '__main__':
    app.run(debug=True)