from datetime import datetime, timezone

import psycopg
from psycopg.rows import dict_row

from config import (
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_PORT
)


# Database Connection

def get_connection():
    """
    Creates a PostgreSQL database connection.
    """

    return psycopg.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT,
        row_factory=dict_row
    )


# Find Active Parking Session

def find_active_session(license_plate):
    """
    Returns the active parking session
    for a vehicle if one exists.
    """

    with get_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT *
                FROM parking_sessions
                WHERE license_plate = %s
                AND exit_time IS NULL
                LIMIT 1;
                """,
                (license_plate,)
            )

            return cursor.fetchone()


# Create Parking Entry

def create_entry(
    license_plate,
    image_key
):
    """
    Creates a new parking entry.
    """

    with get_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                INSERT INTO parking_sessions
                (
                    license_plate,
                    image_key,
                    entry_time
                )
                VALUES
                (
                    %s,
                    %s,
                    %s
                );
                """,
                (
                    license_plate,
                    image_key,
                    datetime.now(tz=timezone.utc)
                )
            )

        connection.commit()

    return True


# Update Parking Exit

def update_exit(
    license_plate
):
    """
    Marks a vehicle as exited.
    """

    with get_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                UPDATE parking_sessions
                SET
                    exit_time = %s
                WHERE
                    license_plate = %s
                AND
                    exit_time IS NULL;
                """,
                (
                    datetime.now(tz=timezone.utc),
                    license_plate
                )
            )

        connection.commit()

    return True