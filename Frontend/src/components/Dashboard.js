//Dashboard.js
import React, { useState, useEffect } from 'react';
import { getQRCodes, getUserdata, deleteQRCode, getAllQRCodes} from '../api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './Dashboard.css';
import QRCodePopup from './ QRCodePopup ';
import QRCodePopupUpdate from './QRCodePopupUpdate'; // Import the new popup component
import './QRCodePopup.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LogoutIcon from '@mui/icons-material/Logout';
const Dashboard = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State for showing/hiding the popup
  const [showUpdatePopup, setShowUpdatePopup] = useState(false); // State for update popup
  const [updateQRId, setUpdateQRId] = useState(null); // State to store QR ID for update
const [updateQrType, setUpdateQrType]=useState(null);

const [role,setRole]=useState();

  const token = localStorage.getItem('qrg:access-token');

  const handleLogout = () => {
    localStorage.removeItem('qrg:access-token');
    localStorage.removeItem('qrg:refresh-token');
    window.location.href = '/';
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserdata(token);
      setUserId(response?.id);
      console.log(response)
      setRole(response?.roles[0]?.name);
    };
  
    fetchData();
  }, [token]);  

  useEffect(() => {
    const fetchQRcodes = async () => {
      try {
        const data = role === 'cus' ? await getQRCodes(userId): role==='ad'? await getAllQRCodes(token): role==='sa'? await getAllQRCodes(token):[];
        console.log('Fetched QR codes:', data); // Check if data is received
        setQrCodes(data);
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching QR codes');
      }
    };

    fetchQRcodes();
  }, [userId, token, role]);

   // Handle opening the popup
   const openPopup = () => {
    setShowPopup(true);
  };

  // Handle closing the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  const handleDeleteQRCode = async (qrId, qrType) => {
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      try {
        await deleteQRCode(qrId, qrType);
        // Refetch QR codes after deletion
        const updatedQRCodes = qrCodes.filter((qrCode) => qrCode._id !== qrId);
        setQrCodes(updatedQRCodes);
      } catch (error) {
        console.error(error);
        setError('An error occurred while deleting QR code');
      }
    }
  };

const [qrDataToUpdate, setQrDataToUpdate]=useState()

const handleUpdateQRCode = (qrId, qrType, qrData) => {
  setQrDataToUpdate(qrData);
  setUpdateQRId(qrId); // Set the QR ID to be updated
  setShowUpdatePopup(true); // Show the update popup
  setUpdateQrType(qrType);
};



const  updateQRCodes = async () => { // Added updateQRCodes function
  try {
    const data = role === 'cus' ? await getQRCodes(userId): role==='ad'? await getAllQRCodes(token):[];
    setQrCodes(data);
  } catch (error) {
    console.error(error);
    setError('An error occurred while updating QR codes');
  }
};

  return (
    <div className="dashboard-container">
      {/* <div className="dashboard-header">
        <h1 className="dashboard-title">QR Generator</h1>
        <h2 className="dashboard-subtitle">Welcome to the Dashboard!</h2>
      </div> */}
 <Box sx={{ flexGrow: 1, width: "100%"}}>
      <AppBar position="static" sx={{ height: '80px'}}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" display= 'flex' gap='5px' alignItems = 'center' component="div" sx={{ flexGrow: 1,fontSize: '2rem' }} >
          <QrCodeIcon  sx ={{height: '35px'}}/>
          QR Generator
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ fontSize: '1rem', fontFamily: 'Arial', ml: 2, textTransform: 'none'}}
          >
            Logout
            <LogoutIcon sx={{ ml: 1 }} />
          </Button>
        </Toolbar>
      </AppBar>
    </Box>


      {error && <p>{error}</p>}
      <div className="dashboard-grid">
        <div className="dashboard-left">
          <h3 className="my-qr-heading">My QR Codes</h3>
          {qrCodes.length > 0 ? (
            qrCodes.map((qrCode) => (
              <div key={qrCode._id} className="dashboard-item">
                <img src={`data:image/png;base64,${qrCode.qrCodeData}`} alt="QR Code" />
                <div className="dashboard-item-content">
                  <h4>{qrCode.qrName}</h4>
                  <p>{qrCode.fullName}</p>
                  <i className="dashboard-delete-btn" onClick={() => handleDeleteQRCode(qrCode._id, qrCode.qrType)}><DeleteIcon/></i>
                  <i className="dashboard-update-btn" onClick={() => handleUpdateQRCode(qrCode._id, qrCode.qrType, qrCode)}><EditIcon/></i>
                </div>
              </div>
            ))
          ) : (
            <p className = "no-qr">No QR codes generated yet.</p>
          )}
        </div>
        <div className="dashboard-right">
          <div className="dashboard-actions">
            <h3>Create a new QR code!</h3>
            <button className="create-qr-btn" onClick={openPopup}>Create QR Code</button>
            <br/>
            <img src="/qrimage.jpg" alt="" className="qr-image" />
            <br/>
          </div>
        </div>
      </div>
      {/* Popup component */}
      {showPopup && <QRCodePopup onClose={closePopup} updateQRCodes={updateQRCodes} />}
       {/* Update Popup */}
      {showUpdatePopup && (
        <QRCodePopupUpdate
          qrId={updateQRId}
          updateQRCodes={updateQRCodes}
          onClose={() => setShowUpdatePopup(false)}
          qrData={qrDataToUpdate}
          qrType={updateQrType}
        />
      )}

      
    </div>
  );
};

export default Dashboard;