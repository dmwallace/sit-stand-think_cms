FROM nginx:stable-alpine

RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

WORKDIR /usr/share/nginx/html
COPY build /usr/share/nginx/html

FROM nginx
WORKDIR /usr/share/nginx/html
#COPY --from=dependencies /home/node/app/build .
COPY nginx.conf /etc/nginx/nginx.conf