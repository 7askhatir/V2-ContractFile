pragma solidity >=0.4.22 <0.9.0;

contract FileContract{

  struct fileDetail{
     string fileName;
     uint timestamp;
     bytes32 checkSum;
     string comments;
     bool isSet;
     address setBy;
  }

  mapping (bytes32=>fileDetail) fileMaping;
  
  event newFile(bytes32 _checkSum,string  _fileName,address _setBy);


// 0xF00A78F0862654AFE4FD5422E6E5BE1533DF1259F8E253ACAFC6A20566468893,'khalid','file comment'
  function addFile(bytes32 _checkSum,string memory _fileName,string memory _comments) public {
       require(!fileMaping[_checkSum].isSet);
        
        fileMaping[_checkSum].timestamp=block.timestamp;
        fileMaping[_checkSum].setBy=msg.sender;
        fileMaping[_checkSum].comments=_comments;
        fileMaping[_checkSum].isSet=true;
        fileMaping[_checkSum].fileName=_fileName;
        emit newFile(_checkSum,_fileName,msg.sender);
  }
  
  function findFile(bytes32 _checkSum) public view returns(string memory,uint,string memory,address){
      require(fileMaping[_checkSum].isSet);
      return (fileMaping[_checkSum].fileName,fileMaping[_checkSum].timestamp,fileMaping[_checkSum].comments,fileMaping[_checkSum].setBy);
  }

}