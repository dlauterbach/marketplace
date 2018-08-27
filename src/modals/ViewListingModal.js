import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

class ViewListingModal extends React.Component {

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal.show} toggle={this.props.toggleModal}>
          <ModalHeader toggle={this.props.toggleModal}>Listing Details</ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                Title:
              </Col>
              <Col>
                {this.props.modal.title}
              </Col>
            </Row>
            <Row>
              <Col>
                Price (ETH):
              </Col>
              <Col>
                {this.props.modal.price}
              </Col>
            </Row>
            <Row>
              <Col>
                Description:
              </Col>
              <Col>
                {this.props.modal.description}
              </Col>
            </Row>
            <Row>
              <Col>
                ID:
              </Col>
              <Col>
                {this.props.modal.id}
              </Col>
            </Row>
            <Row>
              <Col>
              {
                this.props.modal.imageUrl 
              ? 
                <img src={this.props.modal.imageUrl} width="100%" alt="ListingPhoto" align="center" />
              : 
                ''
              }
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" 
            listing-id={this.props.modal.id} 
            listing-price={this.props.modal.price} 
            onClick={this.props.modal.modalOnSubmitHandler}
            >{this.props.modal.isSeller ? "Cancel Listing" : "Buy"}</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleModal}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ViewListingModal;