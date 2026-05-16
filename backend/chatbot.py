import os
from dotenv import load_dotenv
from openai import OpenAI
import mysql.connector
from mysql.connector import errors as mysql_errors


# =========================
# DATABASE CONNECTION
# =========================
def get_db_connection():
    # db_host = os.getenv("DB_HOST", "localhost")
    # db_user = os.getenv("DB_USER", "root")
    # db_password = os.getenv("DB_PASSWORD", "")
    # db_name = os.getenv("DB_NAME", "e_commerce_db")

    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Maurya@&0000",
        database="e-commercedb",
        auth_plugin="caching_sha2_password"
    )


# =========================
# ENV VARIABLES
# =========================
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_MODEL", "google/gemma-4-31B-it:novita")

if not HF_TOKEN:
    raise ValueError("❌ HF_TOKEN is missing in .env file")


# =========================
# AI CLIENT
# =========================
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN,
)


# =========================
# SEARCH PRODUCT IN DATABASE
# =========================
def search_products_in_db(message: str):
    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cleaned = clean_query(message)

        # ✅ Partial + smart match
        query = """
            SELECT name, price, description
            FROM products
            WHERE LOWER(name) LIKE %s
            ORDER BY LENGTH(name) ASC
            LIMIT 1
        """

        cursor.execute(query, (f"%{cleaned}%",))
        results = cursor.fetchall()

        return results

    except mysql_errors.NotSupportedError:
        return (
            "DB Error: Your MySQL client does not support 'caching_sha2_password'. "
            "Install/upgrade mysql-connector-python in backend environment."
        )
    except Exception as e:
        return f"DB Error: {e}"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# =========================
# AI RESPONSE
# =========================
def get_ai_response(message: str) -> str:
    system_prompt = (
        "You are a smart ecommerce assistant. "
        "If a product is not available in the database, still help the user by explaining "
        "the product, its uses, benefits, and general price range. "
        "Keep it short and useful."
    )

    try:
        completion = client.chat.completions.create(
            model=HF_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            temperature=0.4,
            max_tokens=300,
        )

        if completion and completion.choices:
            return completion.choices[0].message.content.strip()

        return "⚠️ AI response not available."

    except Exception as e:
        return f"⚠️ AI Error: {str(e)}"


# =========================
# MAIN BOT RESPONSE
# =========================
def is_product_query(message: str) -> bool:
    keywords = ["oil", "product", "shampoo", "soap", "cream", "lotion"]
    message = message.lower()
    return any(word in message for word in keywords)


def clean_query(message: str) -> str:
    stop_words = ["price", "of", "show", "me", "give", "details"]

    words = message.lower().split()
    filtered = [word for word in words if word not in stop_words]

    return " ".join(filtered)

def get_bot_response(message: str) -> str:
    if not message or not message.strip():
        return "⚠️ Please enter a valid message."

    db_results = search_products_in_db(message)

    if isinstance(db_results, str):
        return db_results

    if db_results:
        product = db_results[0]  # ✅ only one

        return (
            f"🛒 Product Found:\n\n"
            f"Name: {product['name']}\n"
            f"Price: ₹{product['price']}\n"
            f"Description: {product['description']}"
        )

    # ❌ Not found → AI
    ai_reply = get_ai_response(message)

    return (
        "Product is not available in our store. Sorry for inconvience .\n\n"
        f"{ai_reply}"
    )