FROM node:23-slim

RUN mkdir /app
RUN mkdir /app/build
RUN mkdir /app/build/contracts

WORKDIR /app

COPY package*.json /app/
COPY MonitoringDataNotarizationAPI.js /app/
COPY mdnAPI_utils.js /app/

COPY build/contracts/MonitoringDataNotarization.json /app/build/contracts/

ENV BLOCKCHAIN_URL="https://ethereum-sepolia-rpc.publicnode.com"
ENV PORT=3000
ENV CHAINID=11155111
ENV SMARTCONTRACTADDRESS="0xc3704D07b1F3E09De8226F6596abb98B4dA7ed44"

RUN npm install

EXPOSE 3000

CMD npm start