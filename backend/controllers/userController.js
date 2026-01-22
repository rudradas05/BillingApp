import validator from "validator";
import { resend } from "../config/resend.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import productModel from "../models/productModels.js";
import billModel from "../models/billModel.js";

import PDFDocument from "pdfkit";


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

// const newBill = async (req, res) => {
//   try {
//     const { name, address, items, total } = req.body;
//     const { userId } = req;

//     if (!name || !items || items.length === 0 || !total) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please fill all fields" });
//     }

//     for (let item of items) {
//       if (!item.name || !item.quantity || !item.rate || !item.amount) {
//         return res.status(400).json({
//           success: false,
//           message: "Each item must have name, quantity, rate, and amount",
//         });
//       }
//     }

//     const billData = {
//       userId,
//       name,
//       address: address || "",
//       items,
//       total,
//       date: Date.now(),
//     };

//     const newBill = new billModel(billData);
//     await newBill.save();

//     res.json({
//       success: true,
//       message: "Bill added successfully",
//       billId: newBill._id,
//     });
//   } catch (error) {
//     console.error("Error adding bill:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


const newBill = async (req, res) => {
  try {
    const { name, address, phone, email, items, total } = req.body;
    const { userId } = req;

    if (!name || !Array.isArray(items) || items.length === 0 || !total) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    for (let item of items) {
      if (
        !item.name ||
        typeof item.quantity !== "number" ||
        typeof item.rate !== "number" ||
        typeof item.amount !== "number"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid item data",
        });
      }
    }

    /* -------- INVOICE NUMBER -------- */
    const count = await billModel.countDocuments({ userId });
    const invoiceNo = `INV-${String(count + 1).padStart(4, "0")}`;

    const billData = {
      userId,
      invoiceNo,
      name,
      address: address || "",
      phone: phone || "",
      email: email || "",
      items,
      total,
      date: new Date(),
    };

    const bill = new billModel(billData);
    await bill.save();

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      billId: bill._id,
      invoiceNo,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create invoice",
    });
  }
};


// const getAllBill = async (req, res) => {
//   try {
//     const { userId } = req;
//     const bills = await billModel.find({ userId });
//     res.json({ success: true, bills });
//   } catch (error) {
//     console.error("Error fetching bills:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const generateBillPDF = async (req, res) => {
//   const { billId } = req.params;

//   try {
//     const billData = await billModel.findById(billId);
//     const userData = await userModel.findById(billData.userId);

//     if (!billData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Bill not found" });
//     }

//     const browser = await puppeteer.launch({
//       headless: "new", // Fix Puppeteer issue
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();

//     const billHTML = `<!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #222; padding: 0; margin: 0; }
//           .container { max-width: 700px; margin: 32px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px #0001; padding: 32px 40px 40px 40px; }
//           .header { text-align: center; margin-bottom: 32px; }
//           .logo { width: 60px; height: 60px; object-fit: contain; margin-bottom: 8px; }
//           .company { font-size: 2rem; font-weight: 700; color: #0891b2; letter-spacing: 1px; }
//           .owner { color: #64748b; font-size: 1rem; margin-bottom: 2px; }
//           .address { color: #64748b; font-size: 0.95rem; }
//           .details { margin-bottom: 28px; border-radius: 8px; background: #f1f5f9; padding: 18px 24px; }
//           .details p { margin: 6px 0; font-size: 1rem; }
//           .details strong { color: #0e7490; }
//           table { width: 100%; border-collapse: collapse; margin-top: 18px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px #0001; }
//           th, td { padding: 12px 10px; text-align: left; }
//           th { background: #e0f2fe; color: #0369a1; font-size: 1rem; font-weight: 600; border-bottom: 2px solid #bae6fd; }
//           tr:nth-child(even) { background: #f8fafc; }
//           tr:nth-child(odd) { background: #f1f5f9; }
//           td { font-size: 0.98rem; color: #222; border-bottom: 1px solid #e5e7eb; }
//           .summary { margin-top: 24px; text-align: right; }
//           .summary p { font-size: 1.1rem; margin: 2px 0; }
//           .total { font-size: 1.3rem; color: #0891b2; font-weight: 700; margin-top: 8px; }
//           .footer { margin-top: 36px; text-align: center; color: #64748b; font-size: 1rem; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <img src="https://img.icons8.com/fluency/96/invoice.png" class="logo" alt="logo" />
//             <div class="company">${userData.companyName}</div>
//             <div class="owner">Prop. ${userData.name}</div>
//             <div class="address">${userData.address}</div>
//           </div>
//           <div class="details">
//             <p><strong>Customer Name:</strong> ${billData.name}</p>
//             <p><strong>Address:</strong> ${billData.address || "N/A"}</p>
//             <p><strong>Date:</strong> ${new Date(billData.date).toLocaleDateString()}</p>
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Rate</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${billData.items
//         .map(
//           (item, index) => `
//                     <tr>
//                       <td>${index + 1}</td>
//                       <td>${item.name}</td>
//                       <td>${item.quantity}</td>
//                       <td>${item.rate.toFixed(2)}</td>
//                       <td>${item.amount.toFixed(2)}</td>
//                     </tr>
//                   `
//         )
//         .join("")}
//             </tbody>
//           </table>
//           <div class="summary">
//             <p><strong>Subtotal:</strong> ${billData.total.toFixed(2)}</p>
//             <p><strong>Paid:</strong> 0.00</p>
//             <div class="total">Total Due: ${billData.total.toFixed(2)}</div>
//           </div>
//           <div class="footer">
//             Thank you for your business!<br />
//             <span style="font-size:0.95rem;">For queries, contact us at <b>${userData.phoneNumber || "N/A"}</b></span>
//           </div>
//         </div>
//       </body>
//       </html>`;

//     await page.setContent(billHTML, { waitUntil: "domcontentloaded" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       path: null,
//     });

//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="bill_${billId}.pdf"`,
//       "Content-Length": pdfBuffer.length,
//     });

//     res.status(200).end(pdfBuffer);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     res.status(500).json({ success: false, message: "Error generating PDF" });
//   }
// };


const getAllBill = async (req, res) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bills = await billModel
      .find({ userId })
      .sort({ date: -1 }) // latest bills first
      .select(
        "invoiceNo name address total date items"
      );

    res.status(200).json({
      success: true,
      bills,
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
    });
  }
};


// const generateBillPDF = async (req, res) => {
//   try {
//     const { billId } = req.params;

//     const bill = await billModel.findById(billId);
//     const user = await userModel.findById(bill.userId);

//     if (!bill) {
//       return res.status(404).json({ success: false, message: "Bill not found" });
//     }

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${bill.invoiceNo}.pdf`
//     );

//     const doc = new PDFDocument({ size: "A4", margin: 40 });
//     doc.pipe(res);

//     /* ---------- HEADER ---------- */
//     doc
//       .fontSize(22)
//       .fillColor("#0ea5e9")
//       .text(user.companyName || "Company Name", { align: "center" });

//     doc
//       .fontSize(10)
//       .fillColor("#444")
//       .text(`Prop. ${user.name}`, { align: "center" })
//       .text(user.address || "", { align: "center" })
//       .moveDown(1);

//     doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();

//     /* ---------- INVOICE INFO ---------- */
//     doc.moveDown(1);
//     doc.fontSize(12).fillColor("#000");
//     doc.text(`Invoice No: ${bill.invoiceNo}`);
//     doc.text(`Date: ${new Date(bill.date).toLocaleDateString()}`);
//     doc.text(`Customer: ${bill.name}`);
//     doc.text(`Address: ${bill.address || "N/A"}`);

//     /* ---------- TABLE HEADER ---------- */
//     doc.moveDown(1.5);
//     const tableTop = doc.y;

//     doc
//       .fontSize(11)
//       .fillColor("#0369a1")
//       .text("Item", 40, tableTop)
//       .text("Qty", 280, tableTop)
//       .text("Rate", 340, tableTop)
//       .text("Amount", 430, tableTop);

//     doc.moveTo(40, tableTop + 15).lineTo(555, tableTop + 15).stroke();

//     /* ---------- ITEMS ---------- */
//     let y = tableTop + 25;

//     bill.items.forEach((item, index) => {
//       if (y > 750) {
//         doc.addPage();
//         y = 50;
//       }

//       doc
//         .fontSize(10)
//         .fillColor("#000")
//         .text(item.name, 40, y)
//         .text(item.quantity.toString(), 280, y)
//         .text(item.rate.toFixed(2), 340, y)
//         .text(item.amount.toFixed(2), 430, y);

//       y += 20;
//     });

//     /* ---------- TOTAL ---------- */
//     doc.moveDown(2);
//     doc
//       .fontSize(14)
//       .fillColor("#0ea5e9")
//       .text(`Total: ₹${bill.total.toFixed(2)}`, {
//         align: "right",
//       });

//     /* ---------- SIGNATURE ---------- */
//     doc.moveDown(3);
//     doc
//       .fontSize(10)
//       .fillColor("#444")
//       .text("Authorized Signature", { align: "right" });

//     doc.end();
//   } catch (error) {
//     console.error("PDF Error:", error);
//     res.status(500).json({ success: false, message: "PDF generation failed" });
//   }
// };



const generateBillPDF = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await billModel.findById(billId);
    const user = await userModel.findById(bill.userId);

    if (!bill || !user) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${bill.invoiceNo}.pdf`
    );

    doc.pipe(res);

    /* ================= HEADER ================= */
    doc.rect(0, 0, 612, 120).fill("#064E3B");

    doc
      .fillColor("#fff")
      .font("Helvetica-Bold")
      .fontSize(22)
      .text(user.companyName, 40, 35);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(user.address || "", 40, 62)
      .text(`Phone: ${user.phoneNumber || "-"}`, 40, 78);

    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("INVOICE", 400, 35, { align: "right" });

    doc.fillColor("#000");

    /* ================= CUSTOMER + INVOICE INFO ================= */
    const infoTop = 150;

    // LEFT – Customer
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`Name: ${bill.name}`, 40, infoTop, {
        width: 260,
      })
      .text(
        `Address: ${bill.address || "N/A"}`,
        40,
        infoTop + 18,
        { width: 260 }
      )
      .text(`Mobile: ${bill.phone || ""}`, 40, infoTop + 34, {
        width: 260,
      })
      .text(`Email: ${bill.email || ""}`, 40, infoTop + 50, {
        width: 260,
      });

    // RIGHT – Invoice details
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Invoice No:", 360, infoTop)
      .font("Helvetica")
      .text(bill.invoiceNo, 460, infoTop, { align: "right" });

    doc
      .font("Helvetica-Bold")
      .text("Date:", 360, infoTop + 18)
      .font("Helvetica")
      .text(
        new Date(bill.date).toLocaleDateString(),
        460,
        infoTop + 18,
        { align: "right" }
      );

    /* Divider */
    doc
      .moveTo(40, infoTop + 80)
      .lineTo(560, infoTop + 80)
      .strokeColor("#d1d5db")
      .lineWidth(0.5)
      .stroke();

    /* ================= TABLE HEADER ================= */
    let y = infoTop + 105;

    doc.rect(40, y, 520, 28).fill("#064E3B");

    doc
      .fillColor("#fff")
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("#", 45, y + 8)
      .text("Description", 70, y + 8)
      .text("Rate", 310, y + 8, { width: 60, align: "right" })
      .text("Qty", 380, y + 8, { width: 60, align: "right" })
      .text("Amount", 460, y + 8, { width: 80, align: "right" });

    y += 35;
    doc.fillColor("#000").font("Helvetica");

    /* ================= ITEMS ================= */
    bill.items.forEach((item, index) => {
      if (y > 720) {
        doc.addPage();
        y = 60;
      }

      doc
        .fontSize(10)
        .text(index + 1, 45, y)
        .text(item.name, 70, y, { width: 220 })
        .text(item.rate.toFixed(2), 310, y, { width: 60, align: "right" })
        .text(item.quantity, 380, y, { width: 60, align: "right" })
        .text(item.amount.toFixed(2), 460, y, {
          width: 80,
          align: "right",
        });

      y += 22;
    });

    /* ================= TOTAL ================= */
    y += 15;
    doc
      .moveTo(300, y)
      .lineTo(560, y)
      .strokeColor("#d1d5db")
      .stroke();

    y += 15;

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("TOTAL", 360, y)
      .text(bill.total.toFixed(2), 460, y, {
        width: 80,
        align: "right",
      });

    /* ================= SIGNATURE ================= */
    y += 80;

    doc
      .moveTo(420, y)
      .lineTo(560, y)
      .strokeColor("#000")
      .lineWidth(1)
      .stroke();

    doc
      .fontSize(10)
      .text("Authorized Signature", 420, y + 5, {
        width: 140,
        align: "center",
      });

    /* ================= FOOTER ================= */
    doc
      .fontSize(10)
      .fillColor("#374151")
      .text("Thank you for your business!", 40, 780, {
        width: 520,
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "PDF generation failed" });
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


