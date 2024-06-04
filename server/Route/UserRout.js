import express from "express"
import { getQuote, getUserData, postQuote } from "../RouteControler/RoutControler.js";

const route = express.Router();

route.post(`/subscribe`,getUserData)

route.post('/post-quote',postQuote)

route.get('/get-quote',getQuote)

export default route