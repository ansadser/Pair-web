FROM node:22-alpine
RUN apk add --no-cache git
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 10000
CMD ["npm","start"]