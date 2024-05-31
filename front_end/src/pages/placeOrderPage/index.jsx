import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import ReactFlagsSelect from "react-flags-select";

import { ShoppingCartContext } from "../../context/ShoppingCartProvider";
import { UserContext } from "../../context/UserProvider";

import PackagingPage from "../packagingPage";

import { getAllActiveTransport } from "../../api/transportservice";

import {
  FiChevronLeft,
  FiMapPin,
  FiHash,
  FiMap,
  FiCompass,
} from "react-icons/fi";

import "./index.scss";

// validation rules
const validationRules = {
  address: {
    required: "Address is required",
    minLength: {
      value: 3,
      message: "Address must be at least 3 characters long",
    },
    maxLength: {
      value: 75,
      message: "Address must be at most 75 characters long",
    },
  },

  addressNumber: {
    required: "The address number is required",
    minLength: {
      value: 1,
      message: "Address number must be at least 1 characters long",
    },
    maxLength: {
      value: 10,
      message: "Addres number must be at most 10 characters long",
    },
  },

  postalCode: {
    required: "The postalcode is required",
    minLength: {
      value: 3,
      message: "postal code musth be at least 3 characters long",
    },
    maxLength: {
      value: 10,
      message: "postal code must be at most 10 characters long",
    },
  },

  country: {
    required: "Country is required",
  },

  Postbus: {
    required: false,
    minLength: {
      value: 1,
      message: "Postbus must be at least 1 characters long",
    },
    maxLength: {
      value: 4,
      message: "Postbus must be at most 4 characters long",
    },
  },
};

function Labelinput({ name, type, label, icon, isInvalid, ...rest }) {
  const { register, isSubmitting } = useFormContext();

  return (
    <div
      className={`place-order__container__form__group ${
        isInvalid ? "invalid" : ""
      }`}
    >
      <div className="place-order__container__form__group__icon">{icon}</div>
      <div className="place-order__container__form__group__line"></div>
      <div className="place-order__container__form__group__input">
        <input
          {...register(name, validationRules[name])}
          type={type}
          className="input"
          disabled={isSubmitting}
          autoComplete="off"
          {...rest}
        />
        <label htmlFor="#">{label}</label>
      </div>
    </div>
  );
}

//bestellingPage
const PlaceOrderPage = () => {
  const { cartItems } = useContext(ShoppingCartContext);
  const { user } = useContext(UserContext);
  const [selected, setSelected] = useState("");
  const [order, setOrder] = useState({});
  const [packaging, setPackaging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setOrder({
      orderStreet: data.street,
      orderAddressNumber: data.addressNumber,
      orderCity: data.city,
      orderPostalCode: data.postalCode,
      orderCountry: selected,
      // postbus: data.postbus,
      companyId: user.companyId,
    });
    try {
      const activeTransport = await getAllActiveTransport();
      if (activeTransport.length === 0) {
        setErrorMessage("No active transport");
      } else {
        setPackaging(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="place-order flex">
        <div className="place-order__empty flex">
          <span>There are no items in your shopping cart</span>
          <Link to="/">Go to products</Link>
        </div>
      </div>
    );
  }
  const handlePackaging = () => {
    setPackaging(false);
  };
  if (packaging) {
    return <PackagingPage onChange={handlePackaging} order={order} />;
  }
  return (
    <div className="place-order flex">
      <div className="place-order__button">
        <Link to="/shoppingcart" className="flex">
          <FiChevronLeft />
          <button className="place-order__button__back">Back</button>
        </Link>
      </div>
      <div className="place-order__container">
        <FormProvider {...{ register, handleSubmit, errors }}>
          <form
            className="place-order__container__form grid"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Labelinput
              name="street"
              type="text"
              label="Street"
              icon={<FiMap />}
              isInvalid={errors.address}
              required
            />
            <Labelinput
              name="addressNumber"
              type="text"
              label="Nr."
              icon={<FiHash />}
              isInvalid={errors.address}
              required
            />
            <Labelinput
              name="city"
              type="text"
              label="City"
              icon={<FiCompass />}
              isInvalid={errors.postalCode}
              required
            />
            <Labelinput
              name="postalCode"
              type="text"
              label="Postal Code"
              icon={<FiMapPin />}
              isInvalid={errors.postalCode}
              required
            />
            <ReactFlagsSelect
              className="place-order__container__form__group__country"
              id="country"
              selected={selected}
              onSelect={(code) => setSelected(code)}
              searchable={true}
              searchPlaceholder="Search for a country"
            />

            <div className="place-order__container__form__submit">
              <button
                className="place-order__container__form__submit__button"
                type="submit"
                disabled={isSubmitting}
                data-cy="place-order-submit"
              >
                <span>Next</span>
              </button>
            </div>
          </form>
        </FormProvider>
        {errorMessage && (
          <span className="place-order__container__error">{errorMessage}</span>
        )}
      </div>
    </div>
  );
};
export default PlaceOrderPage;
