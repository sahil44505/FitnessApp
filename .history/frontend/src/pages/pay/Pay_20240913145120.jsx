import React, { useState, useEffect } from 'react';
import { load } from '@cashfreepayments/cashfree-js';
import { useShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify'; // Install react-toastify for toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const Pay = () => {
    const { cart, clearCart } = useShopContext();
    const [cashfree, setCashfree] = useState(null);
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        const initializeCashfree = async () => {
            const cashfreeInstance = await load({ mode: "sandbox" });
            setCashfree(cashfreeInstance);
        };
        initializeCashfree();
    }, []);

    const getSessionId = async () => {
       
        const token = localStorage.getItem('token');
        try {
            let response = await fetch("http://localhost:8080/pay/payment", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cartItems: cart })
            });
            let res = await response.json();

            if (res.data && res.data.payment_session_id) {
                setOrderId(res.order_id);
                return res.data.payment_session_id;
            }
        } catch (error) {
            console.error("Error from payment", error);
        }
    };

    const verifyPayment = async () => {
        try {
            let response = await fetch("http://localhost:8080/pay/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ orderId })
            });
            let res = await response.json();

            if (res) {
                toast.success("Your order is on the way!");
                clearCart(); // Clear the cart after successful payment
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const sessionId = await getSessionId();
            if (cashfree && sessionId) {
                const checkoutOptions = {
                    paymentSessionId: sessionId,
                    redirectTarget: "_modal",
                };
                cashfree.checkout(checkoutOptions).then(() => {
                    console.log("Payment initialized");
                }).catch((error) => {
                    console.error("Payment initialization error", error);
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <h1>Cashfree Payment</h1>
            <div className="card">
                <button onClick={handleClick}>
                    Pay now
                </button>
            </div>
        </>
    );
};

export default Pay;
