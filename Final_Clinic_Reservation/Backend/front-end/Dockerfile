FROM node:20.9.0 as build

WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app/
RUN npm run build 

FROM nginx:alpine
COPY --from=build  /app/dist/first_project/ /usr/share/nginx/html
EXPOSE 80
