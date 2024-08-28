import React,{ useContext } from 'react'
// import {ShopContext} from "../../context/Shop-context"
import { useShopContext } from '../context/ShopContext';
import '../pages/css/Shop.css'
export const Product = (props) => {
    
  const { id, productName, price, productImage } = props.data;
//   const {addToCart,cartItems} = useContext(ShopContext);
//   let cartItemsamount = cartItems[_id]
  const {addtoCart}= useShopContext()
  return (
    <div className='product'>
      <img src={productImage} />

      <div className='description'>
        <p>
         
          <b>{productName}</b>
        </p>
        <p>{price}.Rs</p>
      </div>
      <button className="addToCartBttn" onClick={ ()=> addtoCart(id, productName, price, productImage)}> Add to Cart </button>
      


    </div>
  )


}


