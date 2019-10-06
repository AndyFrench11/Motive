FROM node:8

COPY /home/gitlab-runner/server.pem /server.pem

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY semantic.json .
COPY semantic/ .



RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8082
CMD [ "npm", "start" ]