from s3_service import (
    upload_image,
    copy_to_rekognition_bucket
)

from rekognition_service import (
    detect_license_plate
)

from database import (
    create_entry,
    update_exit,
    find_active_session
)


def process_vehicle(image_bytes, status):
    """
    Main parking business logic.

    Workflow:

    Upload Image
        ↓
    Copy to Ireland
        ↓
    Detect Licence Plate
        ↓
    Entry / Exit Logic
        ↓
    Database
    """

    if not image_bytes:
        raise ValueError("image_bytes cannot be null or empty.")

   
    # Upload image to Cape Town
    

    image_key = upload_image(
        image_bytes
    )

    
    # Copy image to Ireland
    

    copy_to_rekognition_bucket(
        image_key
    )

    
    # Detect licence plate
    

    plate_result = detect_license_plate(
        image_key
    )

    if plate_result is None:

        return {

            "success": False,
            "message": "No valid South African licence plate detected."

        }

    license_plate = plate_result["plate"]

    confidence = plate_result["confidence"]

    pattern = plate_result["pattern"]

    
    # Vehicle Entry
    

    if status == "Entry":

        create_entry(

            license_plate,
            image_key

        )

        return {

            "success": True,
            "status": "Entry",
            "licensePlate": license_plate,
            "confidence": confidence,
            "pattern": pattern,
            "message": "Vehicle entered successfully."

        }

    
    # Vehicle Exit
    

    session = find_active_session(
        license_plate
    )

    if session:

        update_exit(
            license_plate
        )

        return {

            "success": True,
            "status": "Exit",
            "licensePlate": license_plate,
            "confidence": confidence,
            "pattern": pattern,
            "message": "Vehicle exited successfully."

        }

    
    # Vehicle not found

    return {

        "success": False,
        "status": "Exit",
        "licensePlate": license_plate,
        "confidence": confidence,
        "pattern": pattern,
        "message": "No active parking session found."

    }