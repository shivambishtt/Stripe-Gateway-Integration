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
                setClientSecret(data.client_secret)
            })
    }, [amount])

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        if (!stripe || !elements) {
            return
        }
        const { error: submitError } = await elements.submit()
        if (submitError) {
            setErrorMessage(submitError.message)
            setLoading(false)
            return
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://localhost:8000/payment-success?amount=${amount}`
            }
        })
        if (error) {
            setErrorMessage(error.message)
        }
        else {

        }
        setLoading(false)
        if (!clientSecret || !stripe || !elements) {
            return <div>Loading...</div>
        }
    }

    return (
        <div>
            <form onSubmit={handleFormSubmit} >
                {clientSecret && <PaymentElement />}
                {errorMessage && <div>{errorMessage}</div>}
                <button
                    disabled={!stripe || loading}
                    className=' text-white w-full p-2 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse'>
                    {!loading ? `Pay $ ${amount}` : "Processing"}
                </button>
            </form>

        </div>

    )
}

export default CheckoutPage
