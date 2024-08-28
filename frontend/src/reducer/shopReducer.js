const shopReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART":

            const newItem = action.payload;
            const existingItemIndex = state.cart.findIndex(item => item.id === newItem.id);
            if (existingItemIndex >= 0) {
                const updatedCart = state.cart.map(item =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                );
                return { ...state, cart: updatedCart };
            } else {
                return { ...state, cart: [...state.cart, { ...newItem, quantity: 1 }] };
            }

        case "REMOVE_FROM_CART":
            // Handle remove from cart logic
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload.id)
            };

        case "UPDATE_CART":
            // Handle update cart logic
            const updatedCart = state.cart.map(item =>
                item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
            );
            return { ...state, cart: updatedCart };
        case "LOAD_CART":
           
            return {
                ...state,
                cart: action.payload
                
            };

        case "CLEAR_CART":
            return {
                ...state,
                cart: []
            };


        default:
            return state;
    }
};

export default shopReducer;
