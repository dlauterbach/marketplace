pragma solidity ^0.4.24;

contract Ownable {
  address public owner = msg.sender;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /// @notice change the owner of the contract
  /// @param _newOwner the address of the new owner of the contract.
  function transferOwnership(address _newOwner) 
    public
    onlyOwner
  {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}