const express = require("express");
const {
  addStoreName,
  getCredentials,
  userLogIN,
  addStoreDomain,
  getStoreDetails,
  linkEmail,
  addCategory,
  getCategory,
  addBankDetails,
  addUPIDetails,
  getPaymentDetails,
  addAddress,
  getAddress,
  userRegister,
  addStoreTheme,
  addProduct,
  getItems,
} = require("../controller/upstart");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/UpStart/", (req, res) => {
  res.send("upstart");
});

router.post("/UpStart/register", userRegister);

router.post("/UpStart/login", userLogIN);

router.post("/UpStart/create-store-name", authenticateToken, addStoreName);

router.post("/UpStart/create-store-domain", authenticateToken, addStoreDomain);

router.get("/UpStart/store-details", authenticateToken, getStoreDetails);

router.post("/UpStart/link-email", authenticateToken, linkEmail);

router.post("/UpStart/store-category", authenticateToken, addCategory);

router.get("/UpStart/category-details", authenticateToken, getCategory);

router.post("/UpStart/bank-details", authenticateToken, addBankDetails);

router.post("/UpStart/upi-details", authenticateToken, addUPIDetails);

router.get("/UpStart/payment-details", authenticateToken, getPaymentDetails);

router.post("/UpStart/detail-address", authenticateToken, addAddress);

router.get("/UpStart/address", authenticateToken, getAddress);

router.get("/UpStart/user-details", authenticateToken, getCredentials);

router.post("/UpStart/store-theme", authenticateToken, addStoreTheme);

router.post("/UpStart/add-items", authenticateToken, addProduct);

router.get("/UpStart/get-items", authenticateToken, getItems );




exports.routes = router;
