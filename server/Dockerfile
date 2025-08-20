# Build & run the GraphQL server
FROM node:20-alpine AS base
WORKDIR /app

# Only install prod deps at runtime, dev deps for build
COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

# build TypeScript → JS
RUN npm run build

# --- runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY --from=base /app/dist ./dist
CMD ["node", "dist/server.js"]
EXPOSE 4000
