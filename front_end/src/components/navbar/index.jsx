// Description: Navbar component

// Import dependencies
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

// Import styles
import "./index.scss";

// Import icons
import { FiUser, FiShoppingCart, FiShoppingBag } from "react-icons/fi";

import { ShoppingCartContext } from "../../context/ShoppingCartProvider";

const userNotification = false;

const options = [
  { value: "EU", label: "EUR" },
  { value: "USD", label: "USD" },
];

// Navbar component
const Navbar = () => {
  const { cartItems, currency, changeCurrency } =
    useContext(ShoppingCartContext);

  const cartItemsCount = cartItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  const [value, setValue] = useState(currency.value);

  const handleCurrencyChange = (data) => {
    changeCurrency(data.value, data.label);
    setValue(data.value);
  };

  return (
    <div className="navbar grid" data-cy="navbar">
      <div className="navbar__logo" data-cy="navbar-logo">
        <Link to="https://www.delaware.pro/">delaware</Link>
      </div>
      <div className="navbar__links" data-cy="navbar-links">
        <Link to="/" className="navbar__link" data-cy="navbar-link-products">
          <div className="navbar__link__icon">
            <FiShoppingBag />
          </div>
          <div className="navbar__link__text">Products</div>
        </Link>
        <Link to="/profile" className="navbar__link" data-cy="navbar-link-user">
          <div className="navbar__link__icon">
            <div
              className="navbar__link__icon__notification"
              id="user-notification"
              style={
                userNotification ? { display: "flex" } : { display: "none" }
              }
            >
              {1}
            </div>
            <FiUser />
          </div>
          <div className="navbar__link__text">Profile</div>
        </Link>
        <Link
          to="/shoppingcart"
          className="navbar__link"
          data-cy="navbar-link-cart"
        >
          <div className="navbar__link__icon">
            <div
              className="navbar__link__icon__notification"
              id="cart-notification"
              style={
                cartItemsCount > 0 ? { display: "flex" } : { display: "none" }
              }
            >
              {cartItemsCount}
            </div>
            <FiShoppingCart />
          </div>
          <div className="navbar__link__text">Cart</div>
        </Link>
        <Select
          styles={{
            option: (baseStyles, state) => ({
              ...baseStyles,
              color: "black",
            }),
          }}
          options={options}
          defaulValue={value}
          placeholder={currency.label}
          isSearchable
          onChange={handleCurrencyChange}
        />
      </div>
    </div>
  );
};

export default Navbar;
