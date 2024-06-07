import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from 'cors'
import { DBConnected } from "./DataBase/DBConnect.js";
import UserRout from '../server/Route/UserRout.js'

dotenv.config();
const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["https://quotemailer.onrender.com", "*"]
}));

app.use('/api/user', UserRout)

app.use(express.static(path.join(__dirname, "/client/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
})



app.listen(process.env.PORT || 4000, () => {
    DBConnected().then(() => {
        console.log(`QuoteMailer Server Is Ruuning On ${process.env.PORT}!!`);
    }).catch((error) => {
        console.log("Server ", error);
    })
})