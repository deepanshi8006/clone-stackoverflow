import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  Currentplan: {  type: String, enum: ["Free","Bronze" ,"Silver", "Gold"],
           default:"Free"},
  payments:[{
    planName:{type:String},
    razorpay_payment_id:{type:String},
    razorpay_order_id:{type:String},
     razorpay_signature:{type:String},
     purchasedOn:{type:Date,default:Date.now()}
  }],
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinedOn: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
