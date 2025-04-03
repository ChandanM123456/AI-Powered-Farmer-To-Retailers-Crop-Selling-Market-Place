import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
import json
import base64
from http.server import BaseHTTPRequestHandler, HTTPServer

# Load pre-trained ResNet50 model
print("🔄 Loading AI Model...")
model = ResNet50(weights='imagenet')
print("✅ AI Model Loaded!")

def analyze_crop_quality(image_bytes):
    """Analyzes crop quality and predicts AI rating & demand percentage."""
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
        img_array = preprocess_input(np.expand_dims(image.img_to_array(img), axis=0))

        # Make prediction
        predictions = model.predict(img_array)
        decoded = decode_predictions(predictions, top=5)[0]

        quality_score = 5
        demand_score = 50  # Default

        for _, label, prob in decoded:
            if "rotten" in label or "damaged" in label:
                quality_score -= prob * 5
            if "spot" in label or "hole" in label:
                quality_score -= prob * 3
            if "fresh" in label:
                demand_score += prob * 10
            if "disease" in label or "fungus" in label:
                demand_score -= prob * 15

        return max(1, round(quality_score)), max(10, min(round(demand_score), 100))

    except Exception as e:
        print(f"❌ Error: {e}")
        return 3, 50  # Default fallback values

class RequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/analyze-crop-quality':
            try:
                content_length = int(self.headers['Content-Length'])
                data = json.loads(self.rfile.read(content_length).decode('utf-8'))
                image_bytes = base64.b64decode(data['image'].split(',')[1])

                quality, demand = analyze_crop_quality(image_bytes)

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'quality_rating': quality, 'demand_percentage': demand}).encode('utf-8'))

            except Exception as e:
                print(f"❌ Error Processing Request: {e}")
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Invalid request'}).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    """Starts the AI Crop Quality Server."""
    httpd = server_class(('', port), handler_class)
    print(f'🚀 AI Server Running on http://localhost:{port}')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
