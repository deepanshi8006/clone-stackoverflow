import axios from "axios";
import { baseURL } from ".";

export const sendInvoice = async (invoiceData) => {
  const response = await axios.post(`${baseURL}/payment/send-invoice`, invoiceData);

  return response.data;
};

  