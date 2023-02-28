FROM node:18.14-alpine3.16
WORKDIR /app/server
ADD . /
RUN npm install
EXPOSE 7071
CMD ["npm", "run", "start"]
