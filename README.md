#  Ticketless Parking System

A cloud-native ticketless parking system built on AWS that automates vehicle entry and exit using licence plate recognition.

The application replaces traditional paper parking tickets by using Amazon Rekognition to identify vehicle licence plates and securely manage parking sessions in PostgreSQL.

---

# Features

- Automatic licence plate recognition
- Ticketless parking
- Vehicle Entry and Exit processing
- Automatic parking session tracking
- Parking fee calculation
- Cross-region image processing
- Secure cloud storage
- Responsive React frontend
- Serverless backend using AWS Lambda

---

# System Workflow

Driver Arrives

↓

Operator uploads vehicle image

↓

Image stored in Amazon S3 (Cape Town)

↓

Image copied to Amazon S3 (Ireland)

↓

Amazon Rekognition extracts licence plate

↓

Parking session stored in PostgreSQL

↓

Gate opens

---

Driver Exits

↓

Vehicle image uploaded

↓

Amazon Rekognition detects licence plate

↓

Active parking session retrieved

↓

Parking fee calculated

↓

Receipt displayed

↓

Session closed

---

# AWS Architecture

```
React Frontend
        │
        ▼
API Gateway
        │
        ▼
AWS Lambda
        │
        ▼
Amazon S3 (Cape Town)
        │
        ▼
Amazon S3 (Ireland)
        │
        ▼
Amazon Rekognition
        │
        ▼
Amazon RDS PostgreSQL
```

---

# Technologies Used

## Frontend

- React
- TypeScript
- Tailwind CSS

## Backend

- Python
- AWS Lambda
- Boto3

## Database

- PostgreSQL
- Amazon RDS

## Cloud Services

- Amazon S3
- Amazon Rekognition
- API Gateway
- IAM
- CloudWatch

---

# Project Structure

```
frontend/
backend/
    config.py
    database.py
    lambda_function.py
    parking.py
    rekognition_service.py
    s3_service.py
```

---

# Key Features

## Cross-Region Processing

Amazon Rekognition is not available in the Cape Town region.

To keep customer data stored locally while still using Rekognition, the application uploads vehicle images to an Amazon S3 bucket in Cape Town before securely copying them to an Amazon S3 bucket in Ireland for licence plate recognition.

This architecture balances local data storage requirements with AWS service availability.

---

# Parking Workflow

### Vehicle Entry

- Upload vehicle image
- Detect licence plate
- Create parking session
- Open gate

### Vehicle Exit

- Upload vehicle image
- Detect licence plate
- Retrieve active session
- Calculate parking fee
- Close session

---

# Skills Demonstrated

- Serverless Computing
- Cloud Architecture
- Event-Driven Systems
- Python Development
- PostgreSQL
- AWS Lambda
- Amazon Rekognition
- Amazon S3
- IAM
- API Gateway
- Cross-Region Cloud Design
- REST APIs

---


# Author

**Lebogang Tobey Ndlovu**

Built as part of my cloud engineering portfolio to demonstrate practical AWS serverless architecture, cloud-native application development, and automated vehicle management.
