# Ticketless Parking System

A cloud-native, ticketless parking management system built on AWS. Vehicles are identified automatically using licence plate recognition; no physical tickets are required.

---

## Demo

> 📹 [Watch Demo Video](./demo.mp4)

---

## Architecture Diagram

> 📐 [View Architecture Diagram](./architecture.png)

---

## How It Works

1. A vehicle arrives, and the operator uploads a photo of the licence plate
2. The image is sent to AWS Lambda via API Gateway
3. Lambda uploads the image to S3 (Cape Town) and copies it to S3 (Ireland) for Rekognition
4. Amazon Rekognition DetectText reads the licence plate number
5. The plate is matched against South African licence plate patterns
6. On **Entry** — a parking session is created in RDS PostgreSQL
7. On **Exit** — the session is closed, duration calculated, and fee charged at R10/hour (rounded up)
8. The receipt is displayed on the frontend with plate, status, entry time, exit time, duration, and fee

---

## AWS Architecture

| Service | Role |
|---|---|
| Amazon S3 (af-south-1) | Stores vehicle images uploaded from the frontend |
| Amazon S3 (eu-west-1) | Temporary copy for Rekognition (only available in select regions) |
| Amazon Rekognition | DetectText API to read licence plate numbers |
| AWS Lambda (Python 3.12) | Core processing — image upload, plate detection, RDS queries |
| Amazon API Gateway | Exposes REST endpoints to the React frontend |
| Amazon RDS (PostgreSQL) | Stores parking sessions, plates, timestamps, and fees inside a VPC |
| Amazon CloudFront | CDN for the React frontend |
| Amazon S3 (Static Hosting) | Hosts the built React app |

---

## Frontend Features

- Entry / Exit mode toggle
- Image upload with validation (JPG, PNG, WEBP, max 5MB)
- Real-time active sessions list (refreshes every 30 seconds)
- Status badges (Entry / Exit)
- Full receipt display — plate, status, entry time, exit time, duration, fee
- Mobile responsive layout
- Licence plate masking for privacy

---

## Backend Features

- South African licence plate pattern matching (GP, ZN, WP, EC, MP, etc.)
- Multi-line plate detection (1, 2, and 3-line plates)
- Smart fallback detection for partial plates
- Fee calculation: `CEIL(hours) × R10` — minimum 1 hour
- Active session tracking with PostgreSQL

---

## Database Schema

```sql
CREATE TABLE parking_sessions (
    session_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_plate     VARCHAR(15) NOT NULL,
    s3_image_url      TEXT NOT NULL,
    entry_timestamp   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exit_timestamp    TIMESTAMP WITH TIME ZONE,
    session_status    VARCHAR(20) DEFAULT 'ACTIVE',
    calculated_fee    DECIMAL(8, 2) DEFAULT 0.00
);
```

---

## Project Structure

```
ticketingless-parking-system/
├── backend/
│   ├── lambda_function.py      # Lambda entry point + API routing
│   ├── parking.py              # Core business logic
│   ├── database.py             # RDS queries (entry, exit, sessions)
│   ├── rekognition_service.py  # Plate detection via Rekognition
│   ├── s3_service.py           # S3 upload and copy logic
│   ├── config.py               # Environment configuration
│   ├── init_db.py              # Database schema initialisation
│   └── s3-cors.json            # S3 CORS policy
├── src/
│   ├── components/
│   │   ├── ImageUploader.jsx   # Upload form with Entry/Exit toggle
│   │   ├── ReceiptCard.jsx     # Session receipt display
│   │   ├── SessionList.jsx     # Real-time active sessions
│   │   ├── StatusBadge.jsx     # Entry/Exit status badge
│   │   └── ImagePreview.jsx    # Image preview before upload
│   ├── services/
│   │   ├── uploadService.js    # Image upload to API
│   │   └── parkingService.js   # Session lookup
│   └── utils/
│       └── validators.js       # Image validation
├── cf-config.json              # CloudFront distribution config
└── .env.example                # Environment variable template
```

---

## Environment Variables

**Frontend** (`.env`):
```
VITE_API_BASE_URL=https://<api-id>.execute-api.af-south-1.amazonaws.com/<stage>
```

**Backend** (Lambda Environment Variables):
```
SOURCE_BUCKET=<s3-bucket-cape-town>
REKOGNITION_BUCKET=<s3-bucket-ireland>
AWS_ACCOUNT_ID=<account-id>
DB_HOST=<rds-endpoint>
DB_NAME=<database-name>
DB_USER=<db-username>
DB_PASSWORD=<db-password>
DB_PORT=5432
ALLOWED_ORIGIN=https://<cloudfront-domain>
```

---

## Deployment

**Frontend:**
```bash
npm run build
aws s3 sync dist/ s3://<website-bucket> --delete
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

**Backend:**
```bash
# Package and deploy Lambda from CloudShell
pip install boto3 psycopg[binary] typing_extensions -t . --platform manylinux2014_x86_64 --python-version 3.12 --only-binary=:all:
zip -r lambda_package.zip.
aws lambda update-function-code --function-name <function-name> --zip-file fileb://lambda_package.zip --region af-south-1
```

---

## Fee Structure

| Duration | Fee |
|---|---|
| 0 – 60 mins | R10.00 |
| 61 – 120 mins | R20.00 |
| 121 – 180 mins | R30.00 |

---

## Tech Stack

- **Frontend:** React 18, Vite, CSS Grid
- **Backend:** Python 3.12, AWS Lambda, psycopg3, boto3
- **Database:** PostgreSQL on Amazon RDS
- **Cloud:** AWS (S3, Lambda, API Gateway, Rekognition, RDS, CloudFront)
