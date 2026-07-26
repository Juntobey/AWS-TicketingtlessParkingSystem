import json
import base64

from parking import process_vehicle


def lambda_handler(event, context):
    """
    AWS Lambda entry point.
    """

    try:

        body = json.loads(event["body"])

        image = base64.b64decode(
            body["image"]
        )

        status = body["status"]

        result = process_vehicle(
            image,
            status
        )

        return {
            "statusCode": 200,
            "body": json.dumps(result)
        }

    except Exception as error:

        return {
            "statusCode": 500,
            "body": json.dumps(
                {
                    "error": str(error)
                }
            )
        }