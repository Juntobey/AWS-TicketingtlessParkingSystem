import boto3

from config import AWS_REGION

rekognition = boto3.client(
    "rekognition",
    region_name=AWS_REGION
)


def detect_license_plate(bucket_name, image_name):
    """
    Detects text from an image stored in S3.
    """

    response = rekognition.detect_text(
        Image={
            "S3Object": {
                "Bucket": bucket_name,
                "Name": image_name
            }
        }
    )

    detected_text = []

    for item in response["TextDetections"]:

        if item["Type"] == "LINE":

            detected_text.append(item["DetectedText"])

    return detected_text