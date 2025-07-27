import os
import torch
import torchvision.transforms as transforms
from PIL import Image
import torchvision.models as models
import traceback

# --- Configuration ---
MODEL_PATH = 'vegnet_rating_resnet18.pth'  # Adjust path as necessary

# Image preprocessing transforms - must match training transforms exactly
image_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

loaded_model = None

def load_ai_model():
    global loaded_model
    if loaded_model is None:
        try:
            if not os.path.exists(MODEL_PATH):
                raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

            checkpoint = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
            num_output_features = 5  # 5 classes for crop conditions

            model = models.resnet18(weights=None)
            num_ftrs = model.fc.in_features
            model.fc = torch.nn.Linear(num_ftrs, num_output_features)

            # checkpoint can be either dict or full model state dict
            if isinstance(checkpoint, dict):
                state_dict = checkpoint
            else:
                state_dict = checkpoint.state_dict()

            # remove 'module.' prefix if trained with DataParallel
            new_state_dict = {}
            for key, val in state_dict.items():
                if key.startswith('module.'):
                    new_state_dict[key[7:]] = val
                else:
                    new_state_dict[key] = val

            model.load_state_dict(new_state_dict)
            model.eval()
            loaded_model = model
            print(f"Model loaded successfully: {MODEL_PATH}")

        except Exception as e:
            print(f"Error loading model: {e}")
            loaded_model = None

    return loaded_model

def get_newest_image_in_folder(folder_path, valid_extensions=('.jpg', '.jpeg', '.png', '.bmp', '.gif')):
    """
    Returns the full path to the newest (latest modified) image in the folder
    or None if no images found.
    """
    try:
        files = [f for f in os.listdir(folder_path) if f.lower().endswith(valid_extensions)]
        if not files:
            print(f"No image files found in folder: {folder_path}")
            return None
        # Sort by modification time descending
        files.sort(key=lambda x: os.path.getmtime(os.path.join(folder_path, x)), reverse=True)
        newest_image = os.path.join(folder_path, files[0])
        return newest_image
    except Exception as e:
        print(f"Error accessing folder '{folder_path}': {e}")
        return None

def get_ai_rating(image_path):
    """
    Given an image file path, perform AI model inference and return a rating string mapped to conditions.

    Class to rating mapping:
        0 -> "1/5.0" (Damaged)
        1 -> "2/5.0" (Dried)
        2 -> "3/5.0" (Old)
        3 -> "4/5.0" (Ripe)
        4 -> "5/5.0" (Unripe)
    """
    model = load_ai_model()
    if model is None:
        return {"success": False, "rating": "N/A", "message": "Model not loaded"}

    condition_rating_map = {
        0: "1/5.0",  # Damaged
        1: "2/5.0",  # Dried
        2: "3/5.0",  # Old
        3: "4/5.0",  # Ripe
        4: "5/5.0",  # Unripe
    }

    try:
        image = Image.open(image_path).convert('RGB')
        image_tensor = image_transforms(image).unsqueeze(0)  # Add batch dimension

        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            _, predicted_idx = torch.max(probabilities, 1)
            class_idx = predicted_idx.item()

        rating = condition_rating_map.get(class_idx, "N/A")

        return {"success": True, "rating": rating, "message": "Analysis successful"}

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"AI analysis error: {e}\n{error_trace}")
        return {"success": False, "rating": "N/A", "message": f"AI analysis failed: {e}"}

# Standalone test example: Analyze the newest image in the folder
if __name__ == "__main__":
    test_folder_path = r"C:\Users\DELL\Desktop\champion\king\uploaded image"  # Change to your folder path
    newest_image_path = get_newest_image_in_folder(test_folder_path)

    if newest_image_path:
        print(f"Analyzing newest image found: {newest_image_path}")
        result = get_ai_rating(newest_image_path)
        print("AI Rating Result:", result)
    else:
        print("No image found to analyze in the folder.")
