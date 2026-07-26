import uuid

import boto3

from config import (
    AWS_REGION,
    S3_BUCKET
)

from rekognition_service import detect_license_plate

from database import (
    create_entry,
    update_exit,
    find_active_session
)

s3 = boto3.client(
    "s3",
    region_name=AWS_REGION
)


def upload_image(image_bytes):
    """
    Upload image to Amazon S3.
    """

    filename = f"{uuid.uuid4()}.jpg"

    s3.put_object(
        Bucket=S3_BUCKET,
        Key=filename,
        Body=image_bytes
    )

    return filename


def process_vehicle(image_bytes, status):
    """
    Main business logic.
    """

    image_name = upload_image(image_bytes)

    plate_results = detect_license_plate(
        S3_BUCKET,
        image_name
    )

    if not plate_results:

        return {
            "success": False,
            "message": "No licence plate detected."
        }

    license_plate = plate_results[0]

    if status == "Entry":

        create_entry(
            license_plate,
            image_name
        )

        return {
            "success": True,
            "licensePlate": license_plate,
            "status": "Entry",
            "message": "Vehicle entered successfully."
        }

    session = find_active_session(
        license_plate
    )

    if session:

        update_exit(license_plate)

    return {
        "success": True,
        "licensePlate": license_plate,
        "status": "Exit",
        "message": "Vehicle exited successfully."
    }