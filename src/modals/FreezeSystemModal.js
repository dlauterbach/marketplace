import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class FreezeSystemModal extends React.Component {

  render() {
    console.log("FreezeSystemModal - this.props.modal.show: "+this.props.modal.show)
    return (
      <div>
        <Modal isOpen={this.props.modal.show} toggle={this.props.toggleModal}>
          <ModalHeader toggle={this.props.toggleModal}>Freeze the System</ModalHeader>
          <ModalBody>
            Are you sure you want to freeze all listing transactions?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.modalOnSubmitHandler}>Freeze System</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleModal}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default FreezeSystemModal;