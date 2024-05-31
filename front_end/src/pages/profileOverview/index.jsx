// Descritpion: This file contains the code for the profile overview page

// import dependencies
import { useState, useContext, useEffect } from "react";
// import styles
import "./index.scss";

// import icons
import {
  FiLogOut,
  FiMail,
  FiMapPin,
  FiUser,
  FiBell,
  FiShoppingBag,
} from "react-icons/fi";
import { VscBriefcase } from "react-icons/vsc";

// import user context
import { UserContext } from "../../context/UserProvider";

// import components
import Login from "../../components/login";
// import Register from "../../components/register";
import Account from "../../components/account";

import NotificationList from "../../components/notifications";

import OrderPage from "../orderPage";

function Links({ onLogout, onActiveLinkIdChange }) {
  const links = [
    { id: 1, text: "Account", icon: <FiUser /> },
    { id: 2, text: "Notifications", icon: <FiBell /> },
    { id: 3, text: "Orders", icon: <FiShoppingBag /> },
  ];

  const [activeLinkId, setActiveLinkId] = useState(links[0].id);

  const handleActiveLinkIdChange = (id) => {
    setActiveLinkId(id);
    onActiveLinkIdChange(id);
  };

  return (
    <ul className="profile-page__content__list">
      {links.map((link) => (
        <li
          key={link.id}
          className={`profile-page__content__list__item${
            activeLinkId === link.id ? "__active" : ""
          }`}
          onClick={() => handleActiveLinkIdChange(link.id)}
          data-cy={`profile-page-${link.id}`}
        >
          <span className="profile-page__content__list__item__text">
            {link.text}
          </span>
          <span className="profile-page__content__list__item__icon">
            {link.icon}
          </span>
        </li>
      ))}
      <li className="profile-page__content__list__item" onClick={onLogout}>
        <span className="profile-page__content__list__item__text">Logout</span>
        <span className="profile-page__content__list__item__icon">
          <FiLogOut />
        </span>
      </li>
    </ul>
  );
}

// Profile Page
const ProfileOverview = () => {
  const { user, logout } = useContext(UserContext);

  const [activeLinkId, setActiveLinkId] = useState(1);
  const [userCompany, setUserCompany] = useState(null);

  useEffect(() => {
    console.log(user)
    if (user && user.Company) {
      setUserCompany(user.Company.name);
    }
  }, [user]);

  const handleActiveLinkIdChange = (id) => {
    setActiveLinkId(id);
  };

  const handleLogout = () => {
    logout();
    setActiveLinkId(1);
  };

  // capitalize function
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  if (user) {
    return (
      <div className="profile-page" data-cy="profile-page">
        <div className="profile-page__header grid">
          <div className="profile-page__header__image">
            <img src="https://random.imagecdn.app/150/150" alt="profile" />
          </div>
          <div className="profile-page__header__content grid">
            <div className="profile-page__header__name">
              {capitalize(user.firstname)} {capitalize(user.lastname)} -
              <span>{capitalize(user.role)}</span>
            </div>
            <ul className="profile-page__header__information">
              <li className="profile-page__header__information__item">
                <div className="profile-page__header__information__item__icon">
                  <FiMail />
                </div>
                <div className="profile-page__line"></div>
                <span>{user.email}</span>
              </li>
              <li className="profile-page__header__information__item">
                <div className="profile-page__header__information__item__icon">
                  <FiMapPin />
                </div>
                <div className="profile-page__line"></div>
                <span>
                  {capitalize(user.street)} {user.addressNumber},{" "}
                  {user.postalCode} {capitalize(user.city)}
                </span>
              </li>
              <li className="profile-page__header__information__item">
                <div className="profile-page__header__information__item__icon">
                  <VscBriefcase />
                </div>
                <div className="profile-page__line"></div>
                <span>{userCompany}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="profile-page__header"></div>
        <div
          className="profile-page__content grid"
          data-cy="profile-page-content"
        >
          <Links
            onLogout={handleLogout}
            onActiveLinkIdChange={handleActiveLinkIdChange}
          />
          <div className="profile-page__content__overview">
            {activeLinkId === 1 ? (
              <Account />
            ) : activeLinkId === 2 ? (
              <NotificationList />
            ) : activeLinkId === 3 ? (
              <OrderPage />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="profile-overview" data-cy="profile-overview">
      <div
        className="profile-overview__content"
        data-cy="profile-overview-content"
      >
        <Login />
      </div>
    </div>
  );
};

export default ProfileOverview;
