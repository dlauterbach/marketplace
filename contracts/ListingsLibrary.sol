pragma solidity ^0.4.24;

import "./EternalStorage.sol";

/** @title ListingsLibrary */
library ListingsLibrary {

  /** @dev Library function to get number of listings.
    * @return Listing count.
    */
  function getListingCount(address _storageContract) public view returns(uint) 
  {
    return EternalStorage(_storageContract).getUIntValue(keccak256("ListingCount"));
  } 
	
  /** @dev Library function to save a listing in instance of EternalStorage contract.
    * @param _storageContract - Instance of EternalStorage.
    * @param _title - Title of the listing.
    * @param _description - Description of the listing.
    * @param _price - Price of the listing.
    * @param _photoIPFSHash - IPFS hash for listing photo.
    * @param _seller - Seller of the listing.
    * @param _buyer - Buyer of the listing.
    */
  function createListing(
    address _storageContract, 
    string _title, 
    string _description, 
    uint _price, 
    string _photoIPFSHash,
    address _seller, 
    address _buyer
  ) 
  public
  {
    uint idx = getListingCount(_storageContract) + 1;
    EternalStorage(_storageContract).setUIntValue(keccak256("ListingCount"), idx);
    EternalStorage(_storageContract).setStringValue(keccak256(abi.encodePacked("listing_title", idx)), _title);
    EternalStorage(_storageContract).setStringValue(keccak256(abi.encodePacked("listing_description", idx)), _description);
    EternalStorage(_storageContract).setUIntValue(keccak256(abi.encodePacked("listing_price", idx)), _price);
    EternalStorage(_storageContract).setStringValue(keccak256(abi.encodePacked("listing_photohash", idx)), _photoIPFSHash);
    EternalStorage(_storageContract).setAddressValue(keccak256(abi.encodePacked("listing_seller", idx)), _seller);
    EternalStorage(_storageContract).setAddressValue(keccak256(abi.encodePacked("listing_buyer", idx)), _buyer);
  }

}