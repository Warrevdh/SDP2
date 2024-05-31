// Description: This page will show the order list of the user

// import dependencies
import { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";

//import icons
import { FiCopy, FiChevronLeft } from "react-icons/fi";

//import components
import Order from "../../components/order";
import Error from "../../components/error";
import Loader from "../../components/loader";

// import services
import { getAllOrders } from "../../api/orders";

// import styles
import "./index.scss";

// import user context
import { UserContext } from "../../context/UserProvider";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isCopiedTrackTrace, setIsCopiedTrackTrace] = useState(false);
  const [isCopiedVerificationCode, setIsCopiedVerificationCode] =
    useState(false);
  let humanReadableDate = null;
  if (orderDetails) {
    humanReadableDate = new Date(orderDetails.orderDate).toLocaleString();
  }

  const { user, userToken } = useContext(UserContext);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllOrders(user.companyId, userToken);
      setOrders(response);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [userToken, user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const showDetails = useCallback((order) => {
    setOrderDetails(order);
  }, []);

  const handleCopyTrackTraceCode = () => {
    copyToClipboard(orderDetails.trackTraceCode);
    console.log(orderDetails.trackTraceCode);
    setIsCopiedTrackTrace(true);
  };

  const handleCopyVerificationCode = () => {
    const verificationCode =
      orderDetails.Track_Trace.verificationCode === "postcode"
        ? orderDetails.orderPostalCode
        : orderDetails.Track_Trace.verificationCode === "orderid"
        ? orderDetails.orderId
        : null;
    copyToClipboard(verificationCode);
    setIsCopiedVerificationCode(true);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  const succesTimeout = 3000;

  useEffect(() => {
    let timeoutId;
    if (isCopiedTrackTrace) {
      timeoutId = setTimeout(() => {
        setIsCopiedTrackTrace(false);
      }, succesTimeout);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCopiedTrackTrace]);

  useEffect(() => {
    let timeoutId;
    if (isCopiedVerificationCode) {
      timeoutId = setTimeout(() => {
        setIsCopiedVerificationCode(false);
      }, succesTimeout);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCopiedVerificationCode]);

  const OrderDetails = () => {
    return (
      <>
        <div className="orderD">
          <button className="back" onClick={() => setOrderDetails(null)}>
            <FiChevronLeft /> Back
          </button>
          <div className="orderD__header">
            <h2 className="orderD__header__title">
              Order #{orderDetails.orderId}
            </h2>
          </div>
          <div className="orderD__body">
            <div className="orderD__body__item">
              <h3 className="orderD__body__item__title">Order date</h3>
              <p className="orderD__body__item__text">{humanReadableDate}</p>
            </div>
            <div className="orderD__body__item">
              <h3 className="orderD__body__item__title">Order status</h3>
              <p className="orderD__body__item__text__status">
                {orderDetails.status}
              </p>
            </div>

            <div className="orderD__body__item">
              <h3 className="orderD__body__item__title">Company: </h3>
              <p className="orderD__body__item__text">
                {orderDetails.Company.name}
              </p>
            </div>
            <div className="orderD__body__item">
              <h3 className="orderD__body__item__title">Country: </h3>
              <p className="orderD_body__item__text">
                {orderDetails.orderCountry}
              </p>
            </div>
            <div className="orderD__body__item">
              <h3 className="orderD__body__item__title">City: </h3>
              <p className="orderD__body__item__text">
                {orderDetails.orderCity}
              </p>
            </div>
            <div className="orderD__body__item">
              <h3 className="orderD__body__item__title">Street: </h3>
              <p className="orderD__body__item__text">
                {orderDetails.orderStreet}
              </p>
            </div>
            <div className="orderD__body__item">
              <h3 className="orderD__body__item__title">Number: </h3>
              <p className="orderD__body__item__text">
                {orderDetails.orderAddressNumber}
              </p>
            </div>
            <div className="orderD__body__item">
              <h3 className="orderD__body__item__title">Date: </h3>
              <p className="orderD__body__item__text">
                {new Date(orderDetails.orderDate).toLocaleString()}
              </p>
            </div>
            {orderDetails.Track_Trace && (
              <div>
                <div className="orderD__body__item">
                  <h3 className="orderD__body__item__title">Track & Trace: </h3>
                  <p
                    className="orderD__body__item__text__trace"
                    onClick={handleCopyTrackTraceCode}
                  >
                    <span>
                      {orderDetails.trackTraceCode} <FiCopy />
                    </span>
                  </p>
                  {isCopiedTrackTrace && (
                    <p style={{ color: "green" }}>Code copied to clipboard!</p>
                  )}
                </div>
                <div className="orderD__body__item">
                  <h3 className="orderD__body__item__title">
                    Verification code:{" "}
                  </h3>
                  <p
                    className="orderD__body__item__text__trace"
                    onClick={handleCopyVerificationCode}
                  >
                    <span>
                      {orderDetails.Track_Trace.verificationCode === "postcode"
                        ? orderDetails.orderPostalCode
                        : orderDetails.Track_Trace.verificationCode ===
                          "orderid"
                        ? orderDetails.orderId
                        : null}{" "}
                      <FiCopy />
                    </span>
                  </p>
                  {isCopiedVerificationCode && (
                    <p style={{ color: "green" }}>Code copied to clipboard!</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="orderD__pList">
            <h3 className="orderD__pList__item__title">Products: </h3>
            <ul className="orderD__pList__item__text__pList">
              {orderDetails.products.map((product) => {
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
                              <Link
                                to={`/productPage/${product.Product.productId}`}
                                data-cy="product_link"
                              >
                                {product.Product.name}
                              </Link>
                            </h3>
                            <p className="product__content__text__header__title__sub">
                              {product.Product.fromCompany}
                            </p>
                          </div>
                          <p
                            className="product__content__text__header__stock"
                            data-cy="product_stock"
                          >
                            Items: {product.quantity}
                          </p>
                        </div>
                        <div className="product__content__text__body">
                          <p
                            className="product__content__text__body__description"
                            data-cy="product_description"
                          >
                            {product.Product.productShortDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {orderDetails ? (
        <OrderDetails />
      ) : (
        <div className="orderList">
          {orders.map((order) => {
            return (
              <Order
                key={order.orderId}
                order={order}
                showDetails={showDetails}
              />
            );
          })}
          <Loader loading={loading} />
          <Error error={error} />
        </div>
      )}
    </>
  );
};

export default OrderPage;
