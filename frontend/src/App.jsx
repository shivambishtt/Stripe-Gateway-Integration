import React, { useState } from 'react'
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js";
import convertToSubCurrency from './convertToSubCurrency.js';
import CheckoutPage from './pages/CheckoutPage.jsx';

function App() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  let amount = 49.99
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/create-intent", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ email })
      })
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage("Invoice created and sent successfully!");
      }
      else {
        setMessage("Failed to create invoice.");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      setMessage("An error occurred. Please try again.");
    }
    setLoading(false)
  }


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
      </div>
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
      {/* <Elements stripe={stripePromise}>
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
          <h2 className='text-3xl font-bold text-center mb-6'  >Create Invoice</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Customer Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Creating Invoice..." : "Create Invoice"}
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </Elements> */}
    </div>
  )
}

export default App
