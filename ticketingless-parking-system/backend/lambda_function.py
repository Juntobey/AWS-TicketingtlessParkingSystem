import json
import base64

from parking import process_vehicle


def lambda_handler(event, context):
    """
    AWS Lambda entry point.
    """

    try:

        body = json.loads(
            event.get("body", "{}")
        )

    except json.JSONDecodeError:

        return {

            "statusCode": 400,

            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },

            "body": json.dumps({

                "success": False,
                "message": "Invalid JSON request."

            })

        }

    image = body.get("image")
    status = body.get("status")

    if not image:

        return {

            "statusCode": 400,

            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },

            "body": json.dumps({

                "success": False,
                "message": "Image is required."

            })

        }

    if status not in ("Entry", "Exit"):

        return {

            "statusCode": 400,

            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },

            "body": json.dumps({

                "success": False,
                "message": "Status must be 'Entry' or 'Exit'."

            })

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

            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },

            "body": json.dumps(result)

        }

    except Exception as error:

        return {

            "statusCode": 500,

            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },

            "body": json.dumps({

                "success": False,
                "message": "Internal server error.",
                "error": str(error)

            })

        }