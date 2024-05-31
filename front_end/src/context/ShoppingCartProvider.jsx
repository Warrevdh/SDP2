import React, { createContext, useState, useEffect } from "react";

export const ShoppingCartContext = createContext();

const defaultCurrency = { value: "EU", symbol: "€", label: "EUR" };

const ShoppingCartProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    try {
      const storedCurrency = localStorage.getItem("preferredCurrency");
      return storedCurrency ? JSON.parse(storedCurrency) : defaultCurrency;
    } catch (error) {
      console.error("Error parsing stored currency: ", error);
      return defaultCurrency;
    }
  });
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = localStorage.getItem("cartItems");
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
      console.error("Error parsing stored cart items: ", error);
      return [];
    }
  });
  const [simplifiedCart, setSimplifiedCart] = useState([]);

  useEffect(() => {
    // Map over the cartItems array and create a new object for each item with the simplified properties
    const simplifiedItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price:
        item.quantity *
        item.prices.find((price) => price.currencyId === currency.value).price,
    }));

    // Set the simplifiedCart state variable to the new array of simplified items
    setSimplifiedCart(simplifiedItems);
  }, [cartItems, currency]);

  useEffect(() => {
    setCartItems(() => {
      try {
        const storedCartItems = localStorage.getItem("cartItems");
        return storedCartItems ? JSON.parse(storedCartItems) : [];
      } catch (error) {
        console.error("Error parsing stored cart items: ", error);
        return [];
      }
    });

    setCurrency(() => {
      try {
        const storedCurrency = localStorage.getItem("preferredCurrency");
        return storedCurrency ? JSON.parse(storedCurrency) : defaultCurrency;
      } catch (error) {
        console.error("Error parsing stored currency: ", error);
        return defaultCurrency;
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("preferredCurrency", JSON.stringify(currency));
  }, [cartItems, currency]);

  // - Change the currency
  const changeCurrency = (value, label) => {
    let symbol = "";
    switch (value) {
      case "EU":
        symbol = "€";
        break;
      case "USD":
        symbol = "$";
        break;
      case "GBP":
        symbol = "£";
        break;
      default:
        symbol = "€";
    }
    setCurrency({ value, symbol, label });
    localStorage.setItem(
      "preferredCurrency",
      JSON.stringify({ value, symbol, label })
    );
  };

  // - Add an item to the cart
  const addItemToCart = (product, quantity) => {
    const alreadyInCart = cartItems.find(
      (item) => item.productId === product.productId
    );

    if (alreadyInCart) {
      alreadyInCart.quantity += quantity;
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  const increaseItemQuantity = (product, quantity) => {
    const alreadyInCart = cartItems.find(
      (item) => item.productId === product.productId
    );

    if (alreadyInCart) {
      alreadyInCart.quantity += quantity;
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCartItems([...cartItems]);
  };

  // - Decrease the quantity of an item in the cart
  const decreaseItemQuantity = (product, quantity) => {
    const alreadyInCart = cartItems.find(
      (item) => item.productId === product.productId
    );

    if (alreadyInCart && alreadyInCart.quantity > 1) {
      alreadyInCart.quantity -= quantity;
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCartItems([...cartItems]);
  };

  // - Remove an item from the cart
  const removeItemFromCart = (item) => {
    const updatedCartItems = cartItems.filter(
      (cartItem) => cartItem.productId !== item.productId
    );
    setCartItems(updatedCartItems);
  };

  // - Clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeItemFromCart,
        clearCart,
        decreaseItemQuantity,
        currency,
        changeCurrency,
        increaseItemQuantity,
        simplifiedCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;
