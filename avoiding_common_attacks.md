## Avoiding Common Attacks

Below is list of the measures taken to avoid common attacks.

* The contracts supporting this DApp do not intentionally store a balance of Ether and have no functions to manage storage of Ether.  This by itself reduces exposure to attacks.

* There is only one "payable" function ```buyListing```.  This function performs all state variable updates first and then performs the transfer of Ether from buyer to seller last.

* Inputs to ```createListing``` function are validated using ```require```. The listing Title is limited to 32 characters and listing Description to 256 characters.  Listing Price is required to be greater than zero to prevent underflow.  

* Developed tests to test that a regular user is not able to execute ```onlyAdmin``` functions including assigning themselves as an administrator.

* Implemented ```Ownable``` contract to restrict write access to the storage contract ```EternalStorage``` only to the business logic contract ```MarketPlace```.