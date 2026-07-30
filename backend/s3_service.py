import uuid
import os
import boto3

from config import (
    AWS_REGION,
    SOURCE_BUCKET,
    REKOGNITION_BUCKET
)

AWS_ACCOUNT_ID = os.environ.get("AWS_ACCOUNT_ID", "")


# S3 Clients


source_s3 = boto3.client(
    "s3",
    region_name=AWS_REGION
)

rekognition_s3 = boto3.client(
    "s3",
    region_name="eu-west-1"
)



# Generate Unique Image Name


def generate_key():

    return f"vehicles/{uuid.uuid4()}.jpg"



# Upload Image to Cape Town Bucket

def upload_image(image_bytes):

    key = generate_key()

    source_s3.put_object(
        Bucket=SOURCE_BUCKET,
        Key=key,
        Body=image_bytes,
        ContentType="image/jpeg"
    )

    return key



# Copy Image to Ireland Bucket

def copy_to_rekognition_bucket(key):

    copy_source = {
        "Bucket": SOURCE_BUCKET,
        "Key": key
    }

    rekognition_s3.copy_object(
        CopySource=copy_source,
        Bucket=REKOGNITION_BUCKET,
        Key=key,
        ExpectedBucketOwner=AWS_ACCOUNT_ID,
        ExpectedSourceBucketOwner=AWS_ACCOUNT_ID
    )

    return key



# Delete Image From Bucket


def delete_image(bucket, key):

    client = source_s3

    if bucket == REKOGNITION_BUCKET:
        client = rekognition_s3

    client.delete_object(
        Bucket=bucket,
        Key=key
    )