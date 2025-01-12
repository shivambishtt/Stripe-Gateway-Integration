import React, { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import convertToSubCurrency from '../convertToSubCurrency.js'

function CheckoutPage({ amount }) {
    const stripe = useStripe()
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState()
    const [clientSecret, setClientSecret] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch("http://localhost:8000/create-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({ amount: convertToSubCurrency(amount) })
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                console.log(data,"Data");
                
                setClientSecret(data.client_secret)
            })
    }, [amount])
    return (
        <div className='flex items-center text-center justify-between'>
            <form>
                {clientSecret && <PaymentElement />}
                {console.log(clientSecret, "client secret    ")}
            </form>
            <button className='mt-20 bg-slate-500 px-4 border border-spacing-3'>Pay</button>
        </div>

    )
}

export default CheckoutPage
