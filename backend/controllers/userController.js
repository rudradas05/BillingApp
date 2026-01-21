import validator from "validator";
import { resend } from "../config/resend.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import productModel from "../models/productModels.js";
import billModel from "../models/billModel.js";
import puppeteer from "puppeteer";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, companyName, address } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password });
      return res
        .status(400)
        .json({ success: false, message: "Name, email, and password are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      console.log("Invalid email format:", email);
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Validate password length
    if (password.length < 8) {
      console.log("Password too short:", password.length);
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || "",
      companyName: companyName || "",
      address: address || "",
    };

    // Save user
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send welcome email
    try {
      await resend.emails.send({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Das Jewellery Box & Bag MFG.",
        html: `<p>Welcome to Invoice Master Pro, ${name}. Your account has been created with email id: ${email}</p>`,
      });
    } catch (emailError) {
      console.log("Email sending failed (non-critical):", emailError.message);
      // Continue even if email fails
    }

    res.json({ success: true, token, userId: user._id });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, message: error.message });
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

    await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your account",
      html: `<p>Verify your account. Your verification code is: ${otp}</p>`,
    });
    res.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Error in sendVerifyOtp:", error);
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

    await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<p>Your password reset OTP is: ${otp}</p>`,
    });
    return res.json({
      success: true,
      message: "Password reset OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in sendResetOtp:", error);
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
    const { userId } = req;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const addItems = async (req, res) => {
  try {
    const { name, price, quantity, category, subCategory } = req.body;
    const { userId } = req;


    if (!name || price === undefined || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Name, price, and category are required" });
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
    const { userId } = req;
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
    const { name, address, items, total } = req.body;
    const { userId } = req;

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
    const { userId } = req;
    const bills = await billModel.find({ userId });
    res.json({ success: true, bills });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateBillPDF = async (req, res) => {
  const { billId } = req.params;

  try {
    const billData = await billModel.findById(billId);
    const userData = await userModel.findById(billData.userId);

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
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #222; padding: 0; margin: 0; }
          .container { max-width: 700px; margin: 32px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px #0001; padding: 32px 40px 40px 40px; }
          .header { text-align: center; margin-bottom: 32px; }
          .logo { width: 60px; height: 60px; object-fit: contain; margin-bottom: 8px; }
          .company { font-size: 2rem; font-weight: 700; color: #0891b2; letter-spacing: 1px; }
          .owner { color: #64748b; font-size: 1rem; margin-bottom: 2px; }
          .address { color: #64748b; font-size: 0.95rem; }
          .details { margin-bottom: 28px; border-radius: 8px; background: #f1f5f9; padding: 18px 24px; }
          .details p { margin: 6px 0; font-size: 1rem; }
          .details strong { color: #0e7490; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px #0001; }
          th, td { padding: 12px 10px; text-align: left; }
          th { background: #e0f2fe; color: #0369a1; font-size: 1rem; font-weight: 600; border-bottom: 2px solid #bae6fd; }
          tr:nth-child(even) { background: #f8fafc; }
          tr:nth-child(odd) { background: #f1f5f9; }
          td { font-size: 0.98rem; color: #222; border-bottom: 1px solid #e5e7eb; }
          .summary { margin-top: 24px; text-align: right; }
          .summary p { font-size: 1.1rem; margin: 2px 0; }
          .total { font-size: 1.3rem; color: #0891b2; font-weight: 700; margin-top: 8px; }
          .footer { margin-top: 36px; text-align: center; color: #64748b; font-size: 1rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://img.icons8.com/fluency/96/invoice.png" class="logo" alt="logo" />
            <div class="company">${userData.companyName}</div>
            <div class="owner">Prop. ${userData.name}</div>
            <div class="address">${userData.address}</div>
          </div>
          <div class="details">
            <p><strong>Customer Name:</strong> ${billData.name}</p>
            <p><strong>Address:</strong> ${billData.address || "N/A"}</p>
            <p><strong>Date:</strong> ${new Date(billData.date).toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
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
          <div class="summary">
            <p><strong>Subtotal:</strong> ${billData.total.toFixed(2)}</p>
            <p><strong>Paid:</strong> 0.00</p>
            <div class="total">Total Due: ${billData.total.toFixed(2)}</div>
          </div>
          <div class="footer">
            Thank you for your business!<br />
            <span style="font-size:0.95rem;">For queries, contact us at <b>${userData.phoneNumber || "N/A"}</b></span>
          </div>
        </div>
      </body>
      </html>`;

    await page.setContent(billHTML, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      path: null,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bill_${billId}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    res.status(200).end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ success: false, message: "Error generating PDF" });
  }
};

const updateUserData = async (req, res) => {
  try {
    const { userId } = req;
    const { name, phoneNumber, companyName, address } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.companyName = companyName || user.companyName;
    user.address = address || user.address;

    await user.save();
    res.json({ success: true, userData: user, message: "User data updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
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
  updateUserData,
  addItems,
  getAllItems,
  removeItems,
  newBill,
  getAllBill,
  generateBillPDF,
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
