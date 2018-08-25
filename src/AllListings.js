import React from 'react'
import { Button, Row, Col, Table, Card} from 'reactstrap';

const AllListings = (props) => {
  console.log("Listings - props.state.listingsLoading: "+props.state.listingsLoading)
  console.log("Listings - props.listingsList: "+props.listingsList)
  console.log("Listings - Object.keys(props.listingsList).length: "+Object.keys(props.listingsList).length)
  return (
      <Card>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
            {
    props.state.listingsLoading
    ?
      <tr>
        <td sm="12">
          Loading listings...
        </td>
      </tr>
    :
      Object.keys(props.listingsList).length === 0
      ?
      <tr>
        <td sm="12">
          No active listings...
        </td>
      </tr>
      :
        Object.keys(props.listingsList).map(id =>
          <tr key={id}>
            <td>{id}</td>
            <td><a href="#" listingid={props.listingsList[id].id} listing={props.listingsList[id]} onClick={props.onClickHandler}>{props.listingsList[id].title}</a></td>
            <td>{props.listingsList[id].price} ETH</td>
          </tr>
        )
    }
        </tbody>
      </Table>
      </Card>
  )
}

export default AllListings;