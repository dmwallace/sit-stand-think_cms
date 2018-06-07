FROM node:10-alpine as base

# Define working directory and copy source
RUN apk update
RUN apk add --no-cache tini
COPY package.json .

FROM base AS dependencies
COPY . .
RUN npm install
RUN npm run build

FROM nginx as release
COPY ./build /usr/share/nginx/html