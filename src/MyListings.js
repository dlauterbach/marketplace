import React from 'react'
import { Table, Card } from 'reactstrap';

const MyListings = (props) => {
  return (
      <Card>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
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
            No existing listings...
          </td>
        </tr>
        :
          Object.keys(props.listingsList).map(id =>
            <tr key={id}>
              <td>{id}</td>
              {
                props.listingsList[id].buyer === '0x0000000000000000000000000000000000000000'
                ?
                  <td><a href="#" listingid={props.listingsList[id].id} listing={props.listingsList[id]} onClick={props.onClickHandler}>{props.listingsList[id].title}</a></td>
                :
                  <td>{props.listingsList[id].title}</td>
              }
              <td>{props.listingsList[id].price} ETH</td>
              {
                props.listingsList[id].buyer === '0x0000000000000000000000000000000000000000'
                ?
                  <td>Selling</td>
                :
                  props.listingsList[id].buyer === props.listingsList[id].seller
                  ?
                  <td>Cancelled</td>
                  :
                  <td>Sold</td>
              }
            </tr>
          )
    }
        </tbody>
      </Table>
      </Card>
  )
}

export default MyListings;