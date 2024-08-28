import { React, useState } from 'react';

import {load} from "@cashfreepayments/cashfree-js"
const Pay = () => {
    let cashfree;
    let initialize = async function () {
        cashfree = await load({
            mode:"sandbox",
        })
        
    }
    initialize()

 
  const [orderId, setOrderId] = useState("")

  const getSessionId = async () => {
    try {

      let response = await fetch("http://localhost:8080/pay/payment");
      let res = await response.json();

      if (res.data && res.data.payment_session_id) {
        console.log(res.data.payment_session_id);
        setOrderId(res.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log("Error from payment ")
      console.log(error);
    }
  }

  const verifyPayment = async () => {
    try {
      let response = await fetch("http://localhost:8080/pay/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: orderId
        })
      });

      let res = await response.json();

      if (res) {
        alert("payment verified");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault()
    try {

      let sessionId = await getSessionId()
      console.log("Session id",sessionId)
      let checkoutOptions = {
        paymentSessionId : sessionId,
        redirectTarget:"_modal",

      }
      cashfree.checkout(checkoutOptions).then((res)=>{
        console.log("Payment initialized")

      })



    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <h1>Cashfree payment getway</h1>
      <div className="card">
        <button onClick={handleClick}>
          Pay now
        </button>

      </div>

    </>
  );
}

export default Pay;
