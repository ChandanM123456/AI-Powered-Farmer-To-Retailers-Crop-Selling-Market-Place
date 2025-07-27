# AI-Powered-Farmer-To-Retailers-Crop-Selling-Market-Place

This project is an **AI-powered farmer-to-retailer crop selling marketplace** designed to modernize and streamline direct crop sales. It uses AI-based vegetable recognition and quality assessment to help farmers and retailers connect efficiently with verified crop quality information.

The project features:

- AI model trained on the **VegNet Vegetable Dataset** for classifying and assessing vegetable quality stages (Unripe, Ripe, Old, Dried, Damaged).
- Real-time vegetable recognition implemented using Machine learning models.
- Web-based dashboards for farmers and retailers displaying sales, quality analytics, and inventory.
- SQLite backend database to manage crop sales data.
- Intuitive UI for listing crops, viewing quality ratings, and connecting with buyers and sellers.
- Facilitates transparency and trust in crop quality in the agricultural supply chain.

## Project Features

- **Vegetable Quality Classification:** AI model trained on the VegNet dataset accurately classifies four vegetable types across different quality stages.
- **Farmer-Retailer Marketplace:** Connects farmers and retailers via an interactive, data-driven dashboard.
- **Image-Based Crop Assessment:** Upload images of vegetables to automatically get quality ratings.
- **Sales and Inventory Management:** Tracks crop listings, sales transactions, and inventory using SQLite.
- **Cross-Platform Compatibility:** Backend implemented in Python; frontend built with JavaScript and modern web technologies.
- **Open Source:** Fully open for contributions, improvements, and deployment customization.

## Dataset

The AI model is trained on the **VegNet: Vegetable Dataset with quality (Unripe, Ripe, Old, Dried, and Damaged)**, which contains 6,850 vegetable images under varied real-world conditions.

You can download the dataset from Mendeley Data here:

[VegNet Dataset on Mendeley Data](https://data.mendeley.com/datasets/6nxnjbn9w6/1)

Please download and extract this dataset before running the AI model training or inference.

## Installation & Setup

Follow the steps below to set up this project on your local machine or server.

### Prerequisites

- Python 3.8+
- Git
- SQLite3

### Clone the Repository

```bash
git clone https://github.com/ChandanM123456/AI-Powered-Farmer-To-Retailers-Crop-Selling-Market-Place.git
cd AI-Powered-Farmer-To-Retailers-Crop-Selling-Market-Place
```

### Create and Activate Python Virtual Environment (Recommended)

```bash
python -m venv venv
source venv/bin/activate      # Linux / macOS
venv\Scripts\activate         # Windows
```

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

The `requirements.txt` includes:

- torch
- torchvision
- numpy
- pandas
- flask (or your backend framework)
- sqlite3 (built-in with Python)
- other necessary ML and web libraries

### Download and Prepare Dataset

1. Download the VegNet dataset from: https://data.mendeley.com/datasets/6nxnjbn9w6/1
2. Extract the dataset to the folder `/data/vegnet/` in the project root.
3. Ensure the folder structure matches what the training script expects (check your training code).

### Running AI Model Training or Inference

To train the model or use pretrained weights:

```bash
python train.py --dataset ./data/vegnet/
```

(Replace with your actual training or inference script command.)

### Setting Up the Database

SQLite database `crops.db` is included / will be created automatically during the first run. To reset or initialize:

```bash
python app.py

```

### Running the Web Application

```bash
python app.py
```

Access the application via:

```
http://localhost:5000
```

## Usage

- **Farmers:** Upload and classify vegetable images, list crops for sale, and manage inventory.
- **Retailers:** Browse listed crops with quality ratings, connect with farmers, and complete purchase transactions.

## Contact

For questions or collaborations, reach out at your-chandan.chandu@gmail.com

# Thank you for exploring this impactful AI-powered marketplace project, advancing agriculture with technology!
