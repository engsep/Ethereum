const express = require('express');
const path = require('path');
const fs = require('fs');
const {signedTransactionMethod, view} = require('./poeAPI_utils.js')

require('dotenv').config();
const { PUBLIC_KEY, PRIVATE_KEY, BLOCKCHAIN_URL, PORT = 3005, SMARTCONTRACTADDRESS, CHAINID } = process.env;

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
const contractJsonPath = path.resolve(__dirname, 'build/contracts/ProofOfExistence.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const SmartContractABI = contractJson.abi;
//provide smart contract address
const SmartContractAddress = SMARTCONTRACTADDRESS;
const PoEContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);

const LogsDecoder = require('logs-decoder'); // NodeJS
const logsDecoder = LogsDecoder.create();

logsDecoder.addABI(SmartContractABI);


app.use(cors({
    origin: '*'
}));

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(express.json());

app.post('/createProofHash', async function (req, res) {

    const document = req.body.document;

    var method = PoEContract.methods.createProofHash(document);
    
    view(method, PUBLIC_KEY).then(result => {
        console.log(result);
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
        res.status(400).send(err);
    });

})

app.post('/getProof', async function (req, res) {

    var hash = String(req.body.hash);

    var method = PoEContract.methods.getProof(hash);
    
    view(method, PUBLIC_KEY).then(result => {
        console.log(result);
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
        res.status(400).send(err);
    });

});

app.post('/certify', async function (req, res) {

    var document = String(req.body.document);
    var description = String(req.body.description);

    var data = PoEContract.methods.certify(document, description).encodeABI();
    
    signedTransactionMethod(
        account, data, SmartContractAddress, PRIVATE_KEY, web3, CHAINID, 
        [{ type: "bytes32", name: "hash"}]
    ).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(400).send(err);
    });

});

app.post('/notarize', async function (req, res) {

    var hash = String(req.body.hash);
    var description = String(req.body.description);

    var data = PoEContract.methods.notarize(hash, description).encodeABI();
    
    signedTransactionMethod(
        account, data, SmartContractAddress, PRIVATE_KEY, web3, CHAINID, 
        [{ type: "bytes32", name: "hash"}]
    ).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(400).send(err);
    });

});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

var server = app.listen(port, function () {

    var port = server.address().port
    
    console.log("Proof of Existence v5 APIs listening on port :%s", port)

})
