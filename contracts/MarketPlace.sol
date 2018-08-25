pragma solidity ^0.4.24;

//import "./Ownable.sol";
import "./ListingsLibrary.sol";
import "./EternalStorage.sol";

/** @title MarketPlace */
contract MarketPlace is Ownable {

  using ListingsLibrary for EternalStorage;
  EternalStorage public eternalStorage;

  bool locked;
  uint adminCount;
  mapping(address => bool) admins;

  /**
   * Set locked to "false", thus activating the contract.  Create new instance of 
   * EternalStorage contract, thus setting owner of EternalStorage contract to address 
   * of this contract.  This makes it so only this contract and the libraries it uses 
   * can write to state of EternalStorage contract as all writeable methods of 
   * EternalStorage contract are decorated with "onlyOwner" modifier.
   *
   * Also add msg.sender (the contract owner) as an administrator, granting them 
   * administrator privileges. 
   */
  constructor() public {
    locked = false;
    eternalStorage = new EternalStorage();
    admins[msg.sender] = true;
    adminCount = 1;
  }

  /*
   * Declare "Listing" events to allow application access to all listings and to trigger
   * application user interface updates.
   */
  event createListingEvent(
    uint indexed listingId
  );
  event buyListingEvent(
    uint indexed listingId
  );
  event cancelListingEvent(
    uint indexed listingId
  );

  /*
   * Declare "Admin" events to allow application to display list of administrators.
   */
  event addAdminEvent(
    address indexed user
  );
  event removeAdminEvent(
    address indexed user
  );

  modifier isLocked() {
    require (
      locked,
      "Contract must be locked to call this function."
    );
    _;
  }
  modifier isNotLocked() {
    require (
      !locked,
      "Contract must be unlocked to call this function."
    );
    _;
  }
  modifier isSeller(uint _id) {
    require (
      msg.sender == eternalStorage.getAddressValue(keccak256(abi.encodePacked("listing_seller", _id))),
      "Only seller is allowed to call this function."
    );
    _;
  }
  modifier isNotSeller(uint _id) {
    require (
      msg.sender != eternalStorage.getAddressValue(keccak256(abi.encodePacked("listing_seller", _id))),
      "Seller is not allowed to call this function."
    );
    _;
  }
  modifier isForSale (uint _id) {
    require (
      eternalStorage.getAddressValue(keccak256(abi.encodePacked("listing_buyer", _id))) == 0x0,
      "This listing is not for sale."
    );
    _;
  }

  modifier onlyAdmin {
    require(
      admins[msg.sender] == true,
      "Only adminstrators are allowed to call this function."
    );
    _;
  }

  /** @dev Locks contract so that no listing transactions can be performed.
    */
  function lock() public onlyAdmin isNotLocked() {
    locked = true;
  }

  /** @dev Unlocks contract so that listing transactions can be performed.
    */
  function unlock() public onlyAdmin isLocked() {
    locked = false;
  }

  /** @dev Checks if contract is locked.
    * @return "true" or "false"
    */
  function isFrozen()
    public view
    returns(bool)
  {
    if (locked) {
      return true;
    } else {
      return false;
    }
  }

  /** @dev Creates a new listing.
    * @param _title - Title of the listing. Must be less than 32 characters in length.
    * @param _description - Description of the listing. Must be less than 256 characters in length.
    * @param _price - Price of the listing. Must be greater than 0.
    */
  function createListing(string _title, string _description, uint _price) 
    public 
    isNotLocked() 
  {
    require(
      bytes(_title).length > 0 && bytes(_title).length < 33,
      "Listing title must be between 1 and 32 characters in length."
    );
    require(
      bytes(_description).length > 0 && bytes(_description).length < 257,
      "Listing description must be between 1 and 256 characters in length."
    );
    require(
      _price > 0,
      "Listing price must be greater than 0."
    );
    eternalStorage.createListing(_title, _description, _price, msg.sender, 0x0);
    uint _id = eternalStorage.getListingCount();
    emit createListingEvent(_id);
  }

  /** @dev Marks a listing as sold by setting listing buyer to address of msg.sender and 
    * transfers an amount of ETH equal to the listing price from msg.sender to the listing
    * seller.
    * @param _id - Id of the listing.
    */
  function buyListing(uint _id) 
    public payable
    isNotLocked() 
    isForSale(_id) 
    isNotSeller(_id)
  {
    uint _price = eternalStorage.getUIntValue(keccak256(abi.encodePacked("listing_price", _id)));
    address _seller = eternalStorage.getAddressValue(keccak256(abi.encodePacked("listing_seller", _id)));
    eternalStorage.setAddressValue(keccak256(abi.encodePacked("listing_buyer", _id)), msg.sender);
    _seller.transfer(_price);
    emit buyListingEvent(_id);
  }

  /** @dev Marks a listing as cancelled by setting listing buyer to address of listing seller.
    * @param _id - Id of the listing.
    */
  function cancelListing(uint _id) 
    public
    isForSale(_id) 
    isSeller(_id)
  {
    eternalStorage.setAddressValue(keccak256(abi.encodePacked("listing_buyer", _id)), msg.sender);
    emit cancelListingEvent(_id);
  }

  /** @dev Gets all attributes for a listing.
    * @param _id - Id of the listing.
    */
  function getListing(uint _id) 
    public view
    returns(string _title, string _description, uint _price, address _seller, address _buyer)
  {
    return(
      eternalStorage.getStringValue(keccak256(abi.encodePacked("listing_title", _id))),
      eternalStorage.getStringValue(keccak256(abi.encodePacked("listing_description", _id))),
      eternalStorage.getUIntValue(keccak256(abi.encodePacked("listing_price", _id))),
      eternalStorage.getAddressValue(keccak256(abi.encodePacked("listing_seller", _id))),
      eternalStorage.getAddressValue(keccak256(abi.encodePacked("listing_buyer", _id)))
    );
  }

  /** @dev Adds new administrator.
    * @param _user - Address of user to add.
    */
  function addAdmin(address _user)
    public
    onlyAdmin
  {
    require(
      _user != address(0),
      "A valid user address must be provided."
    );
    admins[_user] = true;
    adminCount++;
    emit addAdminEvent(_user);
  }

  /** @dev Removes an existing administrator.
    * @param _user - Address of user to remove.
    */
  function removeAdmin(address _user)
    public
    onlyAdmin
  {
    require(_user != owner, "Contract owner cannot be removed as admin.");
    admins[_user] = false;
    adminCount--;
    emit removeAdminEvent(_user);
  }

  /** @dev Checks whether a user address is an administrator.
    * @param _user - Address of user to check.
    * @return "true" or "false"
    */
  function isAdmin(address _user)
    public view
    returns(bool)
  {
    if (admins[_user]) {
      return true;
    } else {
      return false;
    }
  }
}