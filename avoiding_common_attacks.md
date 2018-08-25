## Avoiding Common Attacks

Below is list of the measures taken to avoid common attacks.

* The contract does not intentionally store a balance of Ether and has no functions to manage storage of Ether.

* There is only one "payable" function ```buyListing```.  This function performs all state variable updates first and then performs the transfer of Ether from buyer to seller last.

* All inputs to ```createListing``` function are validated using ```require```. The listing Title is limited to 32 characters and listing Description to 256 characters.  Listing Price is required to be greater than zero to prevent underflow.

* Developed tests to test that a regular user is not able to execute ```onlyAdmin``` functions including assigning themselves as an administrator.

* Implemented ```Ownable``` contract to restrict write access to the storage contract ```EternalStorage``` only to the business logic contract ```MarketPlace```.

* Events are emitted by all functions that create or change state of a listing.  The DApp uses the ```createListingEvent``` event to retreive list of all listings from the transaction log. This avoids the need for a solidity function to loop over and return an array of undetermined length and risk exceeding the block gas limit.