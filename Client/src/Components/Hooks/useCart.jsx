import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const [cartItems, setCartItems] = useState([]);

    // Function to add an item to the cart
    const addToCart = (foodItem, selectedSize, selectedAdditions) => {
        const existingItemIndex = cartItems.findIndex(item => item.FoodItemID === foodItem.FoodItemID);

        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex] = {
                ...updatedCartItems[existingItemIndex],
                quantity: updatedCartItems[existingItemIndex].quantity + 1,
                totalPrice: calculateTotalPrice(foodItem, selectedSize, selectedAdditions),
                totalActualPrice: calculateTotalActualPrice(foodItem, selectedSize, selectedAdditions)
            };
            setCartItems(updatedCartItems);
        } else {
            setCartItems(prevItems => [
                ...prevItems,
                {
                    ...foodItem,
                    quantity: 1,
                    selectedSize,
                    selectedAdditions,
                    totalPrice: calculateTotalPrice(foodItem, selectedSize, selectedAdditions),
                    totalActualPrice: calculateTotalActualPrice(foodItem, selectedSize, selectedAdditions)
                }
            ]);
        }
    };

    // Function to add a single item to the cart
    const addSingleItemToCart = (foodItem) => {
        const existingItemIndex = cartItems.findIndex(item => item.FoodItemID === foodItem.FoodItemID);

        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex] = {
                ...updatedCartItems[existingItemIndex],
                quantity: updatedCartItems[existingItemIndex].quantity + 1,
                totalPrice: calculateTotalPrice(foodItem, null, null),
                totalActualPrice: calculateTotalActualPrice(foodItem, null, null)
            };
            setCartItems(updatedCartItems);
        } else {
            setCartItems(prevItems => [
                ...prevItems,
                {
                    ...foodItem,
                    quantity: 1,
                    totalPrice: calculateTotalPrice(foodItem, null, null),
                    totalActualPrice: calculateTotalActualPrice(foodItem, null, null)
                }
            ]);
        }
    };

    // const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalActualAmount, setTotalActualAmount] = useState(0);

    const calculateTotalAmounts = () => {
        let total = 0;
        let actualTotal = 0;
    
        // Calculate total and actual total without coupon
        cartItems.forEach(item => {
            total += parseFloat(item.totalPrice) * item.quantity;
            actualTotal += parseFloat(item.totalActualPrice) * item.quantity;
        });
    
        // Add delivery charge
        total += 2;
    
        // Calculate tax amount
        const taxAmount = (total * 5) / 100;
    
        // Apply tax
        total += taxAmount;
    
        // Update state with calculated totals
        setTotalAmount(total.toFixed(2));
        setTotalActualAmount(actualTotal.toFixed(2));
    };
    

    // Function to increase the quantity of an item
    const increaseQuantity = (foodItemId) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.FoodItemID === foodItemId) {
                const updatedQuantity = item.quantity + 1;
                return {
                    ...item,
                    quantity: updatedQuantity,
                    totalPrice: calculateTotalPrice(item, item.selectedSize, item.selectedAdditions),
                    totalActualPrice: calculateTotalActualPrice(item, item.selectedSize, item.selectedAdditions)
                };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        // Recalculate total amounts
        calculateTotalAmounts();
    };

    // Function to decrease the quantity of an item
    const decreaseQuantity = (foodItemId) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.FoodItemID === foodItemId && item.quantity > 1) {
                const updatedQuantity = item.quantity - 1;
                return {
                    ...item,
                    quantity: updatedQuantity,
                    totalPrice: calculateTotalPrice(item, item.selectedSize, item.selectedAdditions),
                    totalActualPrice: calculateTotalActualPrice(item, item.selectedSize, item.selectedAdditions)
                };
            }
            return item;
        });
        setCartItems(updatedCartItems.filter(item => item.quantity > 0));
        // Recalculate total amounts
        calculateTotalAmounts();
    };
    // Function to remove an item from the cart
    const removeFromCart = (foodItemId) => {
        const updatedCartItems = cartItems.filter(item => item.FoodItemID !== foodItemId);
        setCartItems(updatedCartItems);
    };

    // Function to clear the cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Function to calculate the total actual price of an item
    const calculateTotalActualPrice = (foodItem, selectedSize, selectedAdditions) => {
        let total = parseFloat(foodItem.Price) || 0;

        if (selectedSize) {
            total += parseFloat(selectedSize.price) || 0;
        }

        if (selectedAdditions && selectedAdditions.length > 0) {
            selectedAdditions.forEach(addition => {
                total += parseFloat(addition.price) || 0;
            });
        }

        return total;
    };

    // Function to calculate the total price of an item
    const calculateTotalPrice = (foodItem, selectedSize, selectedAdditions) => {
        let total = parseFloat(foodItem.Price) || 0;

        if (selectedSize) {
            total += parseFloat(selectedSize.price) || 0;
        }

        if (selectedAdditions && selectedAdditions.length > 0) {
            selectedAdditions.forEach(addition => {
                total += parseFloat(addition.price) || 0;
            });
        }

        if (foodItem.FoodItemDiscount) {
            const discountAmount = (parseFloat(foodItem.Price) * parseFloat(foodItem.FoodItemDiscount)) / 100;
            total -= discountAmount;
        }

        return total;
    };

    return {
        cartItems,
        totalAmount,
        totalActualAmount,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        addSingleItemToCart,
        setTotalAmount,
        setTotalActualAmount

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
