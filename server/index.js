const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

// private key:  4337aa776fc53f73923a9e11cb0c8bcbd7a4207dd802a2d49868a8efce15de8c
// public key:  03757d6c6c31f737aa57604374874c47ebaa8f3c09555e2dd440520127142a8e69

// private key:  0deb8a6fe1ee8c1f936dc3e7f6b03791489c0fabf48c3f0ea9399c016e2ea06e
// public key:  03896dcbb3420a647475902ea254611785bf84c95beaf8210586bfcca8ca2b016c

// private key:  440feea85bb2d76701ff3cb4f140e4d05489933b538c89f59d324ee87dd1fe0b
// public key:  0234903bef36f7af8005547314f4f7f777d97df0ffcb3bc053e72b9177ee81ee65

const balances = {
  "03757d6c6c31f737aa57604374874c47ebaa8f3c09555e2dd440520127142a8e69": 100,
  "03896dcbb3420a647475902ea254611785bf84c95beaf8210586bfcca8ca2b016c": 50,
  "0234903bef36f7af8005547314f4f7f777d97df0ffcb3bc053e72b9177ee81ee65": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  if (address == undefined || address == null) {
    res.status(400).send({message: "No address provided, need to get balance first !"});
}
const {recipient, amount, signature, recoveryBit, publicKey} = req.body;
console.log("Sender : ", address);
console.log("Recipient : ", recipient);
console.log("Amount : ", amount);
console.log("Signature : ", signature);
console.log("Recovery Bit : ", recoveryBit);

let message = {
    from: address,
    to: recipient,
    amount: amount,
};
const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));
const recoverKey = secp.recoverPublicKey(messageHash, signature, recoveryBit);
setInitialBalance(address);
setInitialBalance(recipient);
if (toHex(recoverKey) === publicKey) {
    if (balances[address] < amount) {
        res.status(400).send({message: "Not enough funds in " + address + " wallet !"});
    } else {
        balances[address] -= amount;
        balances[recipient] += amount;
        res.send({balance: balances[address]});
    }
} else {
    res.status(400).send({message: "Not the right signature !"});
}
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
