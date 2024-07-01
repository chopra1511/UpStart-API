require("dotenv").config();

const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Credentials = require("../models/credentials");
const StoreName = require("../models/storeName");
const StoreDomain = require("../models/storeDomain");
const Email = require("../models/email");
const Category = require("../models/category");
const Bank = require("../models/bank");
const UPI = require("../models/upi");
const Address = require("../models/address");
const Store = require("../models/store");
const StoreTheme = require("../models/storeTheme");
const Products = require("../models/products");

const secret = process.env.JWT_SECRET;

exports.userRegister = async (req, res) => {
  const { name, userName, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Credentials.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new Credentials({
      name,
      userName,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, secret);

    // Respond with the token
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.userLogIN = async (req, res) => {
  const { userName, password } = req.body;
  const user = await Credentials.findOne({ userName });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, secret);
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

exports.addStoreName = async (req, res) => {
  const { name } = req.body;
  const userID = req.user.userId;
  const user = await Credentials.findById(userID);

  if (user.store.length > 0) {
    // If a store exists, delete the existing store document
    await Store.findByIdAndDelete(user.store[0]);
    // Remove the reference from the user's store array
    user.store.pop();
  }

  const store_name = new StoreName({
    storeName: name,
    userID: userID,
  });
  await store_name.save();

  const storeDoc = new Store({
    userID: userID,
    storeName: store_name._id, // Reference the newly created store name
  });
  await storeDoc.save();

  user.store.push(storeDoc);
  await user.save();

  res.status(201).json({ message: "Store name created", store_name });
};

exports.addStoreDomain = async (req, res) => {
  const { name } = req.body;
  const userID = req.user.userId;

  try {
    // Find the store associated with the user
    const store = await Store.findOne({ userID: userID });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if the store already has a store domain
    if (store.storeDomain.length > 0) {
      // If a store domain exists, delete the existing store domain document
      await StoreDomain.findByIdAndDelete(store.storeDomain[0]);
      store.storeDomain.pop();
    }

    // Create a new store domain document
    const store_Domain = new StoreDomain({
      storeDomain: name,
      userID: userID,
    });

    await store_Domain.save();

    store.storeDomain.push(store_Domain);
    await store.save();

    res
      .status(201)
      .json({ message: "Store Domain created", storeDomain: store_Domain });
  } catch (error) {
    console.error("Error adding store domain:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStoreDetails = async (req, res) => {
  const userID = req.user.userId;
  try {
    const store = await Store.findOne({ userID: userID })
      .populate("storeName")
      .populate("storeDomain");
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const storeDetails = {
      storeName: store.storeName ? store.storeName[0].storeName : null,
      storeDomain: store.storeDomain ? store.storeDomain[0].storeDomain : null,
    };

    res.json(storeDetails);
  } catch (error) {
    console.error("Error fetching store details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.linkEmail = async (req, res) => {
  const { emailID } = req.body;
  const userID = req.user.userId;
  const user = await Credentials.findById(userID);
  if (user.email) {
    await Email.findByIdAndDelete(user.email);
    user.email.pop();
  }

  const link_email = new Email({
    email: emailID,
    userID: userID,
  });
  await link_email.save();
  user.email.push(link_email);
  await user.save();

  res.status(201).json({ message: "Email Linked", link_email });
};

exports.addCategory = async (req, res) => {
  const { name } = req.body;
  const userID = req.user.userId;

  try {
    // Find the store associated with the user
    const store = await Store.findOne({ userID: userID });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (store.category.length > 0) {
      await Category.findByIdAndDelete(store.category[0]);
      store.category.pop();
    }

    const store_category = new Category({
      userID: userID,
      category: name,
    });

    await store_category.save();

    store.category.push(store_category);
    await store.save();

    res
      .status(201)
      .json({ message: "Store Category created", category: store_category });
  } catch (error) {
    console.error("Error adding store category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCategory = async (req, res) => {
  const userID = req.user.userId;
  try {
    const store = await Store.findOne({ userID: userID }).populate("category");
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const categoryDetails = store.category ? store.category[0].category : null;

    res.json(categoryDetails);
  } catch (error) {
    console.error("Error fetching category details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addBankDetails = async (req, res) => {
  const { accHolderName, accountNumber, confirmAccountNumber, ifscCode } =
    req.body;
  const userID = req.user.userId;

  try {
    // Find the store associated with the user
    const store = await Store.findOne({ userID: userID });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (store.bankDetails.length > 0) {
      await Bank.findByIdAndDelete(store.bankDetails[0]);
      store.bankDetails.pop();
    }

    const bank_details = new Bank({
      userID: userID,
      accountName: accHolderName,
      accountNumber: accountNumber,
      confirmAccountNumber: confirmAccountNumber,
      ifscCode: ifscCode,
    });

    await bank_details.save();

    store.bankDetails.push(bank_details);
    await store.save();

    res
      .status(201)
      .json({ message: "Payment via Bank", bankDetails: bank_details });
  } catch (error) {
    console.error("Error adding Bank Details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addUPIDetails = async (req, res) => {
  const { accHolderName, upiID } = req.body;
  const userID = req.user.userId;

  try {
    // Find the store associated with the user
    const store = await Store.findOne({ userID: userID });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (store.upiDetails.length > 0) {
      await UPI.findByIdAndDelete(store.upiDetails[0]);
      store.upiDetails.pop();
    }

    const upi_Details = new UPI({
      userID: userID,
      accountName: accHolderName,
      upiID: upiID,
    });

    await upi_Details.save();

    store.upiDetails.push(upi_Details);
    await store.save();

    res
      .status(201)
      .json({ message: "Payment via UPI", upiDetails: upi_Details });
  } catch (error) {
    console.error("Error adding UPI Details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPaymentDetails = async (req, res) => {
  const userID = req.user.userId;
  try {
    const store = await Store.findOne({ userID: userID })
      .populate("bankDetails")
      .populate("upiDetails");

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const paymentDetails = {};

    if (store.bankDetails && store.bankDetails.length > 0) {
      paymentDetails.bank = {
        accNum: store.bankDetails[0].accountNumber,
        message: "Payment via Bank",
      };
    }

    if (store.upiDetails && store.upiDetails.length > 0) {
      paymentDetails.upi = {
        upiId: store.upiDetails[0].upiID,
        message: "Payment via UPI",
      };
    }

    if (!paymentDetails.bank && !paymentDetails.upi) {
      return res.status(404).json({ message: "No payment details found" });
    }

    res.json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addAddress = async (req, res) => {
  const { address, landmark, city, state, pincode, name } = req.body;
  const userID = req.user.userId;

  try {
    // Find the store associated with the user
    const store = await Store.findOne({ userID: userID });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (store.address.length > 0) {
      await Address.findByIdAndDelete(store.address[0]);
      store.address.pop();
    }

    const store_address = new Address({
      userID: userID,
      completeAddress: address,
      landmark: landmark,
      city: city,
      state: state,
      pincode: pincode,
      addressName: name,
    });

    await store_address.save();

    store.address.push(store_address);
    await store.save();

    res
      .status(201)
      .json({ message: "Store Address created", Address: store_address });
  } catch (error) {
    console.error("Error adding store Address:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAddress = async (req, res) => {
  const userID = req.user.userId;
  try {
    const store = await Store.findOne({ userID: userID }).populate("address");
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const addressDetails = {
      name: store.address ? store.address[0].addressName : null,
      address: store.address ? store.address[0].completeAddress : null,
    };

    res.json(addressDetails);
  } catch (error) {
    console.error("Error fetching category details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCredentials = async (req, res) => {
  const userID = req.user.userId;
  try {
    const user = await Credentials.findById(userID)
      .populate("store")
      .populate("email");
    const store = await Store.findOne({ userID: userID })
      .populate("storeName")
      .populate("storeDomain")
      .populate("category")
      .populate("bankDetails")
      .populate("upiDetails")
      .populate("address")
      .populate("storeTheme")
      .populate("products");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    console.log("From getCredentials: ", user);

    const userDetails = {
      name: user.name || null,
      userName: user.userName || null,
      storeName:
        store.storeName && store.storeName.length > 0
          ? store.storeName[0].storeName
          : null,
      storeDomain:
        store.storeDomain && store.storeDomain.length > 0
          ? store.storeDomain[0].storeDomain
          : null,
      email: user.email && user.email.length > 0 ? user.email[0].email : null,
      category:
        store.category && store.category.length > 0
          ? store.category[0].category
          : null,
      bankDetails:
        store.bankDetails && store.bankDetails.length > 0
          ? {
              accNum: store.bankDetails[0].accountNumber,
              message: "Payment via Bank",
            }
          : null,
      upiDetails:
        store.upiDetails && store.upiDetails.length > 0
          ? {
              upiId: store.upiDetails[0].upiID,
              message: "Payment via UPI",
            }
          : null,
      address:
        store.address && store.address.length > 0
          ? {
              name: store.address[0].addressName,
              address: store.address[0].completeAddress,
              city: store.address[0].city, // Corrected potential typo
              state: store.address[0].state,
            }
          : {},
      storeTheme:
        store.storeTheme && store.storeTheme.length > 0
          ? store.storeTheme[0].storeTheme
          : null
    };

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addStoreTheme = async (req, res) => {
  const { color } = req.body;
  const userID = req.user.userId;

  try {
    // Find the store associated with the user
    const store = await Store.findOne({ userID: userID });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (store.storeTheme && store.storeTheme.length > 0) {
      await StoreTheme.findByIdAndDelete(store.storeTheme[0]);
      store.storeTheme.pop();
    }

    const store_Theme = new StoreTheme({
      userID: userID,
      storeTheme: color,
    });

    await store_Theme.save();

    store.storeTheme.push(store_Theme._id);
    await store.save();

    res
      .status(201)
      .json({ message: "Store Theme created", storeTheme: store_Theme });
  } catch (error) {
    console.error("Error adding store theme:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, price, discount, skuID, description, weight, image } =
    req.body;
  const userID = req.user.userId;

  try {
    // Find the store associated with the user
    const store = await Store.findOne({ userID: userID });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const newProduct = new Products({
      userID,
      images: image.map((url) => ({ url })),
      name,
      price,
      discount,
      skuID,
      description,
      weight,
      available:true
    });

    await newProduct.save();

    store.products.push(newProduct);
    await store.save();

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getItems = async (req, res) => {
  const userID = req.user.userId;
  try {
    const store = await Store.findOne({ userID: userID }).populate("products");
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const itemDetails = store.products.map((product) => ({
      name: product.name,
      price: product.price,
      discount: product.discount,
      skuID: product.skuID,
      description: product.description,
      weight: product.weight,
      images: product.images,
      available: product.available
    }));

    res.json(itemDetails);
    console.log(itemDetails);
  } catch (error) {
    console.error("Error fetching item details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
