//feature: SingleProductPage - making of a SingleProductPage page

//import of the dependencies
import { useEffect, useState, useCallback, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";

//import mockdata
import { useParams } from "react-router-dom";
import "./index.scss";

//import useProducts from "../../api/products";
import * as productsApi from "../../api/products";

import NotFound from "../../components/notfound";
import Loader from "../../components/loader";
import Error from "../../components/error";

import { ShoppingCartContext } from '../../context/ShoppingCartProvider';

function Comma(x) {
  //x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return x.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

// make a productPage and GET productid corresponding with the id in mock data products from url
function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  //const productsApi = useProducts();

  const notify = () => toast.info("Item added to the cart!");

  const { addItemToCart, currency } = useContext(ShoppingCartContext);

  const { productId } = useParams();

  const refreshProduct = useCallback(async () => {
    try {
      setLoading(true);
      const productFound = await productsApi.getProductById(productId);
      setProduct(productFound);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    refreshProduct();
  }, [refreshProduct]);

  const handleQuantityChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue >= 1){
      setQuantity(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = quantity + 1;
      setQuantity(newValue);
  };

  const handleDecrement = () => {
    const newValue = quantity - 1;
    if (newValue >= 1) {
      setQuantity(newValue);
    }
  };

  const getDeliveryTimeLabel = (deliveryTime) => {
    if (typeof deliveryTime !== "string" || deliveryTime.length === 0) {
      return "Unknown";
    }
    const unit = deliveryTime.charAt(deliveryTime.length - 1).toLowerCase();
    const value = parseInt(deliveryTime.slice(0, -1));
    let label;

    switch (unit) {
      case "d":
        label = value === 1 ? "Day" : "Days";
        break;
      case "w":
        label = value === 1 ? "Week" : "Weeks";
        break;
      case "m":
        label = value === 1 ? "Month" : "Months";
        break;
      default:
        label = "Unknown";
    }

    return `${value} ${label}`;
  }

  const price = product.prices ? product.prices.find((price) => price.currencyId === currency.value).price : 0;

  // add to cart and local storage
  const addToCart = (product) => {
    addItemToCart(product, quantity);
    notify();
  };

  if (!product) {
    return <NotFound />;
  }

  return (
    <div className="productPage grid">
      <div className="productPage__image">
        <img src="https://picsum.photos/1000/1000" alt={product.name} data-cy="product-image"/>
      </div>
      <div className="productPage__content">
        <div className="productPage__content">
          <div className="productPage__content__header">
            <div className="productPage__content__header__title">
              <h3 data-cy="product-name">{product.name}</h3>
              <p className="productPage__content__header__sub" data-cy="product-company">
                {product.fromCompany}
              </p>
            </div>
            <p className="productPage__content__header__stock" data-cy="product-stock">
              Items: {product.amountInStock}
            </p>
          </div>
          <div className="productPage__content__body">
            <p className="productPage__content__body__description" data-cy="product-longDesc">
              {product.productLongDescription}
            </p>
            <p className="productPage__content__body__etd" data-cy="product-delivery">
              Estimated delivery time: {getDeliveryTimeLabel(product.deliveryTime)}
            </p>
          </div>

          <hr />

          <div className="productPage__content__footer">
            <p className="productPage__content__footer__price" data-cy="product-price">
              {currency.symbol} {Comma(price)}
            </p>
            <div className="productPage__content__footer__buttons">
              <div className="productPage__content__footer__buttons__quantity">
                <input
                  type="number"
                  className="quantity-input"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  max={product.amountInStock}
                />
                <div className="quantity-nav">
                  <div
                    className="quantity-button quantity-up"
                    onClick={handleIncrement}
                  >
                    <FiPlus />
                  </div>
                  <div
                    className="quantity-button quantity-down"
                    onClick={handleDecrement}
                  >
                    <FiMinus />
                  </div>
                </div>
              </div>
              <button onClick={() => addToCart(product)} data-cy="button-addToCart">
                <span>Add to cart</span> <span><FiShoppingCart/></span>
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
      <Loader loading={loading} />
      <Error error={error}/>
    </div>
  );
}

//export
export default ProductPage;
