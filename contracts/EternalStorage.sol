pragma solidity ^0.4.24;

import "./Ownable.sol";

contract EternalStorage is Ownable {

  constructor() public {
  }

  mapping(bytes32 => uint) UIntStorage;

  function getUIntValue(bytes32 _record) public view returns (uint) {
    return UIntStorage[_record];
  }

  function setUIntValue(bytes32 _record, uint _value) public onlyOwner {
    UIntStorage[_record] = _value;
  }

  function deleteUIntValue(bytes32 _record) public onlyOwner {
    delete UIntStorage[_record];
  }

  mapping(bytes32 => string) StringStorage;

  function getStringValue(bytes32 _record) public view returns (string) {
    return StringStorage[_record];
  }

  function setStringValue(bytes32 _record, string _value) public onlyOwner {
    StringStorage[_record] = _value;
  }

  function deleteStringValue(bytes32 _record) public onlyOwner {
    delete StringStorage[_record];
  }

  mapping(bytes32 => address) AddressStorage;

  function getAddressValue(bytes32 _record) public view returns (address){
    return AddressStorage[_record];
  }

  function setAddressValue(bytes32 _record, address _value) public onlyOwner
  {
    AddressStorage[_record] = _value;
  }

  function deleteAddressValue(bytes32 _record) public onlyOwner
  {
    delete AddressStorage[_record];
  }

  mapping(bytes32 => bytes) BytesStorage;

  function getBytesValue(bytes32 _record) public view returns (bytes) {
    return BytesStorage[_record];
  }

  function setBytesValue(bytes32 _record, bytes _value) public onlyOwner {
    BytesStorage[_record] = _value;
  }

  function deleteBytesValue(bytes32 _record) public onlyOwner {
    delete BytesStorage[_record];
  }

  mapping(bytes32 => bytes32) Bytes32Storage;

  function getBytes32Value(bytes32 _record) public view returns (bytes32){
    return Bytes32Storage[_record];
  }

  function setBytes32Value(bytes32 _record, bytes32 _value) public onlyOwner {
    Bytes32Storage[_record] = _value;
  }

  function deleteBytes32Value(bytes32 _record) public onlyOwner
  {
    delete Bytes32Storage[_record];
  }

  mapping(bytes32 => bool) BooleanStorage;

  function getBooleanValue(bytes32 _record) public view returns (bool){
    return BooleanStorage[_record];
  }

  function setBooleanValue(bytes32 _record, bool _value) public onlyOwner {
    BooleanStorage[_record] = _value;
  }

  function deleteBooleanValue(bytes32 _record) public onlyOwner {
    delete BooleanStorage[_record];
  }

  mapping(bytes32 => int) IntStorage;

  function getIntValue(bytes32 _record) public view returns (int) {
    return IntStorage[_record];
  }

  function setIntValue(bytes32 _record, int _value) public onlyOwner {
    IntStorage[_record] = _value;
  }

  function deleteIntValue(bytes32 _record) public onlyOwner {
    delete IntStorage[_record];
  }
}