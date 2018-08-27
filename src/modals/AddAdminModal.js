import React from 'react';
import {Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class AddAdminModal extends React.Component {

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal.show} toggle={this.props.toggleModal}>
          <ModalHeader toggle={this.props.toggleModal}>Add new Administrator</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="adminAddress">Address to add:</Label>
                <Input type="text" name="adminAddress" id="adminAddress" onChange={this.props.inputChangeHandler}/>
              </FormGroup>
              </Form>
            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.modalOnSubmitHandler}>Add Administrator</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default AddAdminModal;