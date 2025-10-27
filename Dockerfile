FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy all files
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
