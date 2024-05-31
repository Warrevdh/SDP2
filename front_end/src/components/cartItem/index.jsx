import { FiPlus, FiMinus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";

import { useState, useContext } from "react";

import { ShoppingCartContext } from '../../context/ShoppingCartProvider';

import "./index.scss";

function Comma(x) {
  return x.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

function CartItem({ item, onIncrement, onDecrement, onDelete }) {
  const { currency } = useContext(ShoppingCartContext);
  const [quantity, setQuantity] = useState(item.quantity);
  
  const onQuantityIncrement = () => {
    onIncrement(item, 1);
    setQuantity(quantity + 1);
  };

  const onQuantityDecrement = () => {
    onDecrement(item, 1);
    if (quantity === 1) {
      return;
    }
    setQuantity(quantity - 1);
  };

  const price = item.prices.find((price) => price.currencyId === currency.value).price;

  const onItemDelete = () => {
    onDelete(item);
  };
  return(
  <div className="shoppingcart__content__product" data-cy="cart-item">
    <div className="shoppingcart__content__product__image">
      <img src="https://picsum.photos/1000/1000" alt="productImg" data-cy="cart-item-image"/>
    </div>
    <div className="shoppingcart__content__product__content grid">
      <div className="shoppingcart__content__product__content__info">
        <div className="shoppingcart__content__product__content__info__name">
          <Link to={`/productPage/${item.productId}`} data-cy="product-link">
            {item.name}
          </Link>
        </div>
        <div className="shoppingcart__content__product__content__info__company">
          {item.fromCompany}
        </div>
      </div>
      <div className="shoppingcart__content__product__content__amount">
        <div
          className="shoppingcart__content__product__content__amount__minus"
          onClick={onQuantityDecrement} data-cy="decrement"
        >
          <FiMinus />
        </div>
        <div className="shoppingcart__content__product__content__amount__number" data-cy="quantity">
          {quantity}
        </div>
        <div
          className="shoppingcart__content__product__content__amount__plus"
          onClick={onQuantityIncrement} data-cy="increment"
        >
          <FiPlus />
        </div>
      </div>
      <div className="shoppingcart__content__product__content__price grid">
        <div className="shoppingcart__content__product__content__price__pc">
            {currency.symbol} {Comma(price)} <span>/piece</span>
        </div>
        <div className="shoppingcart__content__product__content__price__total">
          <span>{currency.symbol} {Comma(price * quantity)}</span>
        </div>
      </div>
      <div className="shoppingcart__content__product__content__delete">
        <FiTrash onClick={onItemDelete} data-cy="delete-cart-item"/>
      </div>
    </div>
  </div>);
}

export default CartItem;
