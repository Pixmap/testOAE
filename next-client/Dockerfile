FROM node:18.14-alpine3.16
WORKDIR /app/next-client
ADD . /
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]
