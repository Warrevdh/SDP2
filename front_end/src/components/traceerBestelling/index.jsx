// Description: traceerBestelling component

// Import dependencies
import { memo } from "react";
import { useState } from "react";
import { useForm, useFormContext, FormProvider } from "react-hook-form"; // 👈 1

// Import styles
import "./index.scss";

import { FiHash, FiChevronLeft } from "react-icons/fi";

import Loader from "../../components/loader";
import ProgressBar from "../../components/progressBar";

// import api
import useTrackTrace from "../../api/trackTrace";

const validationRules = {
  code: {
    required: "Track & Trace code is required",
  },
  verification: {
    required: "Verification code is required",
  },
};

function LabelInput({ name, type, label, icon, isInvalid, ...rest }) {
  const { register, isSubmitting } = useFormContext();

  return (
    <div
      className={`track-trace__container__form__group ${
        isInvalid ? "invalid" : ""
      }`}
    >
      <div className="track-trace__container__form__group__icon">{icon}</div>
      <div className="track-trace__container__form__group__line"></div>
      <div className="track-trace__container__form__group__input">
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

// traceerBestelling component
function TrackTrace(onSaveTrackTrace) {
  const trackTraceApi = useTrackTrace();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { code, verification } = data;
      const response = await trackTraceApi.trackOrder({
        code: code,
        verification: verification,
      });
      if (response instanceof Error) {
        reset();
        throw new Error("Incorrect credientials");
      } else if (!response) {
        reset();
        throw new Error("Incorrect credientials");
      }
      setData(response);
      setAuthenticated(true);
      reset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  const handleBack = () => {
    setData({});
    setAuthenticated(false);
  };

  if (authenticated) {
    return (
      <div className="track-trace__data grid">
        <div className="track-trace__data__button flex" onClick={handleBack}>
          <FiChevronLeft />
          <span>Back</span>
        </div>
        <div className="track-trace__data__status">
          <ProgressBar status={data.status} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <FormProvider {...{ register, handleSubmit, errors }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <LabelInput
            name="code"
            type="text"
            label="Track & Trace code"
            icon={<FiHash />}
            isInvalid={errors.code}
            required
          />
          <LabelInput
            name="verification"
            type="text"
            label="Order ID"
            icon={<FiHash />}
            isInvalid={errors.verification}
            required
          />
          <div className="track-trace__container__form__submit">
            <button
              type="submit"
              disabled={isSubmitting}
              className="track-trace__container__form__submit__button"
              data-cy="track-trace-submit"
            >
              <span>Trace</span>
            </button>
          </div>
        </form>
      </FormProvider>
      <div className="track-trace__container__form__error">
        {errorMessage ? errorMessage : data.location}
      </div>
      <Loader loading={loading} />
    </div>
  );
}

export default memo(TrackTrace);
