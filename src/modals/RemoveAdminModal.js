import React from 'react';
import {Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class RemoveAdminModal extends React.Component {

  render() {
    console.log("RemoveAdminModal - this.props.modal.show: "+this.props.modal.show)
    return (
      <div>
        <Modal isOpen={this.props.modal.show} toggle={this.props.toggleModal}>
          <ModalHeader toggle={this.props.toggleModal}>Remove existing Administrator</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="adminAddress">Address to remove:</Label>
                <Input type="text" name="adminAddress" id="adminAddress" onChange={this.props.inputChangeHandler}/>
              </FormGroup>
              </Form>
            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.modalOnSubmitHandler}>Remove Administrator</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default RemoveAdminModal;