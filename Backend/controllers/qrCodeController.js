// controllers/qrCodeController.js
const vCard = require("vcards-js");
const QRCode = require("../models/QRCode");
const VQRCode = require("../models/VQRCode");
const qr = require("qr-image");

exports.generateQRCode = async (req, res) => {
  try {
    const {
      userId,
      qrName,
      fullName,
      jobTitle,
      mobileNumber,
      emailAddress,
      address,
      website,
    } = req.body;
    const qrData = `${qrName}, ${fullName}, ${jobTitle}, ${mobileNumber}, ${emailAddress}, ${address}, ${website}`;
    // Generate QR code from vCard text
    const qrCodeImage = qr.imageSync(qrData, { type: "png" });

    const qrCode = new QRCode({
      userId, // Include userId in the QR code data
      qrName,
      fullName,
      jobTitle,
      mobileNumber,
      emailAddress,
      address,
      website,
      qrCodeData: qrCodeImage.toString("base64"),
    });
    await qrCode.save();
    res.status(201).json({ message: "QR code generated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.generateVQRCode = async (req, res) => {
  try {
    const {
      userId,
      qrName,
      fullName,
      jobTitle,
      mobileNumber,
      emailAddress,
      address,
      website,
    } = req.body;

    const vcard = new vCard();
    vcard.firstName = fullName;
    vcard.cellPhone = mobileNumber;
    vcard.title = jobTitle; // Set the job title separately to ensure it's not overridden
    vcard.email = emailAddress;
    vcard.homeAddress.street = address; // Set the street for the physical address
    vcard.url = website;

    // Generate vCard text
    const vcardText = vcard.getFormattedString();

    // Generate QR code from vCard text
    const qrCodeImage = qr.imageSync(vcardText, { type: "png" });

    const qrCode = new VQRCode({
      userId, // Include userId in the QR code data
      qrName,
      fullName,
      jobTitle,
      mobileNumber,
      emailAddress,
      address,
      website,
      qrCodeData: qrCodeImage.toString("base64"),
    });
    await qrCode.save();
    res.status(201).json({ message: "QR code generated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.getQRCodesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const vqrCodes = await VQRCode.find({ userId });
    const qrCodes = await QRCode.find({ userId });
    const response = vqrCodes.concat(qrCodes);
    res.status(200).json({ response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteQRCode = async (req, res) => {
  try {
    const qrId = req.params.qrId;
    // Use findByIdAndDelete to delete the QR code by ID
    const deletedQRCode = await QRCode.findByIdAndDelete(qrId);
    if (!deletedQRCode) {
      return res.status(404).json({ message: "QR code not found" });
    }
    res.status(200).json({ message: "QR code deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting QR code" });
  }
};

exports.deleteVQRCode = async (req, res) => {
  try {
    const qrId = req.params.qrId;
    // Use findByIdAndDelete to delete the QR code by ID
    const deletedQRCode = await VQRCode.findByIdAndDelete(qrId);
    if (!deletedQRCode) {
      return res.status(404).json({ message: "QR code not found" });
    }
    res.status(200).json({ message: "QR code deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting QR code" });
  }
};
exports.updateQRCode = async (req, res) => {
  try {
    const qrId = req.params.qrId;
    const updatedData = req.body; // Data to update the QR code
    const {
      userId,
      qrName,
      fullName,
      jobTitle,
      mobileNumber,
      emailAddress,
      address,
      website,
    } = req.body;
    const qrData = `${qrName}, ${fullName}, ${jobTitle}, ${mobileNumber}, ${emailAddress}, ${address}, ${website}`;
    // Generate QR code from vCard text
    const qrCodeImage = qr.imageSync(qrData, { type: "png" });

    // Find the existing QR code by ID and update it
    const updatedQRCode = await QRCode.findByIdAndUpdate(
      qrId,
      { $set: updatedData, qrCodeData: qrCodeImage.toString("base64") }, // Use $set to update specific fields
      { new: true } // Return the updated document
    );

    if (!updatedQRCode) {
      return res.status(404).json({ message: "QR code not found" });
    }

    res
      .status(200)
      .json({ message: "QR code updated successfully", updatedQRCode });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while updating QR code" });
  }
};

exports.updateVQRCode = async (req, res) => {
  try {
    const qrId = req.params.qrId;
    const updatedData = req.body; // Data to update the QR code
    const { fullName, jobTitle, mobileNumber, emailAddress, address, website } =
      req.body;

    const vcard = new vCard();
    vcard.firstName = fullName;
    vcard.cellPhone = mobileNumber;
    vcard.title = jobTitle; // Set the job title separately to ensure it's not overridden
    vcard.email = emailAddress;
    vcard.homeAddress.street = address; // Set the street for the physical address
    vcard.url = website;

    // Generate vCard text
    const vcardText = vcard.getFormattedString();

    // Generate QR code from vCard text
    const qrCodeImage = qr.imageSync(vcardText, { type: "png" });

    // Find the existing QR code by ID and update it
    const updatedQRCode = await VQRCode.findByIdAndUpdate(
      qrId,
      { $set: updatedData, qrCodeData: qrCodeImage.toString("base64") }, // Use $set to update specific fields
      { new: true } // Return the updated document
    );

    if (!updatedQRCode) {
      return res.status(404).json({ message: "QR code not found" });
    }

    res
      .status(200)
      .json({ message: "QR code updated successfully", updatedQRCode });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while updating QR code" });
  }
};

exports.getQRCodeById = async (req, res) => {
  try {
    const qrId = req.params.qrId;
    const qrCode = await QRCode.findById(qrId);
    if (!qrCode) {
      return res.status(404).json({ message: "QR code not found" });
    }
    res.status(200).json({ qrCode });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching QR code by ID" });
  }
};

exports.getVQRCodeById = async (req, res) => {
  try {
    const qrId = req.params.qrId;
    const qrCode = await VQRCode.findById(qrId);
    if (!qrCode) {
      return res.status(404).json({ message: "QR code not found" });
    }
    res.status(200).json({ qrCode });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching QR code by ID" });
  }
};

exports.getAllQRCodes = async (req, res) => {
  try { 
   
    const qrCodes = await QRCode.find();
    const vqrCodes = await VQRCode.find();

    // Combine the QR codes and VQR codes into a single response
    const allQRCodes = [...qrCodes, ...vqrCodes];

    res.status(200).json({ allQRCodes });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching all QR codes" });
  }
};
