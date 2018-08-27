# Ethereum Marketplace DApp

This repository contains an Ethereum Marketplace DApp. It is similar to a very basic eBay.  Users can list items for sale and other users can buy them with Ether.  It was developed as the final project for ConsenSys Academy's 2018 Developer Program.  The smart contracts were developed in [Solidity](https://solidity.readthedocs.io/en/v0.4.24/) using the [Truffle](https://github.com/trufflesuite/truffle) framework.  The user interface was developed using [React](https://reactjs.org/) and [reactstrap](https://reactstrap.github.io/).

A React app folder was created using [Create React App](https://github.com/facebookincubator/create-react-app).  `truffle init` was used to create a separate Truffle project folder.  The two folders were merged by copying one over the other.  To allow the [web3](https://github.com/ethereum/wiki/wiki/JavaScript-API) API in the React app to access the contract ABIs, the Truffle `contracts` folder was symbolically linked to appear under the React `src` folder.

This DApp stores listing photographs to [IPFS](https://ipfs.io/) using [INFURA](https://infura.io/) and [ipfs-api](https://github.com/ipfs/js-ipfs-api).

## Steps to Install and Run:
*(Assuming you've already installed Node.js, ganache-cli and Truffle and enabled MetaMask extension in your browser.)*

Clone this repository:
```
git clone https://github.com/dlauterbach/marketplace.git
```
Change directory to ```marketplace``` folder and install all requisite npm packages (as listed in ```package.json```):
```
cd marketplace
npm install
```
Compile smart contracts:
```
truffle compile
```
This creates the contract artifacts in folder ```build\contracts```.

The ```contracts``` folder must be linked to appear under ```src```.  If using Windows Command Prompt:
```
mklink /J src\contracts build\contracts 
```
If using Windows Powershell:
```
cmd /c mklink /J src\contracts build\contracts
```
If using Linux:
```
ln -s /<absolute path to marketplace>/build/contracts /<absolute path to marketplace>/src/contracts
```
*(On Linux the source and target directories must be specified as absolute paths.)*

In separate terminal/shell, launch Ganache:
```
ganache-cli
```
Copy the mnemonic phrase from the Ganache console. Use it to import this account using seed phrase into MetaMask in your browser.  Before importing select network ```Localhost 8545``` in MetaMask.

Migrate contracts to ganache:
```
truffle migrate
```
![Contract Migration](images/ContractMigration.jpg)

To execute smart contract tests:
```
truffle test
```
All tests should pass:

![All Tests Passed](images/AllTestsPassed.jpg)

Launch application in development mode on http://localhost:3000:
```
npm start
```
## What does it do?
When the application is accessed it first checks that injected web3 is detected in the browser.  If not, "MetaMask is Not Enabled!" is displayed under ```Your Account Info```.  If MetaMask is enabled, but user is not logged into a MetaMask wallet, "MetaMask Account is Locked!" is displayed.

It also checks if the current user account is an application administrator.  If the current MetaMask wallet was generated using the mnemonic phrase from Ganache, then MetaMask Account 1 will have administrator access and can assign other adminstrators from the displayed ```System``` dropdown menu.  Currently, there are only two special privileges that an administrator has:
1. Assign or revoke administrator access for other users.
2. Freeze or Unfreeze the system.

A list of all active listings is displayed under the "All Listings" tab.  If there are no active listings, the application displays "No active listings...".

![Initial Load Page](images/InitialLoadPage.jpg)

To add a new listing, select ```My Listings``` and then ```Create Listing```. Provide listing ```Title```, ```Price```, ```Description```, and ```Photo```(optional).  Then click ```Create Listing```.

![Create Listing Modal](images/CreateListingModal.jpg)

If you selected a photo, you will have to wait a few seconds for it to be uploaded to IPFS before your transaction is available in MetaMask for confirmation.  A few seconds after you confirm the transaction, when the block for the transaction has been mined, the new listing will appear under both ```All Listings``` and ```My Listings``` tabs:

![Active Listing Page](images/ActiveListingPage.jpg)

The listing will show with status of "Selling" under the ```My Listings```.

*(If after confirming a transaction in MetaMask it fails with an "RPC Error...", in MetaMask go to "Settings" and click "Reset Account". MetaMask can get confused when running on a private network if you stop and restart Ganache.)*.

To view details of a listing, click on it's Title.  If you view the listing from the same account that created it, you will see a button to ```Cancel Listing```:

![Listing Details Modal as Seller](images/ListingDetailsModalAsSeller.jpg)

After clicking ```Cancel Listing```, when the transaction is complete, the transaction will display under ```My Listings``` only with Status of ```Cancelled```.

![Cancelled Listing Page](images/CancelledListingPage.jpg)

If you create and/or switch to "Account 2" in MetaMask and then reload the page, the page will update to reflect the new Account 2 address and balance. The ```System``` menu in the upper right will disappear since Account 2 is not an administrator. Now if you view details for a listing, you will see a button to "Buy" the listing:

![Listing Details Modal as Buyer](images/ListingDetailsModalAsBuyer.jpg)

If you click "Buy", MetaMask will display pending transaction for the price of the listing.  After transaction completion the listing will disapper from ```All Listings``` tab and your displayed balance will decrease by the price of the listing.  

If you switch back to Account 1 (and reload the page) and click ```My Listings```, the listing will display with Status of ```Sold```:

![Sold Listing Page](images/SoldListingPage.jpg)

An administrator can "Freeze" the system if needed to stop processing of all listing related transactions.  To freeze the system (while logged in as Account 1) select System > Freeze System.

![Freeze System Modal](images/FreezeSystemModal.jpg)

When the transaction is confirmed and completed, the system will be frozen.  If you now attempt to create, cancel or buy a listing, an alert will display and the transaction will be blocked:

![Buy Listing Blocked](images/BuyListingBlocked.jpg)

To unfreeze the system, select System > Unfreeze System. 

![Unfreeze System Modal](images/UnFreezeSystemModal.jpg)

It is also possible to add and remove users as administrators.  If a user attempts to remove the contract owner (Account 1 in this case) they will be blocked with a transaction revert exception.  The owner of the contract must always remain an administrator.

## Supporting Documents
* [Design Pattern Decisions](./design_pattern_decisions.md)
* [Avoiding Common Attacks](./avoiding_common_attacks.md)
* [Rinkeby Contract Addresses](./deployed_addresses.txt)