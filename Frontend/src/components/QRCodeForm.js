//QRCodeForm.js
import React, { useState, useEffect } from "react";
import {
  generateQRCode,
  getUserdata,
  updateQRCode,
  fetchQRCodeById,
  generateVQRCode,
} from "../api"; // Import the updateQRCode API function
import { useNavigate } from "react-router-dom";
import "./QRCodeForm.css";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import PhoneIcon from "@mui/icons-material/Phone";
import { AddCard } from "@mui/icons-material";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const QRCodeForm = ({
  qrId,
  onClose,
  edit,
  qrData,
  qrType,
}) => {

  const [editData, setEditData] = useState({
    qrName: qrData?.qrName,
    fullName: qrData?.fullName,
    jobTitle: qrData?.jobTitle,
    mobileNumber: qrData?.mobileNumber,
    emailAddress: qrData?.emailAddress,
    address: qrData?.address,
    website: qrData?.website,
  });

  const [value, setValue] = React.useState(
    qrType === "VQRCode" ? 1 : 
    qrType === "QRCode" && editData?.emailAddress!=="" ? 0 :
    qrType === "QRCode" && editData?.website!=="" ? 2 :
    qrType === "QRCode" && editData?.address!=="" ? 3 :
    qrType === "QRCode" && editData?.jobTitle!=="" ? 4 :
    qrType === "QRCode" && editData?.mobileNumber!=="" ? 5:
    0
  );
  const handletabChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("qrg:access-token");
  const [userId, setUserId] = useState("");

  const [formData, setFormData] = useState({
    qrName: "",
    fullName: "",
    jobTitle: "",
    mobileNumber: "",
    emailAddress: "",
    address: "",
    website: "",
  });


  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [generatedQRCode, setGeneratedQRCode] = useState(null); // State variable for generated QR code


  // useEffect(() => {
  //   getUserdata().then((response) => {
  //     setUserId(response?.id);
  //   });
  // }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserdata(token);
      setUserId(response?.id);
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (qrId) {
      // Fetch existing QR code data if it's an update operation
      fetchQRCodeData(qrId);
    }
  }, [qrId]);

  const fetchQRCodeData = async (qrId, qrType) => {

    // Fetch QR code data based on ID and set the form data
    try {
      // Implement the fetchQRCodeById API function to get QR code data by ID
      const qrCodeData = await fetchQRCodeById(qrId, qrType);
      setFormData({ ...qrCodeData });
    } catch (error) {
      console.error("Error fetching QR code data:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!edit && !formData.qrName.trim()) {
      setError("QR code name is required");
      return;
    } else if (edit && !editData.qrName.trim()) {
      setError("QR code name is required");
      return;
    }

    try {
      const data = edit ? { ...editData, userId } : { ...formData, userId };
      let updatedQRCodeData;

      if (qrId) {
        // Update the existing QR code if qrId is present
        updatedQRCodeData = await updateQRCode(qrId, data, qrType);
        setSuccessMessage("QR code updated successfully");
      } else {
        // Generate a new QR code if qrId is not present
        updatedQRCodeData = await generateQRCode(data);
        setSuccessMessage("QR code generated successfully");
      }

      // Set the updated/generated QR code data
      setGeneratedQRCode(updatedQRCodeData);

      // Close the popup after 1 second for both update and generate operations
      setTimeout(() => {
        onClose();
        navigate(`/dashboard`);
      }, 1000);
    } catch (error) {
      console.error("Error updating/generating QR code:", error);
      setError("An error occurred while updating/generating QR code");
      return; // Exit the function early if there's an error
    }
  };

  const handleVSubmit = async (e) => {
    e.preventDefault();
    if (!edit && !formData.qrName.trim()) {
      setError("QR code name is required");
      return;
    } else if (edit && !editData.qrName.trim()) {
      setError("QR code name is required");
      return;
    }

    try {
      const data = edit ? { ...editData, userId } : { ...formData, userId };
      let updatedQRCodeData;
      if (qrId) {
        // Update the existing QR code if qrId is present
        updatedQRCodeData = await updateQRCode(qrId, data, qrType);
        setSuccessMessage("QR code updated successfully");
      } else {
        // Generate a new QR code if qrId is not present
        updatedQRCodeData = await generateVQRCode(data);
        setSuccessMessage("QR code generated successfully");
      }
      setGeneratedQRCode(updatedQRCodeData); // Set the updated/generated QR code data

      // Close the popup after 1 second for both update and generate operations
      setTimeout(() => {
        onClose();
        navigate(`/dashboard`);
      }, 1000);
    } catch (error) {
      console.error("Error updating/generating QR code:", error);
      setError("An error occurred while updating/generating QR code");
      return; // Exit the function early if there's an error
    }
  };

  return (
    <div className="qrcode-form-container">
      <h2 className="form-title">QR Code Form</h2>
      <h4 className="sub-heading">Not all fields are necessary!</h4>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handletabChange}>
          {edit ? (
            <Tab
              icon={<EmailIcon />}
              iconPosition="top"
              label="email"
              disabled={qrType==="VQRCode" || editData?.emailAddress===""}
              {...a11yProps(0)}
            />
          ) : (
            <Tab
              icon={<EmailIcon />}
              iconPosition="top"
              label="email"
              {...a11yProps(0)}
            />
          )}
          {edit ? (
            <Tab
              icon={<AddCard />}
              iconPosition="top"
              label="v card"
              disabled={qrType!=="VQRCode"}
              {...a11yProps(1)}
            />
          ) : (
            <Tab
              icon={<AddCard />}
              iconPosition="top"
              label="v card"
              {...a11yProps(1)}
            />
          )}

          {edit ? (
            <Tab
              icon={<LinkIcon />}
              iconPosition="top"
              label="Url"
              disabled={qrType==="VQRCode" || editData?.website===""}
              {...a11yProps(2)}
            />
          ) : (
            <Tab
              icon={<LinkIcon />}
              iconPosition="top"
              label="Url"
              {...a11yProps(2)}
            />
          )}

          {edit ? (
            <Tab
              icon={<HomeIcon />}
              iconPosition="top"
              label="Address"
              disabled={qrType==="VQRCode" || editData?.address===""}

              {...a11yProps(3)}
            />
          ) : (
            <Tab
              icon={<HomeIcon />}
              iconPosition="top"
              label="Address"
              {...a11yProps(3)}
            />
          )}

          { edit ?
          (
          <Tab
            icon={<WorkIcon />}
            iconPosition="top"
            label="Job"
            disabled={qrType==="VQRCode" || editData?.jobTitle===""}

            {...a11yProps(4)}
          />
          ): 
          (
            <Tab
            icon={<WorkIcon />}
            iconPosition="top"
            label="Job"
            {...a11yProps(4)}
          />
          )
}
          { edit?
          (
          <Tab
            icon={<PhoneIcon />}
            iconPosition="top"
            label="Phone"
            disabled={qrType==="VQRCode" || editData?.mobileNumber===""}
            {...a11yProps(5)}
          />
          ):
        (
          <Tab
          icon={<PhoneIcon />}
          iconPosition="top"
          label="Phone"
          {...a11yProps(5)}
        />
        )
          }
        </Tabs>
          
      </Box>

      <CustomTabPanel value={value} index={0}>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>QR Code Name*</label>
            {edit ? (
              <input
                type="text"
                name="qrName"
                value={editData.qrName}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="qrName"
                value={formData.qrName}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Email Address:</label>
            {edit ? (
              <input
                type="text"
                name="emailAddress"
                value={editData.emailAddress}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
              />
            )}
          </div>
          <button className="generate-btn" type="submit">
            {qrId ? "Update QR Code" : "Generate QR Code"}
          </button>
        </form>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <form className="form" onSubmit={handleVSubmit}>
          <div className="form-group">
            <label>QR Code Name*</label>
            {edit ? (
              <input
                type="text"
                name="qrName"
                value={editData.qrName}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="qrName"
                value={formData.qrName}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Full Name:</label>
            {edit ? (
              <input
                type="text"
                name="fullName"
                value={editData.fullName}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Job:</label>
            {edit ? (
              <input
                type="text"
                name="jobTitle"
                value={editData.jobTitle}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Mobile Number:</label>
            {edit ? (
              <input
                type="text"
                name="mobileNumber"
                value={editData.mobileNumber}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Email Address:</label>
            {edit ? (
              <input
                type="text"
                name="emailAddress"
                value={editData.emailAddress}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Address:</label>
            {edit ? (
              <input
                type="text"
                name="address"
                value={editData.address}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Url:</label>
            {edit ? (
              <input
                type="text"
                name="website"
                value={editData.website}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            )}
          </div>
          <button className="generate-btn" type="submit">
            {qrId ? "Update QR Code" : "Generate QR Code"}
          </button>
        </form>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>QR Code Name*</label>
            {edit ? (
              <input
                type="text"
                name="qrName"
                value={editData.qrName}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="qrName"
                value={formData.qrName}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Url:</label>
            {edit ? (
              <input
                type="text"
                name="website"
                value={editData.website}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            )}
          </div>
          <button className="generate-btn" type="submit">
            {qrId ? "Update QR Code" : "Generate QR Code"}
          </button>
        </form>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>QR Code Name*</label>
            {edit ? (
              <input
                type="text"
                name="qrName"
                value={editData.qrName}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="qrName"
                value={formData.qrName}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Address:</label>
            {edit ? (
              <input
                type="text"
                name="address"
                value={editData.address}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            )}
          </div>
          <button className="generate-btn" type="submit">
            {qrId ? "Update QR Code" : "Generate QR Code"}
          </button>
        </form>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>QR Code Name*</label>
            {edit ? (
              <input
                type="text"
                name="qrName"
                value={editData.qrName}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="qrName"
                value={formData.qrName}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Job:</label>
            {edit ? (
              <input
                type="text"
                name="jobTitle"
                value={editData.jobTitle}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            )}
          </div>
          <button className="generate-btn" type="submit">
            {qrId ? "Update QR Code" : "Generate QR Code"}
          </button>
        </form>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={5}>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>QR Code Name*</label>
            {edit ? (
              <input
                type="text"
                name="qrName"
                value={editData.qrName}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="qrName"
                value={formData.qrName}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form-group">
            <label>Mobile Number:</label>
            {edit ? (
              <input
                type="text"
                name="mobileNumber"
                value={editData.mobileNumber}
                onChange={handleEditChange}
              />
            ) : (
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            )}
          </div>
          <button className="generate-btn" type="submit">
            {qrId ? "Update QR Code" : "Generate QR Code"}
          </button>
        </form>
      </CustomTabPanel>
    </div>
  );
};

export default QRCodeForm;
