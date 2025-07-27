# vegnet_dataset.py
import os
from PIL import Image
from torch.utils.data import Dataset

QUALITY_TO_RATING = {
    "Unripe": 1,
    "Dried": 2,
    "Damaged": 3,
    "Old": 4,
    "Ripe": 5
}

class VegNetDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.samples = []
        self.labels = []
        self.veg_types = []
        self.transform = transform

        for quality in os.listdir(root_dir):
            qpath = os.path.join(root_dir, quality)
            if not os.path.isdir(qpath): continue
            if quality not in QUALITY_TO_RATING: continue
            rating = QUALITY_TO_RATING[quality]
            image_files = [f for f in os.listdir(qpath) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            for fname in image_files:
                self.samples.append(os.path.join(qpath, fname))
                self.labels.append(rating)
                self.veg_types.append(quality)
    def __len__(self):
        return len(self.samples)
    def __getitem__(self, idx):
        img = Image.open(self.samples[idx]).convert('RGB')
        if self.transform:
            img = self.transform(img)
        label = self.labels[idx] - 1 # for CrossEntropyLoss, makes 0-4
        veg = self.veg_types[idx]
        return img, label, veg
