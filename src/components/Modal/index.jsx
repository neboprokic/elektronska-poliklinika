import React, { useContext } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { AppStateContext } from 'context';
import { closeModal } from 'redux/actions';

const BootstrapModal = () => {
  const [state, dispatch] = useContext(AppStateContext);
  const { isModalOpen, modal = {} } = state;
  const { header, body } = modal;

  const handleClose = () => closeModal(dispatch);

  return (
    <Modal isOpen={isModalOpen} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>{header}</ModalHeader>
      <ModalBody>{body}</ModalBody>
    </Modal>
  );
};

export default BootstrapModal;
