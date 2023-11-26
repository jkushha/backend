from alpine

ARG HOME=/root

RUN mkdir /app

RUN apk add --update \
    bash \
    mysql-client \
    nodejs \
    npm

WORKDIR /app

COPY . .

##################################################
#
# Node JS support
#
##################################################
ENV PATH=$HOME/node_modules/.bin:/app/node_modules/.bin:$PATH
COPY ./package.json $HOME/package.json
RUN npm install 
RUN chmod 777 bin/*
EXPOSE 80
