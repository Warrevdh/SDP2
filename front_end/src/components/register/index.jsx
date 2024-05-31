// Description: Register component

// import dependencies
import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

// import styles
import "./index.scss";

// import api
import useUsers from "../../api/users.js";

// import icons
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

// import components
import Loader from "../loader";

// validation rules
const validationRules = {
  fname: {
    required: "Name is required",
  },
  lname: {
    required: "Name is required",
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long",
    },
  },
  confirmPassword: {
    required: "Repeat password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long",
    },
  },
  phone: {
    required: "Phone number is required",
    minLength: {
      value: 8,
      message: "Phone number must be at least 8 characters long",
    },
  },
  tel: {
    required: "Phone number is required",
    minLength: {
      value: 8,
      message: "Phone number must be at least 8 characters long",
    },
  },
  country: {
    required: "Country is required",
  },
  city: {
    required: "City is required",
  },
  pcode: {
    required: "Postal code is required",
  },
  nr: {
    required: "Nr. is required",
  },
  address: {
    required: "Address is required",
  },
};

function LabelInput({ name, type, label, icon, line, isInvalid, id, ...rest }) {
  const { register, isSubmitting } = useFormContext();

  const [passwordShown, setPasswordShown] = useState(false);

  const handlePasswordToggle = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div
      className={`login__container__form__group ${isInvalid ? "invalid" : ""} ${
        id ? id : ""
      }`}
    >
      <div className="register__container__form__group__icon">{icon}</div>
      {line ? (
        <div className="register__container__form__group__line"></div>
      ) : (
        ""
      )}
      <div className="register__container__form__group__input">
        <input
          {...register(name, validationRules[name])}
          type={
            type === "password" ? (passwordShown ? "text" : "password") : type
          }
          className="input"
          disabled={isSubmitting}
          autoComplete="off"
          {...rest}
        />
        <label htmlFor="#">{label}</label>
      </div>
      {type === "password" && (
        <div
          className="login__container__form__group__icon eye"
          onClick={handlePasswordToggle}
        >
          {passwordShown ? <FiEyeOff /> : <FiEye />}
        </div>
      )}
    </div>
  );
}

const Register = ({ onRegisterSucces }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const usersApi = useUsers();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const passwordsMatch = password === confirmPassword;

  const onSubmit = async (data) => {
    const {
      fname,
      lname,
      email,
      confirmPassword,
      phoneNumber,
      telNumber,
      city,
      street,
      addressNumber,
      postalCode,
    } = data;
    try {
      setLoading(true);
      const userData = await usersApi.registerUser({
        firstname: fname,
        lastname: lname,
        email,
        password: confirmPassword,
        city,
        telNumber,
        phoneNumber,
        street,
        addressNumber,
        postalCode,
        country: selected,
      });
      onRegisterSucces(userData);
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <FormProvider {...{ register, handleSubmit, errors }}>
          <form
            className="register__container__form grid"
            onSubmit={handleSubmit(onSubmit)}
          >
            <LabelInput
              name="fname"
              type="text"
              label={errors.fname ? errors["fname"].message : "First name"}
              icon={<FiUser />}
              line={true}
              isInvalid={errors.fname}
              data-cy="register-fname"
              required
            />
            <LabelInput
              name="lname"
              icon={<FiUser />}
              type="text"
              line={true}
              label={errors.lname ? errors["lname"].message : "Last name"}
              isInvalid={errors.lname}
              data-cy="register-lname"
              required
            />
            <LabelInput
              name="email"
              icon={<FiMail />}
              type="text"
              line={true}
              label={errors.email ? errors["email"].message : "Email Address"}
              isInvalid={errors.email}
              data-cy="register-email"
              required
            />
            <LabelInput
              name="password"
              icon={<FiLock />}
              type="password"
              line={true}
              label={errors.password ? errors["password"].message : "Password"}
              isInvalid={errors.password}
              data-cy="register-password"
              required
            />
            <LabelInput
              name="confirmPassword"
              icon={<FiLock />}
              type="password"
              line={true}
              label={
                !passwordsMatch
                  ? "Passwords don't match"
                  : errors.confirmPassword
                  ? errors["confirmPassword"].message
                  : "Confirm Password"
              }
              isInvalid={errors.confirmPassword}
              data-cy="register-password"
              required
            />
            <div className="register__container__form__double">
              <LabelInput
                name="street"
                icon={<FiMapPin />}
                type="text"
                line={true}
                label={errors.street ? errors["street"].message : "Street"}
                isInvalid={errors.street}
                data-cy="register-street"
                id="address"
                required
              />
              <LabelInput
                name="addressNumber"
                type="text"
                id="nr"
                label={
                  errors.addressNumber ? errors["addressNumber"].message : "Nr."
                }
                isInvalid={errors.addressNumber}
                data-cy="register-addressNumber"
                required
              />
            </div>
            <div className="register__container__form__double">
              <LabelInput
                name="city"
                icon={<FiMapPin />}
                type="text"
                line={true}
                label={errors.city ? errors["city"].message : "City"}
                isInvalid={errors.city}
                data-cy="register-city"
                id="city"
                required
              />
              <LabelInput
                name="postalCode"
                type="text"
                label={
                  errors.postalCode
                    ? errors["postalCode"].message
                    : "Postal Code"
                }
                isInvalid={errors.postalCode}
                data-cy="register-postalCode"
                id="nr"
                required
              />
            </div>

            <ReactFlagsSelect
              className="register__container__form__group__country"
              selected={selected}
              onSelect={(code) => setSelected(code)}
              searchable={true}
              data-cy="register-country"
            />
            <LabelInput
              name="phone"
              icon={<FiPhone />}
              type="text"
              line={true}
              label={errors.phone ? errors["phone"].message : "Phone Number"}
              isInvalid={errors.phone}
              data-cy="register-phone"
              required
            />
            <LabelInput
              name="tel"
              icon={<FiPhone />}
              type="text"
              line={true}
              label={errors.tel ? errors["tel"].message : "Tel Number"}
              isInvalid={errors.tel}
              data-cy="register-tel"
              required
            />
            <div className="register__container__form__submit">
              <button
                className="register__container__form__submit__button"
                type="submit"
                disabled={isSubmitting}
                data-cy="register-submit"
              >
                <span>Sign up</span>
              </button>
            </div>
          </form>
        </FormProvider>
        {errorMessage && (
          <div className="register__container__form__error">{errorMessage}</div>
        )}
      </div>
      <Loader loading={loading} />
    </div>
  );
};

export default Register;
