const Web3 = require('web3');

var translateError = function(error){
    let errors = ["No data notarized", "Hash cannot be null", "Timestamp must be normalized", "Only owner authorized"];

    if('data' in error){
        error = error["data"];

        if(typeof error == "string"){
            error = Web3.utils.hexToAscii(error);
            errors.every(e => {
                if(error.search(e) > -1){
                    error = e;
                    return false;
                }
                return true;
            });

        } else if(typeof error == "object") {
            try {
                
                for (let [key, value] of Object.entries(error)) {
                    console.log(value["reason"]);
                    error = value["reason"];
                    break;
                }

            } catch (err) {
                console.log(err);
            }
        } else {
            error = "unknown error";
        }

    }

    return error;
}

exports.normalize = function(date, timeslot=15) {
    let round = 1000 * 60 * timeslot;
    let rounded = new Date(Math.floor(date.getTime() / round) * round)
    return rounded.getTime()
}

exports.transactionMethod = function(method, PUBLIC_KEY){

    return new Promise(function (resolve, reject) {
        
        method.send({from: PUBLIC_KEY}).then((result) => {
            
            resolve(result.events.Notarized.returnValues);
        })
        .catch(error => {
            reject(error);
        });

    });
    
}

var recompose_data = function(data_splitted, formatObjects){
    
    if(data_splitted.length - formatObjects.length > 1){

        let idx = data_splitted.findIndex(p => p =="0000000000000000000000000000000000000000000000000000000000000040");
        if(idx >= 0){
            var removed = data_splitted.splice(idx, 1);
        }

    }

    let idx = data_splitted.findIndex(p => p =="0000000000000000000000000000000000000000000000000000000000000040");
    if(idx >= 0){
        data_splitted[idx] = "0000000000000000000000000000000000000000000000000000000000000060";
    }

    return "0x" + data_splitted.join("");

}

var divideInBytes32 = function(data){

    data_splitted = []
    data_to_split = data;

    if(data_to_split.startsWith('0x')){
        data_to_split = data_to_split.substr(2);
    }

    
    while(data_to_split != ""){
        data_splitted.push(data_to_split.substr(0, 64));
        data_to_split = data_to_split.substr(64);
    }
    
    return data_splitted;

}

exports.signedTransactionMethod = function(account, methodABI, SmartContractAddress, PRIVATE_KEY, web3, CHAINID, formatObjects){

    return new Promise(function (resolve, reject) {
        
        account.signTransaction({
            gas: 4465030,
            to: SmartContractAddress,
            data: methodABI,
            value: "0x00",
            chainId: CHAINID // Commenting out this line results in an invalid rawTransaction
        }, PRIVATE_KEY)
        .then(signedTx => {
                console.log("Valid transaction:", web3.utils.isHex(signedTx.rawTransaction))
                web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(receipt => {

                console.log("Transaction succeeded", receipt);
                console.log(formatObjects);

                var data_splitted = divideInBytes32(receipt.logs[0].data);
                var data_composed = recompose_data(data_splitted, formatObjects);
                var result = web3.eth.abi.decodeParameters(formatObjects, data_composed);
                //var result = web3.eth.abi.decodeLog(formatObject, data_composed, receipt.logs[0].topics);

                resolve(result);
    
            })
            .catch(error => {
                reject(error);
            });

        })
        
    });
    
}


exports.view = function(method, PUBLIC_KEY){

    return new Promise(function (resolve, reject) {
        
        method.call({from: PUBLIC_KEY}).then((result) => {

            r = {
                "result": result
            }
    
            resolve(r);
        })
        .catch(error => {
    
            error = translateError(error);
    
            r = {
                "text": error,
                "result": false
            }
    
            reject(r);
        });

    });

    
}