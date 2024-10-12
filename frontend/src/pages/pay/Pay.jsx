import React, { useState, useEffect } from 'react';
import { load } from '@cashfreepayments/cashfree-js';
import { useShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pay = ({ onSuccess }) => {
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
            
            const response = await fetch("http://localhost:8080/pay/payment", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cartItems: cart })
            });
            const res = await response.json();
            

            if (res.data && res.data.payment_session_id) {
                setOrderId(res.data.order_id);
                return res.data.payment_session_id;
            } else {
                toast.error(res.error || 'Failed to initiate payment');
            }
        } catch (error) {
            console.error("Error from payment", error);
            toast.error('Network error. Please try again.');
        }
    };

    const verifyPayment = async () => {
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch("http://localhost:8080/pay/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderId })
            });
            const res = await response.json();
           

            if (res.success) {
                toast.success("Your order is on the way!");
                clearCart(); // Clear cart from the context or API if payment is successful
                if (onSuccess) onSuccess(); 
            } else {
                toast.error(res.message || 'Payment verification failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Verification error. Please try again.');
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
                  
                    verifyPayment(); // Verify the payment after the checkout
                }).catch((error) => {
                    console.error("Payment initialization error", error);
                    toast.error('Payment initialization failed. Please try again.');
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error occurred. Please try again.');
        }
    };

    return (
        <div className="pay-div">
            <button className="pay-button" onClick={handleClick}>
                Pay now
            </button>
        </div>
    );
};

export default Pay;
