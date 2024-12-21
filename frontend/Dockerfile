# Frontend Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the frontend
RUN npm run build

# Use a lightweight server for the built app
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the default nginx port
EXPOSE 8080

# Start the server
CMD ["nginx", "-g", "daemon off;"]
