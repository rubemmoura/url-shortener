# URL Shortener Project

## Overview

This project provides a URL Shortener service with an integrated authentication system. It includes two backend services: one for authentication and another for the URL shortening functionality. Each backend service is paired with its own database. The project is containerized using Docker Compose, which orchestrates the setup of the services and databases.

## Prerequisites

Before getting started, ensure that the following software is installed on your machine:

- Docker Engine
- Docker Compose

## Getting Started

1. Clone the repository to your local machine:

    ```
    git clone https://github.com/rubemmoura/url-shortener.git
    ```

2. Navigate to the project directory:

    ```
    cd url-shortener
    ```

3. Run Docker Compose to start the services:

    ```
    docker-compose up
    ```

4. Once the services are up and running, you can access the following:

    - Authentication Service: [http://localhost:3000](http://localhost:3000)
    - Authentication doc API: [http://localhost:3000](http://localhost:3000/api/swagger)
    - URL Shortener Service: [http://localhost:3001](http://localhost:3001)
    - URL Shortener doc API: [http://localhost:3001](http://localhost:3001/api/swagger)
    - Authentication Database (PostgreSQL): Port 5432
    - URL Shortener Database (PostgreSQL): Port 5433

## Testing

To run unit and integration tests for each service, navigate to the respective service directory and execute:

    ```
    cd url_shortener_auth
    npm test
    ```

    ```
    cd url_shortener_service
    npm test
    ```


## Postman Collection

A Postman collection is provided at the root of the project, containing pre-configured requests to test the functionalities of the services. Make sure the services are running before executing the requests.

## Swagger Documentation

Swagger documentation for the Authentication Service API can be found at `url_shortener_auth/url_shortener_auth_swagger_v1.0.0.yaml`.

Swagger documentation for the URL Shortener Service API can be found at `url_shortener_service/url_shortener_service_swagger_v1.0.0.yaml`.

## Ports Used

The services are configured to use the following ports:

- Authentication Service: 3000
- URL Shortener Service: 3001
- Authentication Database: 5432
- URL Shortener Database: 5433

## License

This project is licensed under the [MIT License](LICENSE).
