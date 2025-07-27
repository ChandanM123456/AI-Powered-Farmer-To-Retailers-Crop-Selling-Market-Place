import sqlite3

DB_PATH = 'crop.db'  # Path to your SQLite database file

def add_ai_rating_column():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.execute("ALTER TABLE crops ADD COLUMN ai_rating TEXT;")
        print("Added 'ai_rating' column to 'crops' table successfully.")
    except sqlite3.OperationalError as e:
        # This error likely means the column already exists, so just inform and continue
        print("Column 'ai_rating' might already exist or other error occurred:")
        print(e)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_ai_rating_column()
