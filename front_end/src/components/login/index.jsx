// Description: Login component

//import dependencies
import { useState, useContext } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

// import styles
import "./index.scss";

// import icons
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

// import user context
import { UserContext } from "../../context/UserProvider";

// import components
import Loader from "../loader";

// validation rules
const validationRules = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
};

function LabelInput({ name, type, label, icon, isInvalid, ...rest }) {
  const { register, isSubmitting } = useFormContext();
  const [passwordShown, setPasswordShown] = useState(false);

  const handlePasswordToggle = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div
      className={`login__container__form__group ${isInvalid ? "invalid" : ""}`}
    >
      <div className="login__container__form__group__icon">{icon}</div>
      <div className="login__container__form__group__line"></div>
      <div className="login__container__form__group__input">
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

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await login(data);
      if (response instanceof Error) {
        throw new Error("Incorrect email or password");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
    reset();
  };
  return (
    <div className="login">
      <div className="login__container">
        <FormProvider {...{ register, handleSubmit, errors }}>
          <form
            className="login__container__form grid"
            onSubmit={handleSubmit(onSubmit)}
          >
            <LabelInput
              name="email"
              icon={<FiMail />}
              type="text"
              label={errors.email ? errors["email"].message : "Email Address"}
              isInvalid={errors.email}
              data-cy="login-email"
              required
            />
            <LabelInput
              name="password"
              icon={<FiLock />}
              type="password"
              label={errors.password ? errors["password"].message : "Password"}
              isInvalid={errors.password}
              data-cy="login-password"
              required
            />

            <div className="login__container__form__submit">
              <button
                type="submit"
                disabled={isSubmitting}
                className="login__container__form__submit__button"
                data-cy="login-submit"
              >
                <span>Sign in</span>
              </button>
            </div>
          </form>
        </FormProvider>
        {errorMessage && (
          <div className="login__container__form__error">{errorMessage}</div>
        )}
      </div>
      <Loader loading={loading} />
    </div>
  );
};

export default Login;
