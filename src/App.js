import React, { Component } from 'react'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, TabContent, TabPane, NavItem, NavLink, Card, CardHeader, CardBody, Button } from 'reactstrap';
import classnames from 'classnames';
import MarketPlaceContract from './contracts/MarketPlace.json'
import getWeb3 from './utils/getWeb3'
import AllListings from './AllListings'
import MyListings from './MyListings'
import ViewListingModal from './modals/ViewListingModal';
import CreateListingModal from './modals/CreateListingModal';
import AddAdminModal from './modals/AddAdminModal';
import RemoveAdminModal from './modals/RemoveAdminModal';
import FreezeSystemModal from './modals/FreezeSystemModal';
import UnFreezeSystemModal from './modals/UnFreezeSystemModal';
import ipfs from './Ipfs'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      marketPlaceContract: null,
      account: null,
      accountBalance: 0,
      activeTab: 'all-listings',
      itemTitle: "",
      itemPrice: 0,
      itemDescription: "",
      itemPhoto: "",
      sellerEmail: "",
      listings: {},
      listingsMine: {},
      listingsLoading: true,
      createListingModal: {
        show: false
      },
      viewListingModal: {
        show: false
      },
      addAdminModal: {
        show: false
      },
      removeAdminModal: {
        show: false
      },
      freezeSystemModal: {
        show: false
      },
      unFreezeSystemModal: {
        show: false
      },
      isAdmin: false,
      collapsed: true,
      isFrozen: true,
      photoFileBuffer: null,
      photoIPFSHash: null
    }
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  toggleCreateListingModal = () => {
    this.setState({
      createListingModal: {show: !this.state.createListingModal.show}
    })
  }

  toggleViewListingModal = () => {
    this.setState({
      viewListingModal: {show: !this.state.viewListingModal.show}
    })
  }

  toggleAddAdminModal = () => {
    this.setState({
      addAdminModal: {show: !this.state.addAdminModal.show}
    })
  }

  toggleRemoveAdminModal = () => {
    this.setState({
      removeAdminModal: {show: !this.state.removeAdminModal.show}
    })
  }

  toggleFreezeSystemModal = () => {
    this.setState({
      freezeSystemModal: {show: !this.state.freezeSystemModal.show}
    })
  }

  toggleUnFreezeSystemModal = () => {
    this.setState({
      unFreezeSystemModal: {show: !this.state.unFreezeSystemModal.show}
    })
  }

  handleViewListingModal = e => {
    e.preventDefault();
    const id = e.target.getAttribute('listingid');
    console.log("handleViewListingModal - id: "+id)
    this.setState({ viewListingModal: { show: true, id } }, () => {
      console.log("handleViewListingModal - this.state.viewListingModal: "+this.state.viewListingModal)
      Promise.resolve(this.getListing(id)).then(listing => {
        const isSeller = listing.seller === this.state.account ? true : false
        console.log("handleViewListingModal - isSeller: "+isSeller)
        let onSubmitHandler = isSeller ? this.handleCancelListing : this.handleBuyListing
        console.log("handleViewListingModal - listing.photoIPFSHash: "+listing.photoIPFSHash)
        if (listing.photoIPFSHash != null && listing.photoIPFSHash != "") {
          ipfs.cat(listing.photoIPFSHash, (err, photoData)=> {
            if (!err) {
              var blob = new Blob([photoData], {type:"image/jpg"})
              this.setState({ viewListingModal: { show: true, isSeller: isSeller, imageUrl: window.URL.createObjectURL(blob), modalOnSubmitHandler: onSubmitHandler, error: false, ...listing } })
            }
          })
        } else {
          this.setState({ viewListingModal: { show: true, isSeller: isSeller, modalOnSubmitHandler: onSubmitHandler, error: false, ...listing } })
        }
      }).catch(error => {
        this.setState({ viewListingModal: { show: true, error: true } })
      })
    })
  }

  handleCreateListing = e => {
    e.preventDefault()
    const title = this.state.itemTitle
    console.log("handleCreateListing - title: "+title)
    const price = this.state.itemPrice
    console.log("handleCreateListing - price: "+price)
    const description = this.state.itemDescription
    console.log("handleCreateListing - description: "+description)
    const email = this.state.sellerEmail
    //console.log("handleCreateListing - email: "+email)
    this.toggleCreateListingModal()
    console.log("handleCreateListing - this.state.photoFileBuffer: "+this.state.photoFileBuffer)
    if (this.state.photoFileBuffer != null && this.state.photoFileBuffer != "") {
      ipfs.add(this.state.photoFileBuffer).then((ipfsHash) => {
        console.log("handleCreateListing - ipfsHash[0].hash: "+ipfsHash[0].hash)
        return this.state.marketPlaceContract.createListing(
          title, 
          description, 
          this.state.web3.toWei(price), 
          ipfsHash[0].hash,
          {from: this.state.account})
      }).then((result) => {
        console.log("handleCreateListing - Listing created")
      }).catch((err) => {
        console.log("handleCreateListing - Error occurred")
        console.error(err)
      })
    } else {
      this.state.marketPlaceContract.createListing(
        title, 
        description, 
        this.state.web3.toWei(price), 
        "",
        {from: this.state.account})
      .then((result) => {
        console.log("handleCreateListing - Listing created")
      }).catch((err) => {
        console.log("handleCreateListing - Error occurred")
        console.error(err)
      })
    }
  }

  handleBuyListing = e => {
    e.preventDefault()
    const id = e.target.getAttribute('listing-id')
    console.log("handleBuyListing - id: "+id)
    const price = e.target.getAttribute('listing-price')
    console.log("handleBuyListing - price: "+price)
    this.toggleViewListingModal()
    this.state.marketPlaceContract.buyListing(id, {
      from: this.state.account, 
      value: this.state.web3.toWei(price)
    })
    .then((result) => {
      console.log("handleBuyListing - Listing created")
    }).catch((err) => {
      console.log("handleBuyListing - Error occurred")
      console.error(err);
    })
  }

  handleCancelListing = e => {
    e.preventDefault()
    const id = e.target.getAttribute('listing-id')
    console.log("handleCancelListing - id: "+id)
    this.toggleViewListingModal()
    this.state.marketPlaceContract.cancelListing(id, {from: this.state.account})
    .then((result) => {
      console.log("handleCancelListing - Listing cancelled")
    }).catch((err) => {
      console.log("handleCancelListing - Error occurred")
      console.error(err);
    })
  }

  handleAddAdmin = e => {
    e.preventDefault()
    const newAdminAddress = this.state.adminAddress
    this.toggleAddAdminModal()
    console.log("handleAddAdmin - newAdminAddress: "+newAdminAddress)
    this.state.marketPlaceContract.addAdmin(newAdminAddress,{from: this.state.account}).then((result) => {
      console.log("handleAddAdmin - Admin added.")
    }).catch((err) => {
      console.log("handleAddAdmin - Error occurred.")
      console.error(err)
    })
  }

  handleRemoveAdmin = e => {
    e.preventDefault()
    const removeAdminAddress = this.state.adminAddress
    this.toggleRemoveAdminModal()
    console.log("handleRemoveAdmin - removeAdminAddress: "+removeAdminAddress)
    this.state.marketPlaceContract.removeAdmin(removeAdminAddress,{from: this.state.account, gas: 65000}).then((result) => {
      console.log("handleRemoveAdmin - Admin removed.")
    }).catch((err) => {
      console.log("handleRemoveAdmin - Error occurred.")
      console.error(err)
    })
  }

  handleFreezeSystem = e => {
    e.preventDefault()
    this.toggleFreezeSystemModal()
    console.log("handleFreezeSystem - Entering.")
    this.state.marketPlaceContract.lock({from: this.state.account}).then((result) => {
      this.setState({
        isFrozen: true
      })
      console.log("handleFreezeSystem - System frozen.")
    }).catch((err) => {
      console.log("handleFreezeSystem - Error occurred.")
      console.error(err)
    })
  }

  handleUnFreezeSystem = e => {
    e.preventDefault()
    this.toggleUnFreezeSystemModal()
    console.log("handleUnFreezeSystem - Entering.")
    this.state.marketPlaceContract.unlock({from: this.state.account}).then((result) => {
      this.setState({
        isFrozen: false
      })
      console.log("handleUnFreezeSystem - System unfrozen.")
    }).catch((err) => {
      console.log("handleUnFreezeSystem - Error occurred.")
      console.error(err)
    })
  }

  componentDidMount() {
    // Get network provider and web3 instance.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      console.log("componentDidMount - Returned from getWeb3 - results: "+results)
      return this.instantiateContracts()
    }).then(results2 => {
      console.log("componentDidMount - Returned from instantiateContract - results2: "+results2)
      return this.updateState()
    }).catch((err) => {
      console.log("Error 1 occurred: "+err.message)
    })
  }

  updateState = () => {
    console.log("updateState - Entering")
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getAccounts((error, accounts) => {
        console.log("updateState - error: "+error)
        console.log("updateState - accounts[0]: "+accounts[0])
        if (accounts[0] !== undefined) {
          if (!error) {
            this.state.web3.eth.getBalance(accounts[0],(error,accountBalance) => {
              if (!error) {
                // For web3 v1.0.0
                //accountBalance = this.state.web3.utils.fromWei(accountBalance,"ether")
                // For web3 v0.x.0
                accountBalance = this.state.web3.fromWei(accountBalance,"ether")
                console.log("updateState - accountBalance: "+accountBalance)
                this.setState({accountBalance: accountBalance})
                if (this.state.account == null || accounts[0] !== this.state.account) {
                  console.log("updateState - this.state.activeTab: "+this.state.activeTab)
                  this.setState({account: accounts[0], activeTab: 'all-listings'})
                }
                console.log("updateState - call setIsAdmin")
                this.setIsAdmin()
                console.log("updateState - call getListingsFromChain")
                return this.getListingsFromChain()
              } else {
                reject(error)
              }
            })
          } else {
            reject(error)
          }
        }
        resolve()
      })
    })
  }

  instantiateContracts = () => {
    return new Promise((resolve, reject) => {
      const contract = require('truffle-contract')
        const marketPlace = contract(MarketPlaceContract)
        marketPlace.setProvider(this.state.web3.currentProvider)
        marketPlace.deployed().then((marketPlaceInstance) => {
          console.log("instantiateContract - marketPlaceInstance.address: "+marketPlaceInstance.address)
          return this.setState({ marketPlaceContract: marketPlaceInstance })
        }).then((result) => {
          console.log("instantiateContract - call setIsFrozen: "+result)
          return this.setIsFrozen()
        }).then((result) => {
          console.log("instantiateContract - call getListingsFromChain: "+result)
          return this.getListingsFromChain()
        }).then((result) => {
          console.log("instantiateContract - call listenForEvents: "+result)
          return this.listenForEvents()
        //}).then((result) => {
          //console.log("instantiateContract - call updateStateInterval: "+result)
          // Update app state every 10 seconds.  This is only necessary to check for 
          // user account change. The event listeners will detect and trigger app
          // state update for contract state changes.
          //return setInterval(this.updateState, 10000);
        }).then((result) => {
          console.log("instantiateContract - Checking for state updates every 10 seconds "+result)
          resolve()
        })
      })
  }

  listenForEvents = () => {
    return new Promise((resolve, reject) => {
      console.log("listenForEvents - Listening for events")

      // Listen for create event
      var createEvent = this.state.marketPlaceContract.createListingEvent()
      createEvent.watch((err, res) => {
        if (!err) {
          var listingId = res.args.listingId
          console.log("listenForEvents - createListingEvent emitted.")
          console.log("listenForEvents - listingId: "+listingId)
          return this.updateState()
        }
      })

      // Listen for buy event
      var buyEvent = this.state.marketPlaceContract.buyListingEvent()
      buyEvent.watch((err, res) => {
        if (!err) {
          var listingId = res.args.listingId
          console.log("listenForEvents - buyListingEvent emitted.")
          console.log("listenForEvents - listingId: "+listingId)
          return this.updateState()
        }
      })

      // Listen for cancel event
      var cancelEvent = this.state.marketPlaceContract.cancelListingEvent()
      cancelEvent.watch((err, res) => {
        if (!err) {
          var listingId = res.args.listingId
          console.log("listenForEvents - cancelListingEvent emitted.")
          console.log("listenForEvents - listingId: "+listingId)
          return this.updateState()
        }
      })

      resolve()
    })
  }

  getListingsFromChain = () => {
    const promises = []
    const promisesLogs = []
    promisesLogs.push(
      new Promise((resolve, reject) => {
        this.state.marketPlaceContract.createListingEvent({},{fromBlock: 0, toBlock: 'latest'}).get((e, r) => {
          if (!e) {
            console.log("getListingsFromChain - r.length: "+r.length)
            for (let i = 0; i < r.length; i++) {
              console.log("getListingsFromChain - parseInt(r[i].args.listingId,10): "+parseInt(r[i].args.listingId,10))
              promises.push(this.getListing(parseInt(r[i].args.listingId,10)))
            }
            resolve()
          } else {
            reject(e)
          }
        })
      })
    )
    Promise.all(promisesLogs).then(r => {
      Promise.all(promises).then(listings => {
        const listingsForSale = {};
        const listingsMine = {};
        for (let i = 0; i < listings.length; i++) {
          if (listings[i].buyer === '0x0000000000000000000000000000000000000000') {
            listingsForSale[listings[i].id] = listings[i]
            console.log("getListingsFromChain - listingsForSale[listings[i].id]: "+listingsForSale[listings[i].id])
          }
          console.log("getListingsFromChain - listings[i].seller: "+listings[i].seller)
          if (listings[i].seller === this.state.account) {
            listingsMine[listings[i].id] = listings[i]
            console.log("getListingsFromChain - listingsMine[listings[i].id]: "+listingsMine[listings[i].id])
          }
        }
        this.setState({ 
          listings: listingsForSale,
          listingsMine: listingsMine,
          listingsLoading: false
        })
      })
    })
  }

  getListing = id => {
    return new Promise((resolve, reject) => {
      console.log("getListing - id: "+id)
      this.state.marketPlaceContract.getListing(id)
      .then((listingData) => {
          console.log("getListing - listingData: "+listingData)
          let listing = {
            id: id,
            title: listingData[0],
            description: listingData[1],
            price: parseFloat(this.state.web3.fromWei(parseInt(listingData[2],10),"ether")).toFixed(3),
            photoIPFSHash: listingData[3],
            seller: listingData[4],
            buyer: listingData[5]
          }
          resolve(listing);
        })
    })
  }

  setIsAdmin = () => {
    console.log("setIsAdmin - Entering")
    return new Promise((resolve, reject) => {
      console.log("setIsAdmin - this.state.account: "+this.state.account)
      this.state.marketPlaceContract.isAdmin(this.state.account)
      .then((isAdmin) => {
        console.log("setIsAdmin - isAdmin: "+isAdmin)
        this.setState({isAdmin: isAdmin})
        resolve(isAdmin);
      })
    })
  }

  setIsFrozen = () => {
    console.log("setIsFrozen - Entering")
    return new Promise((resolve, reject) => {
      this.state.marketPlaceContract.isFrozen()
      .then((isFrozen) => {
        console.log("setIsFrozen - isFrozen: "+isFrozen)
        this.setState({isFrozen: isFrozen})
        resolve(isFrozen);
      })
    })
  }

  readUploadedFileAsArrayBuffer = (inputFile) => {
    console.log("readUploadedFileAsArrayBuffer - inputFile: "+inputFile)
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsArrayBuffer(inputFile);
    });
  };

  handleInputChange = async (e) => {
    const target = e.target;
    var value = target.type === 'checkbox' ? target.checked : target.value;
    if (target.files) {
      const file = target.files[0];
      console.log("handleInputChange - file: "+file)
      try {
        const photoFileBuffer = await this.readUploadedFileAsArrayBuffer(file);
        console.log("handleInputChange - photoFileBuffer: "+photoFileBuffer)
        this.setState({
          photoFileBuffer: Buffer.from(photoFileBuffer)
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      const name = target.name;
      this.setState({
        [name]: value
      });
    }
  }

  render() {
    console.log("web3: "+this.state.web3)
    console.log("account: "+this.state.account)
    const headerStyle = {
      fontSize: 'xx-large'
    }
    return (
      <div className="App">
        <div className="container">
          <p/>
          <Card body>
            <Navbar color="light" light expand="md">
              <NavbarBrand href="/" style={headerStyle}>Market Place</NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} />
              {
                this.state.isAdmin
              ?
                <Collapse isOpen={!this.state.collapsed} navbar>
                  <Nav className="ml-auto" navbar>
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        System
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem onClick={this.toggleAddAdminModal}>
                          Add Administrator
                          <AddAdminModal modal={this.state.addAdminModal} toggleModal={this.toggleAddAdminModal} modalOnSubmitHandler={this.handleAddAdmin} inputChangeHandler={this.handleInputChange}/>
                        </DropdownItem>
                        <DropdownItem onClick={this.toggleRemoveAdminModal}>
                          Remove Administrator
                          <RemoveAdminModal modal={this.state.removeAdminModal} toggleModal={this.toggleRemoveAdminModal} modalOnSubmitHandler={this.handleRemoveAdmin} inputChangeHandler={this.handleInputChange}/>
                        </DropdownItem>
                        <DropdownItem divider />
                        {
                          !this.state.isFrozen
                        ?
                          <DropdownItem onClick={this.toggleFreezeSystemModal}>
                            Freeze System
                            <FreezeSystemModal modal={this.state.freezeSystemModal} toggleModal={this.toggleFreezeSystemModal} modalOnSubmitHandler={this.handleFreezeSystem} inputChangeHandler={this.handleInputChange}/>
                          </DropdownItem>
                        :
                          <DropdownItem onClick={this.toggleUnFreezeSystemModal}>
                            Unfreeze System
                            <UnFreezeSystemModal modal={this.state.unFreezeSystemModal} toggleModal={this.toggleUnFreezeSystemModal} modalOnSubmitHandler={this.handleUnFreezeSystem} inputChangeHandler={this.handleInputChange}/>
                          </DropdownItem>
                        }
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Nav>
                </Collapse>
              : 
                ' '
              }
            </Navbar>
            <p/>
            <Card>
              <CardHeader>
                Your Account Info
              </CardHeader>
              {
                this.state.web3 !== null
              ?
                this.state.account
                ?
                  <CardBody>
                    <strong>Address:</strong> {this.state.account}
                    <br/>
                    <strong>Balance:</strong> {parseFloat(this.state.accountBalance.toString()).toFixed(3)} ETH
                  </CardBody>
                :
                  <CardBody>
                    <span style={{ 'color': 'red' }}>
                      MetaMask Account is Locked!
                    </span>
                  </CardBody>
              :
                <CardBody>
                  <span style={{ 'color': 'red' }}>
                    MetaMask is Not Enabled!
                  </span>
                </CardBody>
              }
            </Card>
            <p/>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === 'all-listings' })}
                  onClick={() => { this.toggleTab('all-listings'); }}
                >
                  All Listings
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === 'my-listings' })}
                  onClick={() => { this.toggleTab('my-listings'); }}
                >
                  My Listings
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="all-listings">
                <br/>
                <AllListings state={this.state} listingsList={this.state.listings} onClickHandler={this.handleViewListingModal}/>
              </TabPane>
              <TabPane tabId="my-listings">
                <br/>
                <MyListings state={this.state} listingsList={this.state.listingsMine} onClickHandler={this.handleViewListingModal}/>
                <br/>
                <Button color="primary" onClick={this.toggleCreateListingModal}>Create Listing</Button>
                <CreateListingModal modal={this.state.createListingModal} toggleModal={this.toggleCreateListingModal} modalOnSubmitHandler={this.handleCreateListing} inputChangeHandler={this.handleInputChange}/>
              </TabPane>
            </TabContent>
          </Card>
          <AddAdminModal modal={this.state.addAdminModal} toggleModal={this.toggleAddAdminModal} modalOnSubmitHandler={this.handleAddAdmin} inputChangeHandler={this.handleInputChange}/>
          <RemoveAdminModal modal={this.state.removeAdminModal} toggleModal={this.toggleRemoveAdminModal} modalOnSubmitHandler={this.handleRemoveAdmin} inputChangeHandler={this.handleInputChange}/>
          <FreezeSystemModal modal={this.state.freezeSystemModal} toggleModal={this.toggleFreezeSystemModal} modalOnSubmitHandler={this.handleFreezeSystem} inputChangeHandler={this.handleInputChange}/>
          <UnFreezeSystemModal modal={this.state.unFreezeSystemModal} toggleModal={this.toggleUnFreezeSystemModal} modalOnSubmitHandler={this.handleUnFreezeSystem} inputChangeHandler={this.handleInputChange}/>
          <ViewListingModal modal={this.state.viewListingModal} toggleModal={this.toggleViewListingModal}/>
        </div>
      </div>
    );
  }
}

export default App