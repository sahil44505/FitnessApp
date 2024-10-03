import { React, useEffect, useRef } from 'react';
import { useShopContext } from '../context/ShopContext';
import { useAuth0 } from '@auth0/auth0-react';
import Pay from './pay/Pay';

import "./css/Shop.css"


const CartItem = ({ item }) => {
    const { removeFromCart, updateCart } = useShopContext();

    const handleIncrement = () => {
        updateCart(item.id, item.quantity + 1);
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            updateCart(item.id, item.quantity - 1);
        } else {
            removeFromCart(item.id);
        }
    };

    const handleChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
            updateCart(item.id, value);
        }
    };


    return (
        <>
            <div className="cart-item">
                <img src={item.productImage} alt={item.productName} />
                <div>
                    <h4>{item.productName}</h4>
                    <p>{item.price}</p>
                    <div>
                        <button onClick={handleDecrement}>-</button>
                        <input type="number" value={item.quantity} onChange={handleChange} />
                        <button onClick={handleIncrement}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>

            </div>

        </>
    );
};

const Cart = () => {
    const hasReloaded = useRef(false);
    const { isAuthenticated } = useAuth0()
    useEffect(() => {
        // Check if the reload has already been triggered
        const hasReloaded = sessionStorage.getItem('hasReloaded');
    
        if (!hasReloaded) {
          // Set the flag in sessionStorage
          sessionStorage.setItem('hasReloaded', 'true');
          
          // Reload the page
          window.location.reload();
        }
      }, []); // Empty dependency array ensures this runs only once on mount
      
        if (!isAuthenticated) {
          // Remove the 'hasReloaded' flag when the user logs out
          sessionStorage.removeItem('hasreloaded')
        }
      
    

    const { cart, saveCart } = useShopContext();
    const totalAmount = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    return (

        <div className="cart">
            {cart.map(item => (
                <CartItem key={item.id} item={item} />
            ))}
            <div className="total-amount">
                <h3>Total Amount: Rs.{totalAmount.toFixed(2)}</h3>
            </div>
            <button onClick={saveCart}>Save Cart</button>
            <Pay />
        </div>
    );
};

export default Cart;
