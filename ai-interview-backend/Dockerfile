FROM node:24

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (if you use Prisma)
RUN npx prisma generate

# Build the project
RUN npm run build

EXPOSE 3000

# You can change this to "node dist/index.js" if you have a production start script
CMD ["npm", "start"]
