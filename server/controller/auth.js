import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import users from "../models/auth.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";


dotenv.config(); 
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_KEY,
  });
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const extinguser = await users.findOne({ email });
        if (extinguser) {
            return res.status(404).json({ message: "User already exist" });
        }
        const hashedpassword = await bcrypt.hash(password, 12);

        const newuser = await users.create({
            name,
            email,
            password: hashedpassword
        });
        const token = jwt.sign({
            email: newuser.email, id: newuser._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" }
        )
        res.status(200).json({ result: newuser, token });
    } catch (error) {
        res.status(500).json("something went wrong...")
        return
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const extinguser = await users.findOne({ email });
        if (!extinguser) {
            return res.status(404).json({ message: "User does not exists" })
        }
        const ispasswordcrct = await bcrypt.compare(password, extinguser.password);
        if (!ispasswordcrct) {
            res.status(400).json({ message: "Invalid credentiasl" });
            return
        }
        const token = jwt.sign({
            email: extinguser.email, id: extinguser._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" }
        )


        res.status(200).json({ result: extinguser, token })
    } catch (error) {
        res.status(500).json("something went wrong...")
        return
    }
}
export const checkoutSession = async (req, res) => {
    try {
      const { price } = req.body;
  
      if (!price) {
        return res.status(400).json({ msg: "All fields are required" });
      }
  
      const options = {
        amount: price * 100,
        currency: "INR",
      };
  
      const order = await instance.orders.create(options);
  
      return res.status(200).json({ success: true, order });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        data: err.message,
        message: "Internal Server Error",
      });
    }
  };
export const paymentVerfication = async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;
      const id = req.params.userId;
      const Currentplan = req.params.plan;
  
      let body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY)
        .update(body.toString())
        .digest("hex");
  
      if (expectedSignature === razorpay_signature) {

        const user = await users.findByIdAndUpdate(
          id,
          {
            Currentplan,
            $push: {
              payments: {
                planName: Currentplan,
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                purchasedOn: new Date(),
              },
            },
          },
          { new: true }
        );
        const { _id, name, email, tags, joinedOn } = user;
        const Reciept = {
          planName: Currentplan,
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          purchasedOn: new Date(),
        };
        const recieptData = encodeURIComponent(JSON.stringify(Reciept));
  
      const userData = encodeURIComponent(
          JSON.stringify({ _id, name, email, tags, joinedOn })
        );
        res.redirect(
          `https://darling-kelpie-39d5c8.netlify.app`
        );
      } else {
        return res.redirect(
          `https://darling-kelpie-39d5c8.netlify.app`
        );
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        data: err.message,
        message: "Internal Server Error",
      });
    }
  };