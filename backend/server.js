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

const customer = await stripe.customers.create({
  email: 'rajshivam2745@gmail.com',
})
.then((customer)=>{
    return stripe.invoiceItems.create({
        customer:customer.id,
        amount: 2500, 
        currency: 'usd',
        description: 'One-time setup fee',
    })
    .then((invoiceItem)=>{
        return stripe.invoices.create({
            collection_method:"send_invoice",
            customer:invoiceItem.customer,
        })
    })
    .then((invoice)=>{
        //new invoice created
    })
    .catch((error)=>{
        console.log(error);
        
    })
})

app.get("/create-intent",(req,res)=>{
    res.send("Payment intent")
})
app.listen(PORT,()=>{
    console.log(`Server is listening at port ${process.env.PORT}`);
    
})
