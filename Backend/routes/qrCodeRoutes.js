// routes/qrCodeRoutes.js
const express = require("express");
const pako = require("pako");
const router = express.Router();
const qrCodeController = require("../controllers/qrCodeController");

const jwt = require("jsonwebtoken");
require("dotenv").config();

verifyUserToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).send("Access Denied / Unauthorized request");

  try {
    token = token.split(" ")[1]; // Remove Bearer from string

    if (token === "null" || !token)
      return res.status(401).send("Unauthorized request");

    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET); // config.TOKEN_SECRET => 'secretKey'
    // console.log(verifiedUser);
    if (!verifiedUser.scopes.includes("qrg"))
      return res.status(401).send("token is not intended for this app");

    req.user = verifiedUser; // user_id & user_type_id
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

const GzDecompress = (encoded) => {
  const encodedData = encoded;
  const compressedData = Buffer.from(encodedData, "base64");

  // Decompress the data
  const decompressedData = pako.inflate(compressedData, { to: "string" });

  return JSON.parse(decompressedData);
};

IsAdmin = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).send("Access Denied / Unauthorized request");

  try {
    token = token.split(" ")[1]; // Remove Bearer from string

    if (token === "null" || !token)
      return res.status(401).send("Unauthorized request");

    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET); // config.TOKEN_SECRET => 'secretKey'
    const role = GzDecompress(verifiedUser.roles);
    if (role.includes("ad") || role.includes("sa")) {
        next(); // Grant access
      } else {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

router.post("/generate", verifyUserToken, qrCodeController.generateQRCode);
router.post("/generatev", verifyUserToken, qrCodeController.generateVQRCode);
router.get("/get/:userId", qrCodeController.getQRCodesByUser);
router.delete("/delete/:qrId", qrCodeController.deleteQRCode);
router.delete("/deletev/:qrId", qrCodeController.deleteVQRCode);
router.put("/update/:qrId", qrCodeController.updateQRCode);
router.put("/updatev/:qrId", qrCodeController.updateVQRCode);
router.get("/getById/:qrId", qrCodeController.getQRCodeById); // Add this route for fetching QR code by
router.get("/getByVId/:qrId", qrCodeController.getVQRCodeById); // Add this route for fetching QR code by ID
router.get("/getAllQrs", IsAdmin, qrCodeController.getAllQRCodes); // Add this route for fetching QR code by ID

module.exports = router;
