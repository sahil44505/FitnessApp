import React, { createContext, useContext, useReducer ,useEffect , useState} from 'react'
import reducer from '../reducer/shopReducer';
import { useAuth0 } from '@auth0/auth0-react';

const ShopContext = createContext();

const initialState ={
    cart : [],
    total_item : "",
    total_amount : "",

}
const ShopContextProvider = ({children}) => {
    const {isAuthenticated,isLoading} = useAuth0()

   
    const [shouldLoadCart, setShouldLoadCart] = useState(false);
  
    const [state,dispatch] = useReducer(reducer,initialState);
    const addtoCart = (id, productName, price, productImage) =>{
        
        dispatch({type:"ADD_TO_CART" , payload : {id, productName, price, productImage}})
      
       
    }
    const removeFromCart = (id) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
       
       
    };

    const updateCart = (id, quantity) => {
        dispatch({ type: "UPDATE_CART", payload: { id, quantity } });
        
      
    };
    const saveCart = async () => {
        try {
            
            const token = localStorage.getItem('token'); // or wherever you store your token
           
            if (!token) {
                throw new Error('No token found');
            }
            const response = await fetch('http://localhost:8080/api/cartSave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({items:state.cart}),
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
          
           
        } catch (error) {
            console.error('Error saving cart:', error);
        }
        setShouldLoadCart(prev => !prev);
    };

    const loadCart = async () => {
        try {
            const token = localStorage.getItem('token'); // or wherever you store your token
            const response = await fetch('http://localhost:8080/api/cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
          
            dispatch({ type: 'LOAD_CART', payload: data });
            
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
          loadCart();
        }
      }, [isAuthenticated, isLoading]);
    
  
    const totalItemCount = state.cart.reduce((total, item) => total + item.quantity, 0).toString();
  
    return (
    <ShopContext.Provider value={{ ...state, cart:state.cart,total_item: totalItemCount, addtoCart, removeFromCart, updateCart ,clearCart,saveCart}}>
        {children}
    </ShopContext.Provider>
    );
   
  
}
const useShopContext = () =>{
   
    return useContext(ShopContext)
}

export { ShopContextProvider , useShopContext }
