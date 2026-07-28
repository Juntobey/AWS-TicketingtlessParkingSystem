import re
import boto3

from config import (
    REKOGNITION_REGION,
    REKOGNITION_BUCKET
)

rekognition = boto3.client(
    "rekognition",
    region_name=REKOGNITION_REGION
)

# --------------------------------------------------
# South African Province Codes
# --------------------------------------------------

PROVINCES = (
    "GP",
    "ZN",
    "EC",
    "MP",
    "L",
    "NC",
    "NW",
    "FS",
    "WP"
)

PROVINCE_REGEX = "(" + "|".join(PROVINCES) + ")"


# --------------------------------------------------
# South African Licence Plate Patterns
# --------------------------------------------------

SA_PLATE_PATTERNS = {

    "Gauteng / KwaZulu-Natal":

        rf"^[A-Z]{{2}}\d{{2}}[A-Z]{{2}}{PROVINCE_REGEX}$",

    "Standard Provincial":

        rf"^[A-Z]{{3}}\d{{3}}{PROVINCE_REGEX}$",

    "Western Cape":

        r"^C[A-Z]{1,2}\d{3,6}$",

    "Personalised":

        rf"^[A-Z0-9]{{1,7}}{PROVINCE_REGEX}$"

}


# --------------------------------------------------
# Pattern Matching
# --------------------------------------------------

def match_plate(text):
    """
    Returns the matching plate type if found.
    """

    for pattern_name, pattern in SA_PLATE_PATTERNS.items():

        if re.match(pattern, text):

            return pattern_name

    return None


# --------------------------------------------------
# Detect Licence Plate
# --------------------------------------------------

def detect_license_plate(image_key):
    """
    Detects a South African licence plate
    from an image stored in the Ireland bucket.

    Returns:

    {
        "plate": "...",
        "confidence": ...,
        "pattern": "..."
    }

    or None
    """

    response = rekognition.detect_text(

        Image={
            "S3Object": {
                "Bucket": REKOGNITION_BUCKET,
                "Name": image_key
            }
        }

    )

    detected_lines = []

    # ---------------------------------------------
    # Collect High Confidence LINE detections
    # ---------------------------------------------

    for detection in response["TextDetections"]:

        if detection["Type"] != "LINE":
            continue

        confidence = detection["Confidence"]

        if confidence < 80:
            continue

        text = detection["DetectedText"]

        cleaned = re.sub(
            r"[^A-Z0-9]",
            "",
            text.upper()
        )

        if cleaned:

            detected_lines.append(

                {
                    "text": cleaned,
                    "confidence": confidence
                }

            )

    if not detected_lines:
        return None

    # ---------------------------------------------
    # 1. Single Line Plates
    # ---------------------------------------------

    for line in detected_lines:

        pattern = match_plate(
            line["text"]
        )

        if pattern:

            return {

                "plate": line["text"],
                "confidence": round(
                    line["confidence"],
                    2
                ),
                "pattern": pattern

            }

    # ---------------------------------------------
    # 2. Two-Line Plates
    # ---------------------------------------------

    for i in range(len(detected_lines) - 1):

        combined = (

            detected_lines[i]["text"] +
            detected_lines[i + 1]["text"]

        )

        pattern = match_plate(
            combined
        )

        if pattern:

            confidence = min(

                detected_lines[i]["confidence"],
                detected_lines[i + 1]["confidence"]

            )

            return {

                "plate": combined,
                "confidence": round(
                    confidence,
                    2
                ),
                "pattern": pattern

            }

    # ---------------------------------------------
    # 3. Three-Line Plates
    # ---------------------------------------------

    for i in range(len(detected_lines) - 2):

        combined = (

            detected_lines[i]["text"] +
            detected_lines[i + 1]["text"] +
            detected_lines[i + 2]["text"]

        )

        pattern = match_plate(
            combined
        )

        if pattern:

            confidence = min(

                detected_lines[i]["confidence"],
                detected_lines[i + 1]["confidence"],
                detected_lines[i + 2]["confidence"]

            )

            return {

                "plate": combined,
                "confidence": round(
                    confidence,
                    2
                ),
                "pattern": pattern

            }

    # ---------------------------------------------
    # 4. Smart Fallback
    # ---------------------------------------------

    detected_lines.sort(

        key=lambda item: (

            any(c.isdigit() for c in item["text"]),
            len(item["text"]),
            item["confidence"]

        ),

        reverse=True

    )

    best = detected_lines[0]

    if len(best["text"]) >= 4:

        return {

            "plate": best["text"],
            "confidence": round(
                best["confidence"],
                2
            ),
            "pattern": "Fallback"

        }

    return None