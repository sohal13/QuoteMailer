import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true
 },
  author: { 
    type: String
 } 
},{timestamps:true});

const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;