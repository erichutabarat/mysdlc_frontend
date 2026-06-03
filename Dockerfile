FROM node:22-alpine
WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Expose the default Next.js port
EXPOSE 3000

CMD ["npm", "start"]