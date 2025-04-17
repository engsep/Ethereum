const express = require('express');
const path = require('path');
const fs = require('fs');
const {signedTransactionMethod, view} = require('./mdnAPI_utils.js')

require('dotenv').config();
const { PUBLIC_KEY, PRIVATE_KEY, BLOCKCHAIN_URL, PORT = 3000, SMARTCONTRACTADDRESS, CHAINID } = process.env;

const app = express();
const port = PORT;
const cors = require('cors');
const bp = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const Web3 = require('web3');
//provide the link of the blockchain node
const web3 = new Web3(BLOCKCHAIN_URL);
var account = web3.eth.accounts;

//provide the contract compiled
const contractJsonPath = path.resolve(__dirname, 'build/contracts/MonitoringDataNotarization.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const SmartContractABI = contractJson.abi;
//provide smart contract address
const SmartContractAddress = SMARTCONTRACTADDRESS;
const MDNContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);

const LogsDecoder = require('logs-decoder'); // NodeJS
const logsDecoder = LogsDecoder.create();

logsDecoder.addABI(SmartContractABI);


app.use(cors({
    origin: '*'
}));

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(express.json());

app.post('/certify', async function (req, res) {

    var label = String(req.body.label);
    var data = String(req.body.data);
    
    var data = MDNContract.methods.certify(label, data).encodeABI();

    signedTransactionMethod(
        account, data, SmartContractAddress, PRIVATE_KEY, web3, CHAINID,
        [{ type: 'uint', name: 'timestamp'},{ type: "string", name: "label"},{ type: "bytes32", name: "hash"}]
    ).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        if(err['receipt']['status'] == false){
            console.log("Transaction Reverted")
            res.status(400).send("Transaction Reverted: already registered timeslot.");
        } else {
            res.status(400).send(err);
        }
    });

});

app.post('/notarize', async function (req, res) {

    var timestamp = req.body.timestamp;
    var label = String(req.body.label);
    var hash = String(req.body.hash);

    var data = MDNContract.methods.notarize(timestamp, label, hash).encodeABI();

    signedTransactionMethod(
        account, data, SmartContractAddress, PRIVATE_KEY, web3, CHAINID,
        [{ type: 'uint', name: 'timestamp'},{ type: "string", name: "label"},{ type: "bytes32", name: "hash"}]
    ).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        if(err['receipt']['status'] == false){
            console.log("Transaction Reverted")
            res.status(400).send("Transaction Reverted: already registered timeslot.");
        } else {
            res.status(400).send(err);
        }
    });

});

app.post('/check', async function (req, res) {

    var timestamp = req.body.timestamp;
    var data = String(req.body.data);

    var method = MDNContract.methods.check(timestamp, data);
    
    view(method, PUBLIC_KEY).then(result => {
        console.log(result);
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
        res.status(400).send(err);
    });

});

app.post('/verify', async function (req, res) {

    var timestamp = req.body.timestamp;
    var hash = String(req.body.hash);

    var method = MDNContract.methods.verify(timestamp, hash);
    
    view(method, PUBLIC_KEY).then(result => {
        console.log(result);
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
        res.status(400).send(err);
    });

});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

var server = app.listen(port, function () {

    var port = server.address().port
    
    console.log("Monitoring Data Notarization APIs listening on port :%s", port)

})
