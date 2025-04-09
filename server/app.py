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

# Load database URL from .env file
# load_dotenv()
# DATABASE_URL = os.getenv("DATABASE_URL")

# Set up SQLAlchemy engine and session
# engine = create_engine(DATABASE_URL)
# db_session = scoped_session(sessionmaker(autocommit=False,
#                                          autoflush=False,
#                                          bind=engine))

# Optional: If you have a base class for your models, bind the engine to it
# Base = declarative_base()
# Base.query = db_session.query_property()

# @app.teardown_appcontext
# def shutdown_session(exception=None):
#     db_session.remove()


@app.route("/")
def hello_world():
    return "Hello, World!"


@app.route("/api/data", methods=["GET"])
def get_data():
    data = {"message": "Hello, API!", "status": "success"}
    return jsonify(data)


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
    app.run(debug=True)