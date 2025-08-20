# README.md

## What is this?

This is a Knowledge Base app.
This is a very simple project to practice React (Typescript) + GraphQL

## quick start

To Get Hacking (and take advantage of hot-reload, linting, and other goodies), execute the following (Docker Compose is a requirement):

`docker compose -f docker-compose.dev.yml up --build`

## Server folder commands

npm run dev → start GraphQL API

npm run lint → check TS/Node code

npm run format → auto-fix formatting

npm run test  → test the server side code. test:watch and test:ci are also available.

## Client folder commands

npm run dev → start Vite + React

npm run lint → check TS/React code

npm run format → auto-fix formatting

npm run lint:css → check CSS

npm run format:css → auto-fix CSS

npm run test  → test the client side code. test:watch and test:ci are also available.

## Testing

You may test the server and client code once the services are up via docker compose.

### server side

`docker compose -f docker-compose.dev.yml exec server npm run test`

### client side

`docker compose -f docker-compose.dev.yml exec client npm run test`