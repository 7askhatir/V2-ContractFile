var assert = require('assert');
const { isMainThread } = require("worker_threads");

var FileContract=artifacts.require("FileContract");

contract("FileContract",function(accounts){
    it("message",function(){
        console.log(accounts);
    });
    it("test addFile and findFile",async ()=>{
     let instance=await FileContract.deployed();
     await instance.addFile('0xF00A78F0862654AFE4FD5422E6E5BE1533DF1259F8E253ACAFC6A20566468893','khalid','file comment');
     let test=await instance.findFile('0xF00A78F0862654AFE4FD5422E6E5BE1533DF1259F8E253ACAFC6A20566468893');
     assert.equal(test[0],"khalid","name file shold be tested");
     assert.equal(test[1].toNumber()>=1,true,"time shold be tested");
     assert.equal(test[2],"file comment"," Commant file shold be tested");
     assert.equal(test[3],accounts[0]," sending transaction");
    });
});