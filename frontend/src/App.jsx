import React, { useState } from 'react'
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";

function App() {

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true )
    try {
      const response = await axios.post("http://localhost:8000/create-invoice", { email })
      if (response.data.success) {
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
    <div className="bg-gray-400 h-full w-full" >

      <Elements stripe={stripePromise}>
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
          <h2>Create Invoice</h2>
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
      </Elements>
    </div>
  )
}

export default App
