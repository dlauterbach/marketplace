var MarketPlace = artifacts.require('MarketPlace')

contract('MarketPlace', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    var id
    const title = "Cowboy Hat"
    const description = "Nice cowboy hat."
    const price = web3.toWei(.01, "ether")

    it("Test creation of new listing.", async() => {
        const marketPlace = await MarketPlace.deployed()

        var eventEmitted = false
        var event = marketPlace.createListingEvent()
        await event.watch((err, res) => {
            id = res.args.listingId
            eventEmitted = true
        })

        await marketPlace.createListing(title, description, price, {from: alice})
        const result = await marketPlace.getListing.call(id)

        assert.equal(result[0], title, 'The title of created listing does not match the expected value.')
        assert.equal(result[1], description, 'The description of created listing does not match the expected value.')
        assert.equal(result[2].toString(10), price, 'The price of created listing does not match the expected value.')
        assert.equal(result[3], alice, 'The seller address of created listing does not match expected value.')
        assert.equal(result[4], emptyAddress, 'The buyer address of created listing does not match expected value.')
        assert.equal(eventEmitted, true, 'Creating a new listing should emit a Create Listing event')
    })

    it("Test purchase of a listing.", async() => {
        const marketPlace = await MarketPlace.deployed()

        var eventEmitted = false
        var event = marketPlace.buyListingEvent()
        await event.watch((err, res) => {
            id = res.args.listingId
            eventEmitted = true
        })

        const amount = web3.toWei(.01, "ether")

        var aliceBalanceBefore = await web3.eth.getBalance(alice).toNumber()
        var bobBalanceBefore = await web3.eth.getBalance(bob).toNumber()
        await marketPlace.buyListing(id, {from: bob, value: amount})
        var aliceBalanceAfter = await web3.eth.getBalance(alice).toNumber()
        var bobBalanceAfter = await web3.eth.getBalance(bob).toNumber()

        const result = await marketPlace.getListing.call(id)

        assert.equal(result[4], bob, 'The buyer address should be set to bob listing purchased.')
        assert.equal(aliceBalanceAfter, aliceBalanceBefore + parseInt(price, 10), "Alice's balance should be increased by the price of the purchased listing.")
        assert.isBelow(bobBalanceAfter, bobBalanceBefore - price, "Bob's balance should be reduced by more than the price of the purchased listing (including gas costs).")
        assert.equal(eventEmitted, true, 'Purchase of a listing should emit a buy listing event.')
    })

    it("Test cancellation of a listing.", async() => {
        const marketPlace = await MarketPlace.deployed()

        var createEvent = marketPlace.createListingEvent()
        await createEvent.watch((err, res) => {
            id = res.args.listingId
        })

        await marketPlace.createListing(title, description, price, {from: alice})
        await marketPlace.getListing.call(id)

        var eventEmitted = false
        var event = marketPlace.cancelListingEvent()
        await event.watch((err, res) => {
            id = res.args.listingId
            eventEmitted = true
        })

        await marketPlace.cancelListing(id, {from: alice})
        const result = await marketPlace.getListing.call(id)

        assert.equal(result[4], alice, 'The buyer address should match seller address.')
        assert.equal(eventEmitted, true, 'Cancellation of a listing should emit a cancel listing event.')
    })

    it("Test not allowed to create listing with invalid inputs.", async() => {
        const marketPlace = await MarketPlace.deployed()

        try {
          await marketPlace.createListing("", description, price, {from: alice})
          assert.fail("Attempting to create listing with zero length title should throw an error.");
        }
        catch (err) {
          assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
        try {
          await marketPlace.createListing(title, "", price, {from: alice})
          assert.fail("Attempting to create listing with zero length description should throw an error.");
        }
        catch (err) {
          assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
        try {
          await marketPlace.createListing(title, description, 0, {from: alice})
          assert.fail("Attempting to create listing with price of 0 should throw an error.");
        }
        catch (err) {
          assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
    })

    it("Test adding new administrtor.", async() => {
        const marketPlace = await MarketPlace.deployed()

        var user
        var eventEmitted = false
        var event = marketPlace.addAdminEvent()
        await event.watch((err, res) => {
            user = res.args.user
            eventEmitted = true
        })

        await marketPlace.addAdmin(alice, {from: owner})
        const result = await marketPlace.isAdmin.call(alice)

        assert.equal(result, true, 'Adding a new admin was unsucessful.')
        assert.equal(eventEmitted, true, 'Adding a new admin should emit a addAmdinEvent.')
        assert.equal(user, alice, 'User listed in addAdminEvent does not match last added admin.')
    })

    it("Test removing existing administrator.", async() => {
        const marketPlace = await MarketPlace.deployed()

        var user
        var eventEmitted = false
        var event = marketPlace.removeAdminEvent()
        await event.watch((err, res) => {
            user = res.args.user
            eventEmitted = true
        })

        await marketPlace.removeAdmin(alice, {from: owner})
        const result = await marketPlace.isAdmin.call(alice)

        assert.equal(result, false, 'Removing an admin was unsucessful.')
        assert.equal(eventEmitted, true, 'Removing an admin should emit a removeAdminEvent.')
        assert.equal(user, alice, 'User listed in removeAdminEvent does not match last added admin.')
    })

    it("Test not allowed to remove owner as administrator.", async() => {
        const marketPlace = await MarketPlace.deployed()

        await marketPlace.addAdmin(owner, {from: owner})

        try {
          await marketPlace.removeAdmin(owner, {from: owner})
          assert.fail("Removing owner as admin should throw an error.");
        }
        catch (err) {
          assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
    });

    it("Test that regular user cannot add new administrator.", async() => {
        const marketPlace = await MarketPlace.deployed()

        try {
          await marketPlace.addAdmin(bob, {from: bob})
          assert.fail("Attempting to add an administrator as regular user should throw an error.");
        }
        catch (err) {
          assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
    })

    it("Test freezing and unfreezing system as owner.", async() => {
        const marketPlace = await MarketPlace.deployed()

        await marketPlace.lock({from: owner})
        const isFrozen = await marketPlace.isFrozen.call()

        assert.equal(isFrozen, true, 'System is not frozen.')

        await marketPlace.unlock({from: owner})
        const isNotFrozen = await marketPlace.isFrozen.call()

        assert.equal(isNotFrozen, false, 'System is frozen.')
    })

    it("Test freezing and unfreezing system as admin user.", async() => {
        const marketPlace = await MarketPlace.deployed()
        await marketPlace.addAdmin(alice, {from: owner})

        await marketPlace.lock({from: alice})
        const isFrozen = await marketPlace.isFrozen.call()

        assert.equal(isFrozen, true, 'System is not frozen.')
        await marketPlace.unlock({from: alice})
        const isNotFrozen = await marketPlace.isFrozen.call()

        assert.equal(isNotFrozen, false, 'System is frozen.')
        await marketPlace.removeAdmin(alice, {from: owner})
    })

    it("Test that regular user cannot freeze the system.", async() => {
        const marketPlace = await MarketPlace.deployed()

        try {
          await marketPlace.lock({from: alice})
          assert.fail("Attempting to freeze system as non-owner should throw an error.");
        }
        catch (err) {
          assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
    })

    it("Test not allowed to create listing while system is frozen.", async() => {
        const marketPlace = await MarketPlace.deployed()

        await marketPlace.lock({from: owner})
        await marketPlace.isFrozen.call()

        try {
          await marketPlace.createListing(title, description, price, {from: alice})
          assert.fail("Attempting to create a listing while the system is frozen should throw an error.");
        }
        catch (err) {
          assert.include(err.message, "revert", "The error message should contain 'revert'");
        }

        await marketPlace.unlock({from: owner})
        await marketPlace.isFrozen.call()
    })
});