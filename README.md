## Table of Contents

- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)

## Installation

To run the code locally, follow these steps:

1. **Clone the repository**:
    ```shell
    git clone https://github.com/Sudhanshu777871/monter_backend_aassignment.git
    ```

2. **Install dependencies**:
    Make sure you have Node.js and npm installed on your machine. Then, run:
    ```shell
    npm install
    ```

3. **Configure the environment variables**:
    Create a file named `.env` in the project root directory and add the following content to the file:

    ```plaintext
    JWT_SECRET="monter@sudhanshu@dev@123"
    EMAIL_SENDER="ksudhanshu394@gmail.com"
    PORT=3000
    ```

4. **Run the code**:
    Start the server using the following command:
    ```shell
    npm start
    ```

    By default, the server will listen on port `3000`. You can customize the port in the `.env` file.

## Environment Configuration

The application requires environment variables to be set for proper configuration. The `.env` file in the project root directory should contain the following:

- `JWT_SECRET`: Secret key for JWT token signing and verification.
- `EMAIL_SENDER`: Email address used for sending OTPs.
- `PORT`: Port number on which the server will listen for incoming requests.

Please make sure not to push the `.env` file to the repository to keep sensitive information secure.

## Usage

- After starting the server, the application will be accessible at `http://localhost:<port>`.
- Endpoints for user signup, OTP request, OTP verification, and login will be available.
