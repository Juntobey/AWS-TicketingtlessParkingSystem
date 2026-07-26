import pymysql

from config import (
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_PORT
)


def get_connection():
    """
    Creates a connection to the MySQL database.
    """

    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT,
        cursorclass=pymysql.cursors.DictCursor
    )


def find_active_session(license_plate):
    """
    Returns an active parking session if one exists.
    """

    print(f"Searching for active session: {license_plate}")

    return None


def create_entry(license_plate, image_url):
    """
    Creates a new parking entry.
    """

    print("Creating parking entry...")

    return True


def update_exit(license_plate):
    """
    Updates a vehicle exit.
    """

    print("Updating vehicle exit...")

    return True