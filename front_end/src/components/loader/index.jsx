import "./index.scss";


const Loader = ({ loading }) => {
  if (loading) {
    return (
    <div className="loader" data-cy="loader">
      <div className="loader__container" data-cy="loader-container">
        <div className="spinner"></div>
      </div>
    </div>
  );
  }
  return null;
};

export default Loader;
