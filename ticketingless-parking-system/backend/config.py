import os

# Primary AWS Region
AWS_REGION = "af-south-1"

# Rekognition Region
REKOGNITION_REGION = "eu-west-1"

# Cape Town Image Bucket
SOURCE_BUCKET = os.environ.get(
    "SOURCE_BUCKET",
    "ticketless-parking-images-tobeyn2026"
)

# Ireland Rekognition Bucket
REKOGNITION_BUCKET = os.environ.get(
    "REKOGNITION_BUCKET",
    "ticketless-parking-rekognition-tobey2026"
)


# PostgreSQL Configuration

DB_HOST = os.environ.get("DB_HOST")

DB_NAME = os.environ.get("DB_NAME")

DB_USER = os.environ.get("DB_USER")

DB_PASSWORD = os.environ.get("DB_PASSWORD")

DB_PORT = int(
    os.environ.get(
        "DB_PORT",
        5432
    )
)


# Optional Settings

AWS_PROFILE = os.environ.get(
    "AWS_PROFILE",
    "default"
)