# test_vegnet.py

import os
import torch
from torchvision import models, transforms
from vegnet_dataset import VegNetDataset
from torch.utils.data import DataLoader
import matplotlib.pyplot as plt

# === SET THIS TO YOUR FOLDER: (single crop or all vegs) ===
# Example: r"C:\Users\DELL\Desktop\champion\king\New VegNet\4. Tomato"
ROOT_DIR = r"C:\Users\DELL\Desktop\champion\king\New VegNet\4. Tomato"  # <-- adjust as needed

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Safe dataset loading, with error message if empty
dataset = VegNetDataset(ROOT_DIR, transform=transform)
if len(dataset) == 0:
    print(f"ERROR: No images found in {ROOT_DIR}. Check the path and that folders contain images!")
    exit(1)
else:
    print(f"Loaded {len(dataset)} images.")

loader = DataLoader(dataset, batch_size=8, shuffle=True)

# Infer class count (useful if you train on a subset/crop)
num_classes = max(dataset.labels) if hasattr(dataset, "labels") and dataset.labels else 5

# Load Model - match training
model = models.resnet18(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, num_classes)
model.load_state_dict(torch.load("vegnet_rating_resnet18.pth", map_location="cpu"))
model.eval()

# Inference
images, labels, vegs = next(iter(loader))
with torch.no_grad():
    preds = model(images)
    pred_classes = preds.argmax(1).tolist()

# Plot results
def imshow(img, title=None):
    img = img.permute(1, 2, 0).numpy()
    plt.imshow(img)
    if title:
        plt.title(title, fontsize=8)
    plt.axis("off")

plt.figure(figsize=(16, 3))
for i in range(len(images)):
    gt = labels[i].item() + 1  # ground truth (1-based)
    pred = pred_classes[i] + 1 # predicted (1-based)
    veg_name = vegs[i] if isinstance(vegs, list) or isinstance(vegs, tuple) else str(vegs)
    plt.subplot(1, 8, i+1)
    imshow(images[i], f"GT:{gt}\nPR:{pred}")
plt.tight_layout()
plt.show()
