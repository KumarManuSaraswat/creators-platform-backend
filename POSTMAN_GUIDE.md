# Creator's Platform API - Postman Testing Guide

This guide explains how to set up and run the Postman collection used to manually test the Creator's Platform API. 

## Setup Instructions

1. Download and install the [Postman Desktop App](https://www.postman.com/downloads/).
2. Clone this repository to your local machine and start the backend server (ensure it is running on your local port, e.g., `http://localhost:3000`).

## How to Import the Collection and Environment

1. Open Postman.
2. Click the **Import** button in the top left corner.
3. Select the `Creators_Platform_API_Collection.json` file located in the `docs/` folder of this repository.
4. Click **Import** again and select the `Local_Development_Environment.json` file.
5. In the top right corner of Postman, ensure the environment dropdown is set to **Local Development**.

## Order of Running Requests

To properly test the API, run the requests in the following order to ensure authentication flows correctly:

1. **Health / Health Check:** Run this first to ensure your server is active and responding.
2. **Auth / Register User:** Creates a new user. *(Note: This automatically saves the auth token to your environment).*
3. **Auth / Login User:** Logs in the user. *(Also auto-saves/refreshes the auth token).*
4. **Posts / Create Post:** Now that you are authenticated, create a new post.
5. **Posts / Get All Posts:** Verify the post was created.
6. **Posts / Update Post:** Modify your existing post.
7. **Posts / Delete Post:** Clean up by deleting the post.

## Explanation of Variables

This collection relies on Postman Environment Variables to keep requests dynamic and secure:

* **`{{baseURL}}`**: The base URL of the local server (e.g., `http://localhost:3000/api`). This prevents hardcoding the URL in every single request, making it easy to switch between local and production environments later.
* **`{{authToken}}`**: The JWT (JSON Web Token) used for authenticating protected routes. This variable is initially blank. When you successfully run the **Register** or **Login** requests, a Postman Test Script automatically extracts the token from the response and populates this variable. All requests in the `Posts` folder use this variable in their `Authorization: Bearer {{authToken}}` header.