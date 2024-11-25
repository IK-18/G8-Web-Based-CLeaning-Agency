Here’s a sample **README** file for your repository, which includes project details, steps to initialize the database, and instructions for setting up the SQL commands.

---

# CleanSwift - Online Cleaning Service Management

**Course:** COSC333  
**Project Name:** CleanSwift - Online Cleaning Service Management  
**Submission Date:** November 22, 2024

## Table of Contents

-   [Project Overview](#project-overview)
-   [Features](#features)
-   [Database Setup](#database-setup)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Contributing](#contributing)
-   [License](#license)

## Project Overview

CleanSwift is a web-based cleaning service management platform that allows users to book cleaning services, view available packages, manage appointments, and make payments online. It is designed to streamline booking and service allocation while ensuring efficient service management.

## Features

-   **User Registration and Authentication**: Allows customers and staff to create and access accounts.
-   **Service Management**: Displays various cleaning packages, such as basic and deep cleaning.
-   **Booking Management**: Enables customers to book services, choose dates, and add special instructions.
-   **Payment Processing**: Supports secure payment transactions.
-   **Cleaner Allocation**: Assigns cleaners based on booking schedules and availability.
-   **Feedback System**: Allows customers to rate and provide feedback on services received.

## Database Setup

The SQL commands to create the database and tables are provided in a file named `cleanswift.sql`, located in the repository. Follow the steps below to initialize the database in MySQL.

### Prerequisites

-   **MySQL**: Ensure MySQL is installed and running on your system.

### Initialization Steps

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/cleanswift.git
    cd cleanswift
    ```

2. **Log into MySQL**:

    ```bash
    mysql -u your_username -p
    ```

3. **Create the Database**:

    ```sql
    CREATE DATABASE IF NOT EXISTS cleanswift;
    USE cleanswift;
    ```

4. **Run the SQL Script**:

    - Execute the SQL file (`cleanswift.sql`) containing the table definitions:

    ```bash
    mysql -u your_username -p cleanswift < cleanswift.sql
    ```

    This command will create all necessary tables (`Customer`, `Cleaner`, `ServicePackage`, `Booking`, `Payment`, and `Feedback`) and set up the primary and foreign key constraints.

## Installation

1. Install the required dependencies for the project (e.g., Node.js, Express.js) if a backend is implemented.
2. Configure the application to connect to the `cleanswift` database.

## Usage

Once the setup is complete:

-   Register as a new user or log in to access available services.
-   Book a cleaning service, select your preferred package, and specify the desired date.
-   Make a payment and track the booking status.
-   Provide feedback and rate the services.

## Endpoints

### **1. User Authentication and Management**

Endpoints for handling user registration, login, and management.

| **HTTP Method** | **Endpoint**          | **Description**                                   |
| --------------- | --------------------- | ------------------------------------------------- |
| `POST`          | `/auth/register`      | Register a new user (customer or staff).          |
| `POST`          | `/auth/login`         | Authenticate a user and return a token.           |
| `GET`           | `/users/:id`          | Fetch details of a specific user.                 |
| `PUT`           | `/users/:id`          | Update user details (e.g., name, phone, address). |
| `DELETE`        | `/accounts/users/:id` | Delete a user account.                            |

---

### **2. Service Management**

Endpoints to handle cleaning service packages.

| **HTTP Method** | **Endpoint**          | **Description**                                  |
| --------------- | --------------------- | ------------------------------------------------ |
| `GET`           | `/services`           | Fetch all available service packages.            |
| `POST`          | `/admin/services`     | Create a new service package (admin/staff only). |
| `GET`           | `/services/:id`       | Fetch details of a specific service package.     |
| `PUT`           | `/admin/services/:id` | Update details of a service package.             |
| `DELETE`        | `/admin/services/:id` | Delete a service package.                        |

---

### **3. Booking Management**

Endpoints to allow customers to book services and manage their bookings.

| **HTTP Method** | **Endpoint**         | **Description**                         |
| --------------- | -------------------- | --------------------------------------- |
| `POST`          | `/bookings`          | Create a new booking.                   |
| `GET`           | `/bookings`          | Fetch all bookings (admin/staff view).  |
| `GET`           | `/bookings/user/:id` | Fetch all bookings for a specific user. |
| `GET`           | `/bookings/:id`      | Fetch details of a specific booking.    |
| `PUT`           | `/bookings/:id`      | Update a booking (e.g., status, date).  |
| `DELETE`        | `/bookings/:id`      | Cancel a booking.                       |

---

### **4. Payment Processing**

Endpoints to handle payment details and transactions.

| **HTTP Method** | **Endpoint**    | **Description**                        |
| --------------- | --------------- | -------------------------------------- |
| `POST`          | `/payments`     | Record a new payment.                  |
| `GET`           | `/payments`     | Fetch all payments (admin/staff view). |
| `GET`           | `/payments/:id` | Fetch details of a specific payment.   |

---

### **5. Cleaner Management**

Endpoints to manage cleaners and their assignments.

| **HTTP Method** | **Endpoint**    | **Description**                               |
| --------------- | --------------- | --------------------------------------------- |
| `GET`           | `/cleaners`     | Fetch all cleaners (admin/staff view).        |
| `POST`          | `/cleaners`     | Add a new cleaner (admin/staff only).         |
| `GET`           | `/cleaners/:id` | Fetch details of a specific cleaner.          |
| `PUT`           | `/cleaners/:id` | Update cleaner details (e.g., assigned area). |
| `DELETE`        | `/cleaners/:id` | Remove a cleaner from the system.             |

---

### **6. Feedback System**

Endpoints to allow customers to provide feedback and view ratings.

| **HTTP Method** | **Endpoint**            | **Description**                            |
| --------------- | ----------------------- | ------------------------------------------ |
| `POST`          | `/feedback`             | Submit feedback for a cleaner.             |
| `GET`           | `/feedback`             | Fetch all feedback (admin/staff view).     |
| `GET`           | `/feedback/cleaner/:id` | Fetch all feedback for a specific cleaner. |
| `DELETE`        | `/feedback/:id`         | Delete a feedback entry (admin only).      |

---

## Contributing

Contributions are welcome! Please open a pull request or file an issue if you find any bugs or have feature requests.

## License

This project is licensed under the MIT License.

---

This README file covers project details, features, and step-by-step database setup instructions, including the initialization commands to run the provided SQL file. Let me know if you need further customization or additional details!
