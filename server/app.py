from flask import Flask, request, send_file, jsonify
import os
import io
from flask_cors import CORS
from textDetect import detect_text_and_draw
from textClustering import text_clustering

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/')
def hello_world():
    return 'Hello, World!'

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
        #detect_text_and_draw(input_image_path)
        text_clustering(input_image_path)
        
        with open('result.png', 'rb') as image_file:
            image_blob = image_file.read()
        
        return send_file(
            io.BytesIO(image_blob),
            mimetype='image/png',
            as_attachment=True,
            download_name='processed_image.png'
        )
    else:
        return 'File is not a PNG image', 400

if __name__ == '__main__':
    app.run(debug=True)
