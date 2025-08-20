# Build static files
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY tsconfig.json tsconfig.node.json vite.config.ts ./
COPY index.html ./index.html
COPY src ./src
# Build with env override if needed: VITE_API_URL=/graphql
ARG VITE_API_URL=/graphql
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
