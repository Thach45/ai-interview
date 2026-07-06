# Stage 1: Build the React/Vite app
FROM node:24-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Xóa trang html mặc định của nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy build từ stage 1 sang thư mục html của nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Mở port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
