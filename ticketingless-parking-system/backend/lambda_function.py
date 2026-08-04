import json
import base64
import os

from parking import process_vehicle
from database import get_active_sessions

ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "*")

CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
}


def get_cors_headers(event):
    origin = (event.get("headers") or {}).get("origin", "").rstrip(".")
    allowed = ALLOWED_ORIGIN if origin == ALLOWED_ORIGIN else "*"
    return {**CORS_HEADERS, "Access-Control-Allow-Origin": allowed}


def lambda_handler(event, context):
    """
    AWS Lambda entry point.
    """

    headers = get_cors_headers(event)

    # Handle CORS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    # Active sessions endpoint
    if event.get("httpMethod") == "GET" and event.get("path") == "/sessions":
        try:
            sessions = get_active_sessions()
            data = [
                {
                    "licensePlate": s["license_plate"],
                    "entryTime": s["entry_timestamp"].isoformat()
                }
                for s in sessions
            ]
            return {"statusCode": 200, "headers": headers, "body": json.dumps(data)}
        except Exception as e:
            return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": str(e)})}

    try:

        body = json.loads(
            event.get("body", "{}")
        )

    except json.JSONDecodeError:

        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"success": False, "message": "Invalid JSON request."})
        }

    image = body.get("image")
    status = body.get("status")

    if not image:

        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"success": False, "message": "Image is required."})
        }

    if status not in ("Entry", "Exit"):

        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"success": False, "message": "Status must be 'Entry' or 'Exit'."})
        }

    try:

        image_bytes = base64.b64decode(
            image
        )

        result = process_vehicle(
            image_bytes,
            status
        )

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(result)
        }

    except Exception as error:

        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"success": False, "message": "Internal server error.", "error": str(error)})
        }