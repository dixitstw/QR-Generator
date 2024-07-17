//QRCodePopUpUpdate.js
import React from 'react';
import QRCodeForm from './QRCodeForm'; // Import the QRCodeForm component
import './QRCodePopup.css';

const QRCodePopupUpdate = ({ qrId, onClose, updateQRCodes, qrData, qrType }) => {
  const handleClose = () => {
    // Call the onClose function to handle any additional actions
    onClose();
    updateQRCodes()
  };

  return (
    <div className={`popup-container ${qrId ? 'show' : 'hide'}`}>
      <div className="popup-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2 className="popup-title">Update QR Code</h2>
        <QRCodeForm qrId={qrId} onClose={handleClose} edit={true} qrData={qrData}  qrType={qrType}/>
      </div>
    </div>
  );
};

export default QRCodePopupUpdate;