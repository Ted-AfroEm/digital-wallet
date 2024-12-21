#!/bin/bash

# Default backend port
DEFAULT_BACKEND_PORT=8081

# Allow dynamic backend port via argument
BACKEND_PORT=${1:-$DEFAULT_BACKEND_PORT}

echo "Setting up environment files with backend port: $BACKEND_PORT..."

# Backend .env file
BACKEND_ENV_FILE="./backend/.env"
if [ ! -f "$BACKEND_ENV_FILE" ]; then
    echo "Creating backend .env file..."
    cat > $BACKEND_ENV_FILE <<EOL
DATABASE_URL="postgresql://pgadmin:1234@localhost:6432/digital_wallet"
PORT=$BACKEND_PORT
JWT_SECRET_KEY="fa7910286fe158fe1712b717a420ad5af92397cd6a081f45dec4840a20c1b4e3"
EOL
    echo "Backend .env file created at $BACKEND_ENV_FILE"
else
    echo "Backend .env file already exists."
fi

# Frontend .env file
FRONTEND_ENV_FILE="./frontend/.env"
if [ ! -f "$FRONTEND_ENV_FILE" ]; then
    echo "Creating frontend .env file..."
    cat > $FRONTEND_ENV_FILE <<EOL
VITE_API_BASE_URL="http://localhost:$BACKEND_PORT/api"
EOL
    echo "Frontend .env file created at $FRONTEND_ENV_FILE"
else
    echo "Frontend .env file already exists."
fi

echo "Environment setup completed."
