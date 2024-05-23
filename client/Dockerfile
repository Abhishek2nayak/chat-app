# Use the official Node.js image as a base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Verify the working directory
RUN pwd
RUN ls -la

# Build the React application
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["serve", "-s", "build"]
