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
        fetch("/api/create-intent", {
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
                setClientSecret(data.clientSecret)
            })
    }, [amount])
    return (
        <div className='flex items-center text-center justify-between'>
            <form>
                {clientSecret && <PaymentElement />}
                <button>Pay</button>
            </form>
        </div>

    )
}

export default CheckoutPage
