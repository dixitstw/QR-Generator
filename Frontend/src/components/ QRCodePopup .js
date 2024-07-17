// QRCodePopup.js
import React, { useState } from 'react';
import QRCodeForm from './QRCodeForm';
import './QRCodePopup.css';

const QRCodePopup = ({ onClose, updateQRCodes }) => {
  const [showPopup, setShowPopup] = useState(true);

  const closeModal = () => {
    setShowPopup(false);
    onClose(); // Optional: Callback to handle closing the popup in the parent component
    updateQRCodes()
  };

  return (
    <div className={`popup-container ${showPopup ? 'show' : 'hide'}`}>
      <div className="popup-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <QRCodeForm />
      </div>
    </div>
  );
};

export default QRCodePopup;
