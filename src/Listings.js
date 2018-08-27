import React from 'react'
import { Button, Row, Col, Table, Card} from 'reactstrap';

const Listings = (props) => {
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
        Object.keys(props.listingsList).map(key =>
          <tr key={key}>
            <td>{key}</td>
            <td><a href="#action" listingid={props.listingsList[key].id} listing={props.listingsList[key]} onClick={props.onClickHandler}>{props.listingsList[key].title}</a></td>
            <td>{props.listingsList[key].price} ETH</td>
          </tr>
        )
    }
        </tbody>
      </Table>
      </Card>
  )
}

export default Listings;