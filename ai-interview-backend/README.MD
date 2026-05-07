# Base Backend Nodejs

This is a base backend project built with Node.js, Express, and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Thach45/manage-task-typescript.git
    cd Base\ Backend\ Nodejs
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/1) file in the root directory and add the following environment variables:
    ```env
    PORT=3000
    ...
    ```

4. Build the project:
    ```sh
    npm run build
    ```

## Usage

1. Start the development server:
    ```sh
    npm run dev
    ```

2. The server will be running at `http://localhost:3000`.

## API Endpoints

### Home

- **Get Home**
    - `GET /api/v1/home`
    - Response:
        ```json
        {
            "status": "success",
            "message": "Welcome to the API"
        }
        ```

## Environment Variables

- [PORT](http://_vscodecontentref_/2): The port number on which the server will run.
- [MONGODB_URI](http://_vscodecontentref_/3): The MongoDB connection string.
- [API_KEY](http://_vscodecontentref_/4): The API key for authentication.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project.
- `npm run ts.check`: TypeScript type checking.
- [npm run add-build](http://_vscodecontentref_/5): Add the build files to git.

## License

This project is licensed under the ISC License.