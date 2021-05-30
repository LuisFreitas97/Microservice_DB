FROM node:14.15.4

WORKDIR /app

COPY . /app

# COPY package.json package.json
# COPY package-lock.json package-lock.json

RUN npm install -g nodemon
RUN npm install

# COPY . .

# CMD [ "node", "server.js" ]

ENTRYPOINT [ "nodemon", "/app/server.js" ]