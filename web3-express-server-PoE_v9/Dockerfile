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
ENV PORT=3009
ENV CHAINID=11155111
ENV SMARTCONTRACTADDRESS="0xd2b4be223d92788706284f7f097fa883eef64977"

RUN npm install

EXPOSE 3009

CMD npm start