import { React, useEffect, useState, useRef } from 'react';
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
                <div className="cart-item-product">
                    <img src={item.productImage} alt={item.productName} />
                </div>
                <div className="cart-item-details">
                    <div className="cart-item-row">
                        <div className="cart-item-column">
                            <h4>{item.productName}</h4>
                        </div>
                        <div className="cart-item-column">
                            <p className="cart-item-price">Rs.{item.price.toFixed(2)}</p>
                        </div>
                        <div className="cart-item-column">
                            <div className="cart-item-quantity">
                                <button onClick={handleDecrement}>-</button>
                                <input type="number" value={item.quantity} onChange={handleChange} />
                                <button onClick={handleIncrement}>+</button>
                            </div>
                        </div>
                        <div className="cart-item-column">
                            <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

const Cart = () => {
    const { cart, saveCart, clearCart } = useShopContext();
    const { isAuthenticated } = useAuth0();
    const [orderedItems, setOrderedItems] = useState([]);
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handlePaymentSuccess = (items) => {

        setOrderedItems(items);
        clearCart();
    };
    useEffect(() => {

        const hasReloaded = sessionStorage.getItem('hasReloaded');

        if (!hasReloaded) {

            sessionStorage.setItem('hasReloaded', 'true');


            window.location.reload();
        }
    }, []);

    if (!isAuthenticated) {

        sessionStorage.removeItem('hasreloaded')
    }

    return (

        <div className="cart">
            {cart.map(item => (
                <CartItem key={item.id} item={item} />
            ))}
            <div className="total-amount-container">
                <h3 className="total-amount">Total Amount: Rs.{totalAmount.toFixed(2)}</h3>
            </div>
           
            <Pay onSuccess={() => handlePaymentSuccess(cart)} />
            {orderedItems.length > 0 && (
                <div className="ordered-items">
                    <h3>Your Ordered Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderedItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>Rs.{item.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Cart;
