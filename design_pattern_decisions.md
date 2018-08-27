# Design Pattern Decisions

## Fail Early and Fail Loud
All contract functions are decorated with modifiers that will revert with  exception prior to execution if any requirements for executing the function are not satisfied.

## Adminstrator Access
Implemented a mapping ```admins``` to provide administrator access to specific user addresses.  The mapping key is a user address and the value for each key is a boolean, set to either "true" or "false".  This allowed me to limit access to certain "adminstrator only" functions with the modifier ```onlyAdmin```.

## Events
Events are emitted for significant contract state changes that are useful for updating the DApp.  This allows the DApp to efficiently access contract state changes (like when a listing is created, bought or cancelled) from the EVM transaction log.  This eliminates the concern with exceeding block gas limit that would exist if we attempted to retrieve this potentially large amount of data directly from the contract using function calls.

## Circuit Breaker
Administrators are allowed to "Freeze" or "Unfreeze" the system by making calls to the ```lock``` and ```unlock``` functions.  When ```lock``` is called it sets the contract state variable ```locked``` to true.  Modifier ```isLocked``` decorates all listing related functions to prevent any listing related transactions from executing while ```locked``` is true.

## Contract Upgradability
Following the approach proposed by [Elena Dimitrova](https://blog.colony.io/@elena_di) in [this](https://blog.colony.io/writing-upgradeable-contracts-in-solidity-6743f0eecc88) Medium blog post, I implemented library ```ListingsLibrary``` to store all listing details in a separate storage contract ```EternalStorage```  This is intended to allow the contract that contains the business logic (```MarketPlace```) to be upgraded while still retaining the stored listing data in ```EternalStorage```  As described by [Chandan Gupta](https://medium.com/@nrchandan) in [this](https://medium.com/@nrchandan/interfaces-make-your-solidity-contracts-upgradeable-74cd1646a717) blog post, full upgradability requires further abstraction of the business logic contract from the storage contract.  Chandan proposes using a Parent contract and an Interface between the Parent contract and the business logic contract. Following this approach the ```MarketPlace``` contract would not need to import the ```EternalStorage``` contract and functions for creating and upgrading MarketPlace contract would reside in the Parent contract.  I ran out of time to implement this approach.  Also, for full upgradability, the functions that maintain the ```admins``` mapping should be modified to use ```EternalStorage``` using a separate library. 

## Ownable
Implemented an ```Ownable``` contract which is inherited by ```MarketPlace``` and ```EternalStorage```. ```Ownable``` sets ```owner``` to the caller (```msg.sender```) when these contracts are deployed. It provides an ```onlyOwner``` modifier that is used to decorate functions in ```EternalStorage``` contract so that only the deployed instance of the ```MarketPlace``` contract can write to ```EternalStorage```.  It also provides a ```transferOwnership``` function which will be useful when full contract upgradability is implemented.

## IPFS Hash Storage
This DApp stores IPFS hashes as type ```string``` in the contract.  This results in a substantial increase in the gas required to create a listing.  A more efficient method of storing an IPFS hash is presented [here](https://github.com/saurfang/ipfs-multihash-on-solidity).  Due to time constraints this approach was not implemented.