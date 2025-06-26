FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .

COPY scripts/replace_api_url.sh /replace_api_url.sh
RUN chmod +x /replace_api_url.sh

CMD ["/replace_api_url.sh"]
