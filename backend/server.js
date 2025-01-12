import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Stripe from "stripe"

const app = express()
app.use(express.json())
app.use(cors())

dotenv.config({
    path:".env"
})
export const PORT= process.env.PORT || 9000

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


app.post("/create-intent",async (req,res)=>{
    try {
        const {amount}=  req.body

        const paymentIntent= await stripe.paymentIntents.create({
                amount,
                currency:"usd",
                automatic_payment_methods:{enabled:true}
            })
            return res.status(200).json({client_secret:paymentIntent.client_secret})
    } catch (error) {
            console.log(`Internal Error` ,error);
            return res
            .json(`Internal Server Error: ${error}`)
            .status(500)
            
    }
})

app.get("/", (req, res) => {
    res.send("Stripe backend is running...");
  });

app.listen(PORT,()=>{
    console.log(`Server is listening at port ${process.env.PORT}`);
    
})
