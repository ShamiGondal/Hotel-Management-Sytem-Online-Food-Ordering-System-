import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        console.log("Cart items updated:", cartItems);
    }, [cartItems]);

    const addToCart = (foodItem) => {
        const itemExistsIndex = cartItems.findIndex(item => item.FoodItemID === foodItem.FoodItemID);
        if (itemExistsIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[itemExistsIndex] = { ...updatedCartItems[itemExistsIndex], quantity: updatedCartItems[itemExistsIndex].quantity + 1 };
            setCartItems(updatedCartItems);
        } else {
            setCartItems([...cartItems, { ...foodItem, quantity: 1 }]);
        }
    };

    const removeFromCart = (foodItemId) => {
        const updatedCartItems = cartItems.filter(item => item.FoodItemID !== foodItemId);
        setCartItems(updatedCartItems);
    };

    const increaseQuantity = (foodItemId) => {
        const updatedCartItems = [...cartItems];
        const itemIndex = updatedCartItems.findIndex(item => item.FoodItemID === foodItemId);
        if (itemIndex !== -1) {
            updatedCartItems[itemIndex] = { ...updatedCartItems[itemIndex], quantity: updatedCartItems[itemIndex].quantity + 1 };
            setCartItems(updatedCartItems);
        }
    };

    const decreaseQuantity = (foodItemId) => {
        const updatedCartItems = [...cartItems];
        const itemIndex = updatedCartItems.findIndex(item => item.FoodItemID === foodItemId);
        if (itemIndex !== -1 && updatedCartItems[itemIndex].quantity > 1) {
            updatedCartItems[itemIndex] = { ...updatedCartItems[itemIndex], quantity: updatedCartItems[itemIndex].quantity - 1 };
            setCartItems(updatedCartItems);
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return {
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
    };
};


export const CartProvider = ({ children }) => {
    const cart = useCart();

    return (
        <CartContext.Provider value={cart}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => useContext(CartContext);
