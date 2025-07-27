import os
import uuid
import sqlite3
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Import your AI analysis function; ensure this exists and works as expected
from analyze_crop import get_ai_rating

app = Flask(__name__)
CORS(app)

DB_PATH = 'crop.db'
UPLOAD_FOLDER = r'C:\Users\DELL\Desktop\champion\king\uploaded image'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def add_missing_columns():
    """Add farmer-related columns to the crops table if they do not exist."""
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(crops)")
        existing_columns = {row[1] for row in cursor.fetchall()}

        if 'farmer_name' not in existing_columns:
            cursor.execute("ALTER TABLE crops ADD COLUMN farmer_name TEXT")
        if 'farmer_mobile' not in existing_columns:
            cursor.execute("ALTER TABLE crops ADD COLUMN farmer_mobile TEXT")
        if 'location' not in existing_columns:
            cursor.execute("ALTER TABLE crops ADD COLUMN location TEXT")

        conn.commit()


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS crops (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                image_filename TEXT NOT NULL,
                ai_rating TEXT,
                farmer_name TEXT,
                farmer_mobile TEXT,
                location TEXT,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

@app.route('/upload_crop', methods=['POST'])
def upload_crop():
    name = request.form.get('name')
    price = request.form.get('price')
    quantity = request.form.get('quantity')
    img = request.files.get('image')
    farmer_name = request.form.get('farmer_name')
    farmer_mobile = request.form.get('farmer_mobile')
    location = request.form.get('location')

    if not all([name, price, quantity, img, farmer_name, farmer_mobile, location]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    ext = os.path.splitext(img.filename)[-1]
    if not ext:
        ext = '.jpg'
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        img.save(file_path)

        ai_result = get_ai_rating(file_path)
        ai_rating = ai_result.get('rating') if ai_result.get('success') else None

        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                """
                INSERT INTO crops
                (name, price, quantity, image_filename, ai_rating, farmer_name, farmer_mobile, location)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (name, float(price), int(quantity), filename, ai_rating, farmer_name, farmer_mobile, location)
            )

        return jsonify({
            "success": True,
            "message": "Crop saved to database.",
            "image_filename": filename,
            "aiRating": ai_rating
        })

    except Exception as e:
        return jsonify({"success": False, "message": f"Error saving crop: {str(e)}"}), 500


@app.route('/list_crops', methods=['GET'])
def list_crops():
    with sqlite3.connect(DB_PATH) as conn:
        rows = conn.execute(
            "SELECT id, name, price, quantity, image_filename, ai_rating, farmer_name, farmer_mobile, location, added_at FROM crops ORDER BY id DESC"
        ).fetchall()
    crops = [
        dict(zip(['id', 'name', 'price', 'quantity', 'image_filename', 'ai_rating', 'farmer_name', 'farmer_mobile', 'location', 'added_at'], row))
        for row in rows
    ]
    return jsonify(crops)


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route('/delete_crop/<int:crop_id>', methods=['DELETE'])
def delete_crop(crop_id):
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.execute('SELECT image_filename FROM crops WHERE id = ?', (crop_id,))
            row = cur.fetchone()
            if row:
                filename = row[0]
                img_path = os.path.join(UPLOAD_FOLDER, filename)
                if os.path.exists(img_path):
                    os.remove(img_path)
                conn.execute('DELETE FROM crops WHERE id = ?', (crop_id,))
                conn.commit()
                return jsonify({'success': True})
            else:
                return jsonify({'success': False, 'message': 'Crop not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


if __name__ == "__main__":
    add_missing_columns()  # add missing columns if any
    init_db()
    app.run(host='0.0.0.0', debug=True)
