import os


# AWS Configuration
# ==========================

AWS_REGION = os.environ.get("AWS_REGION", "af-south-1")

S3_BUCKET = os.environ.get("S3_BUCKET")


# Database Configuration
# ==========================

DB_HOST = os.environ.get("DB_HOST")

DB_NAME = os.environ.get("DB_NAME")

DB_USER = os.environ.get("DB_USER")

DB_PASSWORD = os.environ.get("DB_PASSWORD")

DB_PORT = int(os.environ.get("DB_PORT", 3306))