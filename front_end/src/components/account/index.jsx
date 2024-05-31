// Description: This file contains the code for the account page

// import dependencies
import { useContext } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

// import user context
import { UserContext } from "../../context/UserProvider";

// import styles
import "./index.scss";

// import icons
import { FiMail, FiLock, FiUser, FiMapPin, FiPhone } from "react-icons/fi";

// validation rules
const validationRules = {
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "❌",
    },
  },
};

function LabelInput({ name, type, value, icon, ...rest }) {
  const { register, errors } = useFormContext();

  const hasError = name in errors;

  return (
    <>
      <div className="login__container__form__group__icon">{icon}</div>
      <div className="login__container__form__group__line"></div>
      <div className="login__container__form__group__input">
        <input
          {...register(name, validationRules[name])}
          type={type}
          className="input"
          disabled={true}
          autoComplete="off"
          value={value}
          {...rest}
        />
      </div>
      {hasError && (
        <div
          className="login__container__form__group__error"
          data-cy="login-error"
        >
          {errors[name].message}
        </div>
      )}
    </>
  );
}

// account page
const Account = () => {
  const { user } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    reset();
  };

  return (
    <div className="account-page" data-cy="account-page-overview">
      <FormProvider {...{ register, handleSubmit, errors }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="account-page__form grid"
        >
          <div className="account-page__form__group">
            <LabelInput
              name="firstname"
              type="text"
              value={user.firstname}
              icon={<FiUser />}
              data-cy="profile-firstname"
            />
          </div>
          <div className="account-page__form__group">
            <LabelInput
              name="lastname"
              type="text"
              value={user.lastname}
              icon={<FiUser />}
              data-cy="profile-lastname"
            />
          </div>
          <div className="account-page__form__group">
            <LabelInput
              name="email"
              type="text"
              value={user.email}
              disabled={true}
              icon={<FiMail />}
              data-cy="profile-email"
            />
          </div>
          <div className="account-page__form__group">
            <LabelInput name="password" type="password" icon={<FiLock />} />
          </div>
          <div className="account-page__form__group">
            <LabelInput
              name="street"
              type="text"
              value={user.street}
              icon={<FiMapPin />}
              data-cy="profile-street"
            />
          </div>
          <div className="account-page__form__group">
            <LabelInput
              name="addressNumber"
              type="text"
              value={user.addressNumber}
              icon={<FiMapPin />}
              data-cy="profile-addressNumber"
            />
          </div>
          <div className="account-page__form__group">
            <LabelInput
              name="city"
              type="text"
              value={user.city}
              icon={<FiMapPin />}
              data-cy="profile-city"
            />
          </div>
          <div className="account-page__form__group">
            <LabelInput
              name="postalCode"
              type="text"
              value={user.postalCode}
              icon={<FiMapPin />}
              data-cy="profile-postalCode"
            />
          </div>
          <div className="account-page__form__group">
            <LabelInput
              name="telNumber"
              type="text"
              value={user.telNumber}
              icon={<FiPhone />}
              data-cy="profile-telNumber"
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Account;
