FROM node:alpine

# Create app directory
WORKDIR /usr/src/server

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 80

CMD [ "npm", "start" ]
