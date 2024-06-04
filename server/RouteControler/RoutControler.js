import Quote from "../Schema/QuoteSchema.js";
import User from "../Schema/UserSchema.js";
import cron from 'node-cron'
import nodeMailer from 'nodemailer'



export const getUserData = async (req, res) => {
    
    const transPorter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        },
    });
    
    const sendMail = (email, quote) => {
        console.log("In sending Email");
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Quote Of The Day 😁!!',
            html: `
            <div style="font-size: 16px; font-family: Arial;">
              <blockquote style="font-size: 20px;">"${quote.text}"</blockquote>
              <p style="font-size: 14px;">- ${quote.author || 'Unknown'}</p>
            </div>
            `
        }
        transPorter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
    }
    
    const getRandomQuote = async (user) => {
        console.log("In Getting RandomQuote");
        const unsendquote = await Quote.find({ _id: { $nin: user.sendedQuotes } });
        if (unsendquote.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * unsendquote.length)
        return unsendquote[randomIndex];
    }
    
    const scheduleEmail = async (user) => {
        try {
            console.log("In Scheduling Email");
            const [hour, minute] = user.timeing.split(':');
            cron.schedule(`${minute} ${hour} * * *`, async () => {
                const quote = await getRandomQuote(user)
                if (quote) {
                    sendMail(user.email, quote);
                    user.sendedQuotes.push(quote._id);
                    await user.save();
                } else {
                    console.log('No more new quotes to send to user:', user.email);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    try {
        const { email, timeing } = req.body;
        const newUser = new User({ email, timeing, sendedQuotes: [] })
        if (newUser) {
            await newUser.save();
        }
        scheduleEmail(newUser)
        res.status(201).send({message:'Subscribed successfully',newUser});

    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error subscribing user'
        });
    }
}


export const postQuote = async (req, res) => {
    try {
        const { text, author } = req.body;
        if (!text) return res.status(404).send({ message: "Enter The Quote BeFore Posting" })
        const newquote = new Quote({ text, author })
        if (newquote) {
            await newquote.save();
        }
        res.status(201).send({ message: "POsted Quote IS", newquote })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error In Posting Quote Now!! '
        });
    }
}

export const getQuote=async(req,res)=>{
    try {
        const quote = await Quote.find();
        if(quote.length === 0){
            return res.status(404).send({success:false,message:'No more quotes In DataBase'});
        }
        res.status(200).send(quote)
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error In Getting Quote Now!! '
        });
    }
}