
import express from 'express'
import  sendInvoiceEmail  from '../controller/paymentController.js'
import checkPaymentTime from '../middleware/checkPaymentTime.js'

const router = express.Router();


router.post('/process-payment', checkPaymentTime, (req, res) => {
  res.status(200).json({ message: 'Payment processed successfully' });
});


router.post('/send-invoice', sendInvoiceEmail);

export default router;
