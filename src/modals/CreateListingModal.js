import React from 'react';
import { Form, FormGroup, FormText, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

class CreateListingModal extends React.Component {

  render() {
    console.log("CreateListingModal - this.props.modal.show: "+this.props.modal.show)
    return (
      <div>
        <Modal isOpen={this.props.modal.show} toggle={this.props.toggleModal}>
          <ModalHeader toggle={this.props.toggleModal}>List Your Item For Sale</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="itemTitle">Title</Label>
                <Input type="text" name="itemTitle" id="itemTitle" onChange={this.props.inputChangeHandler} placeholder="Cowboy Hat"/>
              </FormGroup>
              <FormGroup>
                <Label for="itemPrice">Price (ETH)</Label>
                <Input type="text" name="itemPrice" id="itemPrice" onChange={this.props.inputChangeHandler} placeholder=".1"/>
              </FormGroup>
              <FormGroup>
                <Label for="itemDescription">Description</Label>
                <Input type="textarea" name="itemDescription" id="itemDescription" onChange={this.props.inputChangeHandler} placeholder="Nice cowboy hat."/>
              </FormGroup>
              <FormGroup>
                <Label for="itemPhoto">Photo</Label>
                <Input type="file" name="itemPhoto" id="itemPhoto" disabled/>
                <FormText color="muted">
                  Include a photograph of your item.
                </FormText>
                </FormGroup>
                <FormGroup>
                  <Label for="sellerEmail">Email</Label>
                  <Input type="email" name="sellerEmail" id="sellerEmail" placeholder="John.Doe@gmail.com" onChange={this.props.inputChangeHandler} disabled/>
                </FormGroup>
              </Form>
            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.modalOnSubmitHandler}>Create Listing</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CreateListingModal;