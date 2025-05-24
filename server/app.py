from flask import Flask, request, send_file, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os
import io
import json
from flask_cors import CORS
from textClustering import text_clustering
from textDetect import detect_text_and_draw
from pdf2image import convert_from_path, convert_from_bytes  # type: ignore
from pdf2image.exceptions import (  # type: ignore
    PDFInfoNotInstalledError,
    PDFPageCountError,
    PDFSyntaxError,
)

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
PROCESSED_FOLDER = "processed"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "vaxtranslate-423905-15fcc3121322.json"

@app.route("/")
def hello_world():
    return "Hello, World!"


@app.route("/api/data", methods=["GET"])
def get_data():
    data = {"message": "Hello, API!", "status": "success"}
    return jsonify(data)


@app.route("/detect-text", methods=["POST"])
def detect_text():
    """Endpoint for text detection and translation with bounding boxes"""
    print("\n==== RECEIVED TEXT DETECTION REQUEST ====")
    
    try:
        if "file" not in request.files:
            print("ERROR: No file part in request")
            return jsonify({"error": "No file part"}), 400
        
        file = request.files["file"]
        
        if file.filename == "":
            print("ERROR: No selected file")
            return jsonify({"error": "No selected file"}), 400
        
        print(f"File received for text detection: {file.filename}, Type: {file.content_type}")
        
        if file and (file.filename.endswith(".png") or file.filename.endswith(".jpg") or file.filename.endswith(".jpeg") or file.filename.endswith(".pdf")):
            input_file_path = os.path.join(UPLOAD_FOLDER, f"detect_{file.filename}")
            
            try:
                file.save(input_file_path)
                print(f"File saved to: {input_file_path}")
            except Exception as e:
                print(f"ERROR saving file: {str(e)}")
                return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

            try:
                # Handle PDF conversion if needed
                if file.filename.endswith(".pdf"):
                    print("Converting PDF to image for text detection...")
                    try:
                        image = convert_from_path(input_file_path, fmt="png")
                        converted_image_path = os.path.join(UPLOAD_FOLDER, f"converted_detect_{file.filename.replace('.pdf', '.png')}")
                        image[0].save(converted_image_path, "PNG")
                        print(f"Converted PDF to image: {converted_image_path}")
                        input_file_path = converted_image_path
                    except Exception as pdf_error:
                        print(f"ERROR converting PDF: {str(pdf_error)}")
                        return jsonify({"error": f"PDF conversion failed: {str(pdf_error)}"}), 500
                
                # Test if Google Cloud credentials are working
                print("Testing Google Cloud credentials...")
                try:
                    from google.cloud import vision
                    client = vision.ImageAnnotatorClient()
                    print("Google Cloud Vision client initialized successfully")
                except Exception as cred_error:
                    print(f"ERROR with Google Cloud credentials: {str(cred_error)}")
                    return jsonify({"error": f"Google Cloud credentials error: {str(cred_error)}"}), 500
                
                # Process the image for text detection
                print("Running text detection and translation...")
                detect_text_and_draw(input_file_path)
                
                # The function saves the result as "result.png"
                result_path = "result.png"
                
                if os.path.exists(result_path):
                    print(f"Text detection completed. Result saved to: {result_path}")
                    
                    # Return the processed image
                    return send_file(
                        result_path,
                        as_attachment=True,
                        download_name=f"detected_{file.filename.replace('.pdf', '.png')}",
                        mimetype='image/png'
                    )
                else:
                    print("ERROR: Result image not found")
                    return jsonify({"error": "Text detection failed - result image not generated"}), 500
                    
            except Exception as processing_error:
                print(f"ERROR during text processing: {str(processing_error)}")
                import traceback
                print(f"Full traceback: {traceback.format_exc()}")
                return jsonify({"error": f"Text processing failed: {str(processing_error)}"}), 500
                
        else:
            print(f"ERROR: Unsupported file type for text detection: {file.filename}")
            return jsonify({"error": "File must be PNG, JPG, JPEG, or PDF"}), 400
            
    except Exception as e:
        print(f"UNEXPECTED ERROR in detect_text endpoint: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

@app.route("/upload", methods=["POST"])
def upload_file():
    print("\n==== RECEIVED UPLOAD REQUEST ====")
    
    if "file" not in request.files:
        print("ERROR: No file part in request")
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    
    # Get the country parameter
    country = request.form.get("country", "Other")
    print(f"Country selected: {country}")
    
    if file.filename == "":
        print("ERROR: No selected file")
        return jsonify({"error": "No selected file"}), 400
    
    print(f"File received: {file.filename}, Type: {file.content_type}")
    
    if file and (file.filename.endswith(".png") or file.filename.endswith(".pdf")):
        input_file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        output_file_path = os.path.join(PROCESSED_FOLDER, "processed_" + file.filename)
        file.save(input_file_path)
        print(f"File saved to: {input_file_path}")

        try:
            # Process the file based on file type
            if file.filename.endswith(".png"):
                print("Processing PNG file...")
                # Pass the country parameter to text_clustering
                cis_formatted = text_clustering(input_file_path, country=country)
                
                # Debug output
                print(f"CIS formatted data type: {type(cis_formatted)}")
                print(f"CIS formatted keys: {cis_formatted.keys() if isinstance(cis_formatted, dict) else 'Not a dict'}")
                
                if isinstance(cis_formatted, dict) and "child" in cis_formatted:
                    print(f"Child data: {json.dumps(cis_formatted['child'], indent=2)}")
                
                # The text_clustering function now returns a properly structured JSON object
                print("Returning CIS formatted data to frontend")
                return jsonify(cis_formatted)
                
            elif file.filename.endswith(".pdf"):
                print("Processing PDF file...")
                # Convert PDF to image
                image = convert_from_path(input_file_path, fmt="png")
                converted_image_path = f"converted_record.png"
                image[0].save(converted_image_path, "PNG")
                print(f"Converted PDF to image: {converted_image_path}")

                # Pass the country parameter to text_clustering
                cis_formatting = text_clustering(converted_image_path, country=country)
                
                # Debug output
                print(f"CIS formatted data type from PDF: {type(cis_formatting)}")
                if isinstance(cis_formatting, dict):
                    print(f"CIS formatted keys from PDF: {cis_formatting.keys()}")
                    if "child" in cis_formatting:
                        print(f"Child data from PDF: {json.dumps(cis_formatting['child'], indent=2)}")
                
                # Return the properly structured JSON
                print("Returning CIS formatted data from PDF to frontend")
                return jsonify(cis_formatting)
        
        except Exception as e:
            print(f"ERROR during processing: {str(e)}")
            # Return a properly structured error response
            error_response = {
                "error": str(e),
                "child": {
                    "first_name": "",
                    "middle_initial": "",
                    "last_name": "",
                    "birthdate": ""
                },
                "required_vaccines": {},
                "recommended_vaccines": {}
            }
            return jsonify(error_response), 500

        return jsonify({"message": "File processed successfully", "country": country}), 200
    else:
        print(f"ERROR: Unsupported file type: {file.filename}")
        return jsonify({"error": "File is not a PNG or PDF image"}), 400
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
