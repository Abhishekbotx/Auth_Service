# Authentication Service

Welcome the the Authentication Service of AIRNET Airline Flight booking service

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/authentication-service.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment variables:

    ```bash
    PORT=
    JWT_KEY=
    ```

    Edit the `.env` file with your configuration.

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. Use the following endpoints for authentication:
  ```
   - **POST /signup:** Register a new user.
   - **POST /signin:** Sign in with email and password.
   - **GET /isAuthenticated:** Check if the user is authenticated.
   - **GET /isAdmin:** Check if the user is an admin.
   - **POST /addEmployee:** Add a new employee (admin only).
   - **POST /generateOtp:** Generate OTP for password reset.
   - **POST /resetPassword:** Reset user password using OTP.
 ```
## Configuration
```
- Configure environment variables in the `.env` file.
- Set up database connection details, JWT secret, etc.
```
## Authentication
```
- JWT authentication is used for user authentication.
- Generate access tokens upon successful sign-in.
```

## Error Handling
```
- Errors are handled gracefully with appropriate status codes and error messages.
```
## Security
```
- Passwords are hashed before storing in the database.
- JWT tokens are securely generated and verified.
```














