# Stage 1: Build the React Application
FROM node:20-alpine AS build
WORKDIR /app

# Copy root workspace and client files
COPY package*.json ./
COPY client/package*.json ./client/
RUN npm ci --workspace=client

COPY client/ ./client/
COPY data/ ./data/
RUN npm run build --workspace=client

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
