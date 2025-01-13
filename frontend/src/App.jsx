import React, { useState } from 'react'
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js";
import convertToSubCurrency from './convertToSubCurrency.js';
import CheckoutPage from './pages/CheckoutPage.jsx';

function App() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  let amount = 49.99

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      color: '#fff',
    }} >
      <div className='mb-10'>
        <h1 className='text-4xl font-extrabold mb-2'>Shivam</h1>
        <h1 className='text-3xl' >
          has requested
          <span className='font-bold'> {amount}$</span>
        </h1>
      <Elements stripe={stripePromise}
      options={{
        mode:"payment",
        amount:convertToSubCurrency(amount),
        currency:"usd"
      }}
      >
        <CheckoutPage amount={amount}
        />
      </Elements>
      </div>
     
    </div>
  )
}

export default App
