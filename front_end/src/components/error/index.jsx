//Description: This component is responsible for displaying an error message.

// Import Styles
import "./index.scss";

// Component
export default function Error({ error }) {
  if (error) {
    return (
      <div className="alert grid">
        <div className="alert__icon">
          <img
            src={require("../../assets/gifs/1140-error-outline.gif")}
            alt="error gif"
          />
        </div>
        <div className="alert__message">
          <h4 className="alert__message__heading" data-cy="error">An error occured</h4>
          <div className="alert__message__error">
            {error.message || JSON.stringify(error)}
          </div>
        </div>
      </div>
    );
  }
  return null;
}