//feature: shoppingcartOverview - making of a shoppingcartOverview page

// import of the scss
import "./index.scss";

//import of the dependencies
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

//import of the components
import CartItem from "../../components/cartItem";

import { ShoppingCartContext } from "../../context/ShoppingCartProvider";

function SummeryItem({ item }) {
  return (
    <div>
      <span data-cy="summary-item">
        {item.quantity}x {item.name}
      </span>
    </div>
  );
}

//scheiden duizendtallen met spatie, 2 decimalen
function Comma(x) {
  //x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return x.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

function SummeryItemPrice({ item }) {
  const { currency } = useContext(ShoppingCartContext);

  const price = item.prices.find(
    (price) => price.currencyId === currency.value
  ).price;

  return (
    <div className="shoppingcart__totalprice__content__table__price grid">
      <div className="shoppingcart__totalprice__content__table__price__currency__2 grid">
        {currency.symbol}
      </div>
      <div className="shoppingcart__totalprice__content__table__price__value__2 grid">
        {Comma(item.quantity * price)}
      </div>
    </div>
  );
}

//render cart
function RenderCart() {
  const [deliveryTime, setDeliveryTime] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const {
    cartItems,
    removeItemFromCart,
    decreaseItemQuantity,
    increaseItemQuantity,
    currency,
    clearCart,
  } = useContext(ShoppingCartContext);

  //Count total quantity
  const countTotalQuantity = (cart) => {
    let total = 0;
    cart.forEach((item) => {
      total += item.quantity;
    });
    return total;
  };

  const longestDeliveryTime = (cart) => {
    const deliveryTimes = cart.map((product) => product.deliveryTime);
    const longestDeliveryTime = deliveryTimes.reduce(
      (max, time) => {
        if (typeof time !== "string" || time.length === 0) {
          return max;
        }
        const value = parseInt(time);
        const unit = time.charAt(time.length - 1).toLowerCase();
        if (isNaN(value) || (unit !== "d" && unit !== "m" && unit !== "w")) {
          return max;
        }

        if (unit === "w" || unit === "m") {
          const days = unit === "w" ? value * 7 : value * 30;
          return days > max.days ? { days, label: unit } : max;
        } else if (unit === "d" && value > max.days) {
          return { days: value, label: unit };
        } else {
          return max;
        }
      },
      { days: 0, label: "d" }
    );

    const { days, label } = longestDeliveryTime;

    switch (label) {
      case "d":
        return `${days} Day${days > 1 ? "s" : days === 0 ? "s" : ""}`;
      case "w":
        const weeks = Math.floor(days / 7);
        return `${weeks} Week${weeks > 1 ? "s" : ""}`;
      case "m":
        const months = Math.floor(days / 30);
        return `${months} Month${months > 1 ? "s" : ""}`;
      default:
        return "";
    }
  };

  useEffect(() => {
    const deliveryTime = longestDeliveryTime(cartItems);
    setDeliveryTime(deliveryTime);
    setTotalItems(countTotalQuantity(cartItems));
  }, [cartItems, totalItems]);

  //Remove product from cart
  const handleRemoveFromCart = (product) => {
    removeItemFromCart(product);
  };

  //Increment quantity
  const handleIncrement = (product, value) => {
    increaseItemQuantity(product, value);
  };

  //Decrement quantity
  const handleDecrement = (product, value) => {
    decreaseItemQuantity(product, value);
  };

  //Items total price
  const itemsTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      const price = item.prices.find(
        (price) => price.currencyId === currency.value
      ).price;
      total += price * item.quantity;
    });
    return total;
  };

  //Tax
  const tax = (tax) => {
    let total = 0;
    cartItems.forEach((item) => {
      const price = item.prices.find(
        (price) => price.currencyId === currency.value
      ).price;
      total += price * item.quantity;
    });
    return (total * tax);
  };

  //Total price
  const totalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      const price = item.prices.find(
        (price) => price.currencyId === currency.value
      ).price;
      total += price * item.quantity;
    });
    const totalTax = +tax(0.21);

    return (total + totalTax);
  };

  return (
    <>
      <div className="shoppingcart__header">
        <h1 className="shoppingcart__header__title">Your Shopping Cart</h1>
      </div>
      <div className="content-container grid">
        <div className="shoppingcart__content">
          <div className="shoppingcart__content__body">
            {cartItems.length > 0 ? (
              cartItems.map((product) => {
                return (
                  <CartItem
                    key={product.productId}
                    item={product}
                    onDecrement={handleDecrement}
                    onIncrement={handleIncrement}
                    onDelete={handleRemoveFromCart}
                  />
                );
              })
            ) : (
              <div className="shoppingcart__content__empty" data-cy="empty-shoppingcart">
                The shoppingcart doesn't contain any products
              </div>
            )}
          </div>
        </div>
        <div className="shoppingcart__totalprice grid">
          <div className="shoppingcart__totalprice__title">Summary</div>
          <div className="shoppingcart__totalprice__content grid">
            <div className="shoppingcart__totalprice__content__products grid">
              <div className="shoppingcart__totalprice__content__products__text">
                <span>Products:</span>
              </div>
              <div className="shoppingcart__totalprice__content__products__items">
                <span data-cy="total-products">{totalItems}</span>
              </div>
              <div className="shoppingcart__totalprice__content__products__text2">
                <span>
                  {cartItems.map((item) => {
                    return <SummeryItem key={item.productId} item={item} />;
                  })}
                </span>
              </div>
              <div className="shoppingcart__totalprice__content__products__items2">
                <span>
                  {cartItems.map((item) => {
                    return (
                      <SummeryItemPrice key={item.productId} item={item} />
                    );
                  })}
                </span>
              </div>
            </div>
            <hr />
            <div className="shoppingcart__totalprice__content__table grid">
              <div className="shoppingcart__totalprice__content__table__text">
                <div>
                  <span>Items total price:</span>
                </div>
                <div>
                  <span>Tax:</span>
                </div>
                <div>
                  <span>Shipping fees:</span>
                </div>
              </div>
              <div className="shoppingcart__totalprice__content__table__price grid">
                <div className="shoppingcart__totalprice__content__table__price__currency grid">
                  <span>{currency.symbol}</span>
                  <span>{currency.symbol}</span>
                  <span>{currency.symbol}</span>
                </div>
                <div className="shoppingcart__totalprice__content__table__price__value grid">
                  <span data-cy="items-total">{Comma(itemsTotal())}</span>
                  <span data-cy="items-tax">{Comma(tax(0.21))}</span>
                  <span data-cy="items-shipping-fees">0.00</span>
                </div>
              </div>
            </div>
            <hr />
            <div className="shoppingcart__totalprice__content__total grid">
              <div className="shoppingcart__totalprice__content__total__text">
                Total price:
              </div>
              <div className="shoppingcart__totalprice__content__total__price" data-cy="total-price">
                {currency.symbol} {Comma(totalPrice())}
              </div>
            </div>
          </div>
          <div className="shoppingcart__totalprice__button grid">
            
            <Link
              to="/placeOrder"
              className="shoppingcart__totalprice__button__checkout"
              data-cy="continue-button"
            >
              <span>Continue</span>
            </Link>
            <div className="shoppingcart__totalprice__button__clear" onClick={clearCart} data-cy="clear-cart">
                <span>
                  Clear shoppingcart
                </span>
            </div>
          </div>
          <div className="shoppingcart__totalprice__etd" data-cy="delivery-time">
            Estimated delivery time: {deliveryTime}
          </div>
        </div>
      </div>
    </>
  );
}
//shoppingcartOverview
const shoppingcartOverview = () => {
  return (
    <div className="shoppingcart grid">
      <RenderCart />
    </div>
  );
};

//export
export default shoppingcartOverview;
