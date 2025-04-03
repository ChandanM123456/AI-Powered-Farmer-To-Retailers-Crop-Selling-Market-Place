from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/analyze-crop', methods=['POST'])
def analyze_crop():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']
    image_path = 'temp_image.jpg'  # Save the image temporarily
    image.save(image_path)

    # Call your analysis script (replace with your actual command)
    result = subprocess.run(['python', 'crop_quality_analyzer.py', image_path], capture_output=True, text=True)
    rating = result.stdout.strip()  # Assuming the rating is printed to stdout

    os.remove(image_path)  # Remove the temporary image

    return jsonify({'rating': rating})

if __name__ == '__main__':
    app.run(debug=True)