import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(34, 54, 168, 0.15)',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '16px',
    padding: '32px 24px 24px 24px',
    boxShadow: '0 4px 32px #2236a822',
    border: '1px solid #e0e7ff',
    maxWidth: '480px',
    width: '90%',
    background: '#fff',
  },
};

const ModalDialog = ({ isOpen, onRequestClose, title, children }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
    contentLabel={title || 'Dialog'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 20, color: '#2236a8' }}>{title}</h2>
      <button
        onClick={onRequestClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: 22,
          color: '#2236a8',
          cursor: 'pointer',
          fontWeight: 700,
          lineHeight: 1,
        }}
        aria-label="Close dialog"
      >
        ×
      </button>
    </div>
    <div>{children}</div>
  </Modal>
);

export default ModalDialog; 