FROM node:10.15.3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Path to local installs
ENV PATH /usr/src/app/node_modules/.bin:$PATH
# Path to global installs
ENV PATH /usr/local/node_modules/.bin:$PATH

RUN npm install -g nodemon
COPY ./package*.json ./
RUN npm install

COPY ./ ./

CMD ["npm", "start"]