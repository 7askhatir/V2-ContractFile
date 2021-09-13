import Web3 from "web3";
import fileContractArtifact from "../../build/contracts/FileContract.json";
import sha256 from 'crypto-js/sha256';
const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = fileContractArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        fileContractArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  //  send File 

  sendFile: async function () {
    var myList = document.getElementById('myList');
    myList.innerHTML = '';

    if (document.querySelector("#file").files.length > 0) {
      var file = document.querySelector("#file").files[0];
      setStatut("hashing file ..........",true);
      createHash(file)
        .then((hash) => {
          setStatut("[OK]  ",true);
          if (hash[0] != '0' && hash[1] != 'x') hash = '0x' + hash;
          var fileHash = hash;
          setStatut("hash:"+hash,true)
          var fileName = file.name;
          var fileCommant = document.querySelector("#FileCommant").value;
          setStatut("Initiating transaction... (please wait)",true);
          const sendF = this.meta.methods;
          sendF.addFile(fileHash, fileName, fileCommant).send({ from: this.account, gas: 300000 })
            .then(a => {
              setStatut("[0K]",true)
              setStatut("transactionHash:"+a.transactionHash,true);
            }).catch(err => {
              setStatut("[Erreur transaction !! ]",false);
              console.log(err)
            })

        })
        .catch(err=>{
          console.log(err);
          setStatut("[Errer Hash] ",false);
        })


    }
  }
  ,
  findFile: async function () {
    var myList = document.getElementById('myList');
    myList.innerHTML = '';
    if (document.querySelector("#file2").files.length > 0) {
      var file = document.querySelector("#file2").files[0];
      setStatut("hashing file ..........",true);
      createHash(file)
        .then((hash) => {
          setStatut("[OK] ",true);
          if (hash[0] != '0' && hash[1] != 'x') hash = '0x' + hash;
          var fileHash = hash;
          setStatut("hash:"+hash,true)
          const sendF = this.meta.methods;
          sendF.findFile(fileHash).call()
            .then(a => {
              setStatut("[0K]",true)
              setStatut("name:"+a[0],true);
              setStatut("commant:"+a[2],true)
              setStatut("send by:"+a[3],true)
              
            }).catch(err => {
              setStatut("[Erreur this file note existe]",false);
              console.log(err)
            })

        })
        .catch(err=>{
          console.log(err);
          setStatut("[Errer Hash] <br/>",false);
        })

      
    }  
  }
};

function createHash(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader;
    reader.onload = function (e) {
      var data = reader.result;
      // console.log(sha256(rawLog))

      const hash = crypto.subtle.digest('SHA-256', data)
        .then(a => {
          resolve(toHex(a))
        }).catch(reject)

    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file)
  })

}
function toHex(buffer) {
  var i, n, k, value, stringValue, padding, paddedValue;
  var hexCodes = [];
  var view = new DataView(buffer);
  for (i = 0, n = view.byteLength; k = Uint32Array.BYTES_PER_ELEMENT, i < n; i += k) {
    value = view.getUint32(i);
    stringValue = value.toString(16);
    padding = '00000000';
    paddedValue = (padding + stringValue).slice(-padding.length);
    hexCodes.push(paddedValue);
  }
  return hexCodes.join('');

}

function setStatut(status,bool){
  var node = document.createElement("LI")
  var textnode = document.createTextNode(status);
  node.appendChild(textnode);
  var cl;
  if(bool==true)cl="green";
  if(bool==false) cl="red";
  node.style="color:"+cl+";";
  document.getElementById("myList").appendChild(node);

}

window.App = App;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }

  App.start();
});
