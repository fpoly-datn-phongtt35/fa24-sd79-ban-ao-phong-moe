FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 1004

CMD ["npm", "run", "dev"]
