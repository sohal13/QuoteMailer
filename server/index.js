import express from "express"
import dotenv from "dotenv"
import { DBConnected } from "./DataBase/DBConnect.js";
import UserRout from '../server/Route/UserRout.js'
import cors from 'cors'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors("*"));

app.use('/api/user',UserRout)


app.listen(process.env.PORT || 4000, () => {
    DBConnected().then(() => {
        console.log(`QuoteMailer Server Is Ruuning On ${process.env.PORT}!!`);
    }).catch((error) => {
        console.log("Server ", error);
    })

})