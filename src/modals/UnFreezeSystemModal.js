import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class UnFreezeSystemModal extends React.Component {

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal.show} toggle={this.props.toggleModal}>
          <ModalHeader toggle={this.props.toggleModal}>Unfreeze the System</ModalHeader>
          <ModalBody>
            Are you sure you want to resume listing transactions?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.modalOnSubmitHandler}>Unfreeze System</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleModal}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default UnFreezeSystemModal;