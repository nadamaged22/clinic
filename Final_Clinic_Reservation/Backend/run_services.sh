#!/bin/bash

# Define the Docker Compose file content
DOCKER_COMPOSE_CONTENT="version: '3.9'

services:
  index:
    build: .
    ports:
      - '8000:8000'
  db:
    build: ./database
    ports:
      - '5432:5432'
    volumes:
      - data:/var/lib/postgresql/data 
  frontend:
    container_name: frontend_container
    image: amralaa21/front-image
    ports:
      - '3000:3000'

volumes:
  data:"

# Specify the Docker Compose filename
DOCKER_COMPOSE_FILENAME="docker-compose.yml"

# Write the Docker Compose content to the file
echo "$DOCKER_COMPOSE_CONTENT" > "$DOCKER_COMPOSE_FILENAME"

# Run Docker Compose
docker-compose up -d

echo "Docker services have been started successfully."
