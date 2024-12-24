import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userroutes from "./routes/user.js"
import questionroutes from "./routes/question.js"
import answerroutes from "./routes/answer.js"
import paymentRoutes from './routes/paymentRoutes.js'


const corsOptions = {
  origin: ["http://localhost:3000", "https://darling-kelpie-39d5c8.netlify.app/"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
const app=express();
dotenv.config();
app.use(express.json({limit:"30mb", extended: true}))
app.use(express.urlencoded({limit:"30mb", extended :true}))
app.use(cors(corsOptions))


app.use('/uploads', express.static('uploads'));
app.use("/user", userroutes);
app.use('/questions', questionroutes)
app.use('/answer',answerroutes)
app.use('/payment', paymentRoutes);

app.get('/', (req, res) => {
    res.send("Stack-overflow is running perfect")
})
const PORT = process.env.PORT || 5000
const database_url = process.env.MONGODB_URL

mongoose.connect(database_url)
    .then(() => app.listen(PORT, () => { console.log(`server running on port ${PORT}`) }))
    .catch((err) => console.log(err.message))
