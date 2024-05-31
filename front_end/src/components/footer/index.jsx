// Description: Footer component

// Import dependencies
import { memo } from "react";
import { Link } from "react-router-dom";

// Import styles
import "./index.scss";

// Navbar component
const Footer = () => {
  return (
    <div className="footer" data-cy="footer">
      <div className="footer__copy" data-cy="footer-copy">
        <p>&copy; Delaware Consulting CV - BE 0479.117.543</p>
      </div>
      <ul className="footer__links" data-cy="footer-links">
        <li>
          <Link
            to="/track-&-trace"
            className="footer__link"
          >
            Track & Trace
          </Link>
        </li>
        <li>
          <Link
            to="https://www.delaware.pro/en-be/legal/terms-of-use"
            className="footer__link"
            data-cy="footer-link-terms"
          >
            Terms of Use
          </Link>
        </li>
        <li>
          <Link
            to="https://www.delaware.pro/en-be/legal/privacy"
            className="footer__link"
            data-cy="footer-link-privacy"
          >
            Privacy Statement
          </Link>
        </li>
        <li>
          <Link
            to="https://www.delaware.pro/en-be/legal/responsible-disclosure"
            className="footer__link"
            data-cy="footer-link-disclosure"
          >
            Responsible Disclosure
          </Link>
        </li>
        <li>
          <Link
            to="https://www.delaware.pro/en-be/legal/cookie-policy"
            className="footer__link"
            data-cy="footer-link-cookie"
          >
            Cookie Policy
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default memo(Footer);
