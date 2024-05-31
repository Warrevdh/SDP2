import "./index.scss";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState, useEffect, useContext } from "react";

import { FiChevronLeft } from "react-icons/fi";

import { getAllpackages } from "../../api/packaging";

import { ShoppingCartContext } from "../../context/ShoppingCartProvider";
import { UserContext } from "../../context/UserProvider";

import Loader from "../../components/loader";
import Error from "../../components/error";

import { createOrder } from "../../api/orders";

const PackagingPage = ({ order, onChange }) => {
  const [packaging, setPackaging] = useState([]);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { currency, simplifiedCart, clearCart } =
    useContext(ShoppingCartContext);
  const { userToken } = useContext(UserContext);

  const notify = () => toast.info("Order placed!");

  useEffect(() => {
    const fetchPackaging = async () => {
      setLoading(true);
      try {
        const response = await getAllpackages();
        setPackaging(response);
        setSelectedPackaging(response[0]);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackaging();
  }, []);

  function handlePackagingChange(event) {
    const selectedPackagingId = event.target.value;
    const selectedPackaging = packaging.find(
      (packaging) => packaging.packageId === selectedPackagingId
    );
    setSelectedPackaging(selectedPackaging);
  }

  function isPackagingActiveForDelivery(packaging) {
    return !packaging.activeForDelivery;
  }

  async function handlePlaceOrder() {
    try {
      setLoading(true);
      await createOrder(
        {
          orderItems: simplifiedCart,
          companyId: order.companyId,
          orderAddressNumber: order.orderAddressNumber,
          orderCity: order.orderCity,
          orderCountry: order.orderCountry,
          orderPostalCode: order.orderPostalCode,
          orderStreet: order.orderStreet,
          packagingId: selectedPackaging.packageId,
        },
        userToken
      );
      notify();
    } catch (error) {
      setErrorMessage("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/";
        clearCart();
      }, 2000);
    }
  }

  const handleBackBtn = () => {
    onChange();
  };
  return (
    <div className="packagingPage flex">
      <button className="packagingPage__button flex" onClick={handleBackBtn}>
        <FiChevronLeft />
        <span className="packagingPage__button__back">Back</span>
      </button>
      <div className="packagingPage__container flex">
        <div className="packagingPage__container__title">
          <h2>Select a Packaging Method</h2>
        </div>
        <select value={selectedPackaging?.id} onChange={handlePackagingChange}>
          {packaging.map((method) => (
            <option
              key={method.id}
              value={method.packageId}
              disabled={isPackagingActiveForDelivery(method)}
            >
              {method.name}
            </option>
          ))}
        </select>
        <p className="packagingPage__container__type">
          Type: {selectedPackaging?.type}
        </p>
        <div className="packagingPage__container__dimensions grid">
          <div className="packagingPage__container__dimensions__symbol flex">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="13"
                height="13"
                rx="1"
                stroke="black"
                stroke-width="2"
              />
              <path
                d="M1 14H14"
                stroke="#EC4842"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="13"
                height="13"
                rx="1"
                stroke="black"
                stroke-width="2"
              />
              <path
                d="M1 14L1 1"
                stroke="#EC4842"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69752 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69752 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.27 6.96L12 12.01L20.73 6.96"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 22.08V12"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 17L11 21.5"
                stroke="#EC4842"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div className="packagingPage__container__dimensions__title flex">
            <p>Width:</p>
            <p>Height:</p>
            <p>Length:</p>
          </div>
          <div className="packagingPage__container__dimensions__value flex">
            <p>{selectedPackaging?.width} cm</p>
            <p>{selectedPackaging?.height} cm</p>
            <p>{selectedPackaging?.length} cm</p>
          </div>
        </div>
        <p className="packagingPage__container__price">
          {currency.symbol} {selectedPackaging?.price}
        </p>

        <button onClick={handlePlaceOrder}>Place Order</button>
        {errorMessage && (
          <p className="packagingPage__container__error">{errorMessage}</p>
        )}
      </div>
      <Loader loading={loading} />
      <Error error={error} />
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

export default PackagingPage;
