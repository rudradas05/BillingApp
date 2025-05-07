import validator from "validator";
import transporter from "../config/nodemailer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import productModel from "../models/productModels.js";
import billModel from "../models/billModel.js";
import puppeteer from "puppeteer";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Das Jewellery Box & Bag MFG.",
      text: `Welcome to Das Jewellery Box & Bag MFG., ${name}. Your account has been created with email id: ${email}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (user.isAccoutverified) {
      return res.json({ success: false, message: "Account already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyotp = otp;
    user.verifyotpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your account",
      text: `Verify your account. Your verification code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });
    res.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.verifyotpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code expired" });
    }

    if (user.verifyotp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }

    user.isAccoutverified = true;
    user.verifyotp = "";
    user.verifyotpExpireAt = 0;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Enter a valid email" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetotp = otp;
    user.resetOtpExpireAt = Date.now() + 300000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        return res.json({
          success: true,
          message: "Password reset OTP sent successfully",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }
    if (user.resetotp === "" || user.resetotp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetotp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const addItems = async (req, res) => {
  try {
    const { userId, name, price, quantity, category, subCategory } = req.body;

    if (!name || !price || !category === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const itemsData = { userId, name, price, quantity, category, subCategory };

    const newItem = new productModel(itemsData);
    await newItem.save();

    res.status(201).json({ success: true, message: "Item added successfully" });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllItems = async (req, res) => {
  try {
    const { userId } = req.body;
    const items = await productModel.find({ userId });
    res.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeItems = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "itemId is required" });
    }
    const item = await productModel.findByIdAndDelete(itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, message: "Item removed successfully" });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const newBill = async (req, res) => {
  try {
    const { name, address, items, total, userId } = req.body;

    if (!name || !items || items.length === 0 || !total) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    for (let item of items) {
      if (!item.name || !item.quantity || !item.rate || !item.amount) {
        return res.status(400).json({
          success: false,
          message: "Each item must have name, quantity, rate, and amount",
        });
      }
    }

    const billData = {
      userId,
      name,
      address: address || "",
      items,
      total,
      date: Date.now(),
    };

    const newBill = new billModel(billData);
    await newBill.save();

    res.json({
      success: true,
      message: "Bill added successfully",
      billId: newBill._id,
    });
  } catch (error) {
    console.error("Error adding bill:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBill = async (req, res) => {
  try {
    const { userId } = req.body;
    const bills = await billModel.find({ userId });
    res.json({ success: true, bills });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// const generateBillPDF = async (req, res) => {
//   const { billId } = req.params;

//   try {
//     const billData = await billModel.findById(billId);

//     if (!billData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Bill not found" });
//     }

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();

//     const billHTML = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; }
//           .header { text-align: center; margin-bottom: 20px; }
//           .header h1 { font-size: 24px; margin: 0; }
//           .header p { margin: 0; font-size: 14px; color: gray; }
//           .details { margin-bottom: 20px; }
//           .details p { margin: 5px 0; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//           th { background-color: #f4f4f4; }
//           .total { text-align: right; margin-top: 20px; font-size: 18px; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>Das Jewellery Box & Bag Supply</h1>
//           <p>Prop. Mantu Das</p>
//           <p>Khalore, Bagnan, Howrah</p>
//         </div>
//         <div class="details">
//           <p><strong>Customer Name:</strong> ${billData.name}</p>
//           <p><strong>Address:</strong> ${billData.address || "N/A"}</p>
//           <p><strong>Date:</strong> ${new Date(
//             billData.date
//           ).toLocaleDateString()}</p>
//         </div>
//         <table>
//           <thead>
//             <tr>
//               <th>Item No.</th>
//               <th>Description</th>
//               <th>Quantity</th>
//               <th>Rate</th>
//               <th>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${billData.items
//               .map(
//                 (item, index) => `
//               <tr>
//                 <td>${index + 1}</td>
//                 <td>${item.name}</td>
//                 <td>${item.quantity}</td>
//                 <td>${item.rate}</td>
//                 <td>${item.amount}</td>
//               </tr>
//             `
//               )
//               .join("")}
//           </tbody>
//         </table>
//         <div class="total">
//           <p><strong>Total:</strong> ${billData.total}</p>
//         </div>
//       </body>
//       </html>
//     `;

//     await page.setContent(billHTML, { waitUntil: "domcontentloaded" });

//     const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename=bill_${billId}.pdf`,
//     });
//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     res.status(500).json({ success: false, message: "Error generating PDF" });
//   }
// };

const generateBillPDF = async (req, res) => {
  const { billId } = req.params;

  try {
    const billData = await billModel.findById(billId);

    if (!billData) {
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });
    }

    const browser = await puppeteer.launch({
      headless: "new", // Fix Puppeteer issue
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const billHTML = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { font-size: 24px; margin: 0; }
          .header p { margin: 0; font-size: 14px; color: gray; }
          .details { margin-bottom: 20px; }
          .details p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          .total { text-align: right; margin-top: 20px; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Das Jewellery Box & Bag Supply</h1>
          <p>Prop. Mantu Das</p>
          <p>Khalore, Bagnan, Howrah</p>
        </div>
        <div class="details">
          <p><strong>Customer Name:</strong> ${billData.name}</p>
          <p><strong>Address:</strong> ${billData.address || "N/A"}</p>
          <p><strong>Date:</strong> ${new Date(
            billData.date
          ).toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item No.</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${billData.items
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.rate.toFixed(2)}</td>
                <td>${item.amount.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="total">
          <p><strong>Total:</strong> ${billData.total.toFixed(2)}</p>
        </div>
      </body>
      </html>`;

    await page.setContent(billHTML, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      path: null, // Ensure correct buffer generation
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bill_${billId}.pdf"`,
      "Content-Length": pdfBuffer.length, // Ensure correct file size
    });

    res.status(200).end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ success: false, message: "Error generating PDF" });
  }
};

export {
  registerUser,
  loginUser,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  getUserData,
  addItems,
  getAllItems,
  removeItems,
  newBill,
  getAllBill,
  generateBillPDF,
};
