FROM node:23-slim

RUN mkdir /app
RUN mkdir /app/build
RUN mkdir /app/build/contracts

WORKDIR /app

COPY package*.json /app/
COPY ProofOfExistenceAPI.js /app/
COPY poeAPI_utils.js /app/

COPY build/contracts/*.json /app/build/contracts/

ENV BLOCKCHAIN_URL="https://ethereum-sepolia-rpc.publicnode.com"
ENV PORT=3005
ENV CHAINID=11155111
ENV SMARTCONTRACTADDRESS="0xa4fede92DD5c7290720f8e5f154780C4ba093fE0"

RUN npm install

EXPOSE 3005

CMD npm start