const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

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
    // To-do Get a signature from the client-side application
  // Recover the sender from the signature.
  
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
