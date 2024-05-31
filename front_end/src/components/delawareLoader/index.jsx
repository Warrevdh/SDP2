import "./index.scss";

import { useLayoutEffect, useRef } from "react";

const DelawareLoader = () => {
  const svgRef = useRef(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    svg.addEventListener("animationend", () => {
      svg.setAttribute("fill", "#ef463c");
    });
  }, []);

  return (
    <div className="loader" data-cy="loader">
      <div className="loader__container" data-cy="loader-container">
        <svg
          ref={svgRef}
          width="60"
          height="89"
          viewBox="0 0 60 89"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M57 0V61.6885C56.4136 70.1611 50.0217 86.8779 29.1456 85.964C8.26944 85.0501 3.05041 69.3995 3.05041 61.6885C2.464 51.3118 6.74361 33.8599 29.1456 33.4146C57.8796 32.8434 54.9476 55.4054 56.4136 55.4054"
            stroke="black"
            stroke-width="3"
          />
        </svg>

        <div class="spinner"></div>
      </div>
    </div>
  );
};

export default DelawareLoader;