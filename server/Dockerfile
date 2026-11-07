FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy root and server package configurations
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm ci --workspace=server --omit=dev

# Copy server application and database files
COPY server/ ./server/
COPY database/ ./database/
COPY data/ ./data/

EXPOSE 5000
CMD ["npm", "run", "start", "--workspace=server"]
