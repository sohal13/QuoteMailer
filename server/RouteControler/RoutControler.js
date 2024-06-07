import Quote from "../Schema/QuoteSchema.js";
import User from "../Schema/UserSchema.js";
import cron from 'node-cron'
import nodeMailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transPorter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
    debug: true, // Enable debug output
    logger: true // Log information
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
    console.log("redy to TransPorte");
    transPorter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending email:', err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

const getRandomQuote = async (user) => {
    console.log("In Getting RandomQuote");
    const unsendquote = await Quote.find({ _id: { $nin: user.sendedQuotes } });
    console.log(unsendquote);
    if (unsendquote.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * unsendquote.length)
    console.log("returning ", randomIndex);
    return unsendquote[randomIndex];
}

const scheduleEmail = async (user) => {
    try {
        console.log("In Scheduling Email");
        const [hour, minute] = user.timeing.split(':');
        console.log(`Scheduling email for ${hour}:${minute} daily`);
        // Log current server time and timezone
        console.log('Current server time:', new Date().toLocaleString());
        console.log('Current server timezone offset:', new Date().getTimezoneOffset());

        // Adjust time to server's timezone if needed
        const serverTime = moment.tz(`${hour}:${minute}`, "HH:mm", 'Your/Timezone');
        const serverHour = serverTime.hour();
        const serverMinute = serverTime.minute();

        console.log(`Adjusted server time for cron: ${serverHour}:${serverMinute}`);
        
          // Test with a cron job that triggers every minute
          cron.schedule(`* * * * *`, async () => {
            console.log('Running test scheduled task');
        });
        cron.schedule(`${serverMinute} ${serverHour} * * *`, async () => {
            console.log('Running scheduled task');
            const quote = await getRandomQuote(user)
            if (quote) {
                console.log("Redy to send Mail");
                sendMail(user.email, quote);
                await user.sendedQuotes.push(quote._id);
                await user.save();
            } else {
                console.log('No more new quotes to send to user:', user.email);
            }
        })
        console.log('Email scheduled successfully');
    } catch (error) {
        console.error('Error in scheduling email:', error);
        console.log(error);
    }
}

export const getUserData = async (req, res) => {
    
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