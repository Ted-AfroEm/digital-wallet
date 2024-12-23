# Use the official Node.js image
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

# Expose the port for the application and Prisma Studio
EXPOSE 8081 5555

# Start the application and Prisma Studio in parallel
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev & npx prisma studio --port 5555"]
