# Download the chose node image from docker hub (https://hub.docker.com/_/node) 
FROM node:20-alpine

# Create a directory for the app
WORKDIR /app

# Copy the package.json and package-lock.json files to the app directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build the app
RUN npm run build

# Docker's Node images has a secure user named node, that has access to the container
USER node

# Run the app
CMD [ "npm", "start" ]

# Expose the port on which the app is running
EXPOSE 8000
