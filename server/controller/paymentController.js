import nodemailer from 'nodemailer'

const sendInvoiceEmail = async (req, res) => {
  const { email, planName, orderId, paymentId, purchasedOn } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Payment Invoice',
    html: `
      <h1>Payment Receipt</h1>
      <p><b>Plan Name:</b> ${planName}</p>
      <p><b>Order ID:</b> ${orderId}</p>
      <p><b>Payment ID:</b> ${paymentId}</p>
      <p><b>Purchased On:</b> ${purchasedOn}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invoice sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send invoice', error });
  }
};

export default sendInvoiceEmail 
