# train_vegnet.py

import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models, transforms
from torch.utils.data import DataLoader, random_split
from vegnet_dataset import VegNetDataset

# Set to your actual data folder (change if needed)
ROOT_DIR = r"C:\Users\DELL\Desktop\champion\king\New VegNet\4. Tomato"

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Create Dataset
dataset = VegNetDataset(ROOT_DIR, transform=transform)
print(f"Total images found: {len(dataset)}")

num_classes = 5  # Ripe/Unripe/Old/Dried/Damaged

# Split into 80% train, 20% val
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_data, val_data = random_split(dataset, [train_size, val_size])
train_loader = DataLoader(train_data, batch_size=32, shuffle=True)
val_loader = DataLoader(val_data, batch_size=32)

# Modern recommended syntax for weights — no deprecation warning!
model = models.resnet18(weights="DEFAULT")
model.fc = nn.Linear(model.fc.in_features, num_classes)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=1e-4)

for epoch in range(10):
    model.train()
    total, correct = 0, 0
    for images, labels, _ in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        _, preds = outputs.max(1)
        total += labels.size(0)
        correct += (preds == labels).sum().item()
    acc = correct / total * 100
    print(f"Epoch {epoch+1} | Train Acc: {acc:.1f}%")
print("Training done.")

torch.save(model.state_dict(), "vegnet_rating_resnet18.pth")
print("Model saved as vegnet_rating_resnet18.pth")
