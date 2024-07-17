const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    qrType: { type: String,
        default: 'VQRCode' },
    userId: String,
    qrName: String,
    fullName: String,
    jobTitle: String,
    mobileNumber: String,
    emailAddress: String,
    address: String,
    website: String,
    qrCodeData: String 
});

module.exports = mongoose.model('VQRCode', qrCodeSchema);
