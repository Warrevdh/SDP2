import "./index.scss";

import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ShoppingCartContext } from '../../../../context/ShoppingCartProvider';

function Comma(x) {
  return x.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

const Product = ({ product }) => {
  const notify = () => toast.info("Item added to the cart!");

  const { addItemToCart, currency } = useContext(ShoppingCartContext);

  const price = product.prices.find((price) => price.currencyId === currency.value).price;

  const handleAddToCartToggle = () => {
    addItemToCart(product, 1);
    notify();
  };
  return (
    
    <div className="product grid" id="product" data-cy="product">
      <div className="product__image" data-cy="product_image">
        <img src="https://picsum.photos/1000/1000" alt="" />
      </div>
      <div className="product__content">
        <div className="product__content__text">
          <div className="product__content__text__header">
            <div className="product__content__text__header__title">
              <h3 data-cy="product_name">
                <Link to={`/productPage/${product.productId}`} data-cy="product_link">{product.name}</Link>
              </h3>
              <p className="product__content__text__header__title__sub" data-cy="product_company">
                {product.fromCompany}
              </p>
            </div>
            <p
              className="product__content__text__header__stock"
              data-cy="product_stock"
            >
              Items: {product.amountInStock}
            </p>
          </div>
          <div className="product__content__text__body">
            <p
              className="product__content__text__body__description"
              data-cy="product_description"
            >
              {product.productShortDescription}
            </p>
          </div>
          <hr />
          <div className="product__content__text__footer">
            <p
              className="product__content__text__footer__price"
              data-cy="product_price"
            >
              {currency.symbol} {Comma(price)}
            </p>
            <div className="product__content__buttons">
              <button>
                <FiShoppingCart onClick={handleAddToCartToggle} data-cy="product_addCartButton"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Product;
