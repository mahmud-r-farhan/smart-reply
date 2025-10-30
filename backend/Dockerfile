# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Set environment variables 
ENV PORT=5006

# Start the application
CMD ["node", "index.js"]
