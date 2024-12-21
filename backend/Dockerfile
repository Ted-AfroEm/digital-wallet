# Backend Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port from .env file
EXPOSE 8081

# Start the application and run migrations
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]
