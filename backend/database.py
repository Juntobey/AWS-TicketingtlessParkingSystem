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


HOURLY_RATE = 10.00  # ZAR per hour


# Check if Vehicle is Registered

def is_registered(license_plate):
    """
    Returns True if the plate exists in registered_vehicles.
    """

    with get_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT 1
                FROM registered_vehicles
                WHERE license_plate = %s
                LIMIT 1;
                """,
                (license_plate,)
            )

            return cursor.fetchone() is not None


# Find Active Parking Session

def find_active_session(license_plate):

    with get_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT *
                FROM parking_sessions
                WHERE license_plate = %s
                AND session_status = 'ACTIVE'
                LIMIT 1;
                """,
                (license_plate,)
            )

            return cursor.fetchone()


# Create Parking Entry

def create_entry(license_plate, image_key):

    with get_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                INSERT INTO parking_sessions
                (license_plate, s3_image_url, session_status)
                VALUES (%s, %s, 'ACTIVE');
                """,
                (license_plate, image_key)
            )

        connection.commit()

    return True


# Update Parking Exit

def update_exit(license_plate):

    exit_time = datetime.now(tz=timezone.utc)

    with get_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                UPDATE parking_sessions
                SET
                    exit_timestamp = %s,
                    session_status = 'COMPLETED',
                    calculated_fee = (
                        GREATEST(
                            EXTRACT(EPOCH FROM (%s - entry_timestamp)) / 3600,
                            1
                        ) * %s
                    )
                WHERE license_plate = %s
                AND session_status = 'ACTIVE'
                RETURNING calculated_fee;
                """,
                (exit_time, exit_time, HOURLY_RATE, license_plate)
            )

            row = cursor.fetchone()

        connection.commit()

    return round(float(row["calculated_fee"]), 2) if row else 0.00