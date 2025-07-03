import {
  Home,
  AccountBalance,
  Contactless,
  Settings,
  CreditCard,
  Logout,
  AccountCircle,
  Fingerprint,
  Security,
  DeleteForever,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  const type = useSelector((state) => state.auth.type);
  const menuItems = [
    { name: "Profile", icon: <AccountCircle />, link: "/dashboard" },
    {
      name: type === "business" ? "KYB" : "KYC",
      icon: <Fingerprint />,
      link: "/accounts",
    },
    { name: "Security", icon: <Security />, link: "/transactions" },
    // {
    //   name: "Delete Your Account",
    //   icon: <DeleteForever />,
    //   link: "/delete",
    // },
  ];

  const activateTab = ({ item }) => {
    setActiveTab(item.name);
  };

  return (
    <div
      className="py-4"
      style={{
        width: "16%",
        borderRight: "1.5px solid lightgrey",
        minHeight: "100vh",
      }}
    >
      {/* Navigation Menu */}
      <ul
        className="nav nav-pills w-100 justify-content-start align-items-center"
        style={{ width: "auto" }}
      >
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`nav-item ${
              activeTab === item.name ? "bg-dark border-dark" : ""
            }`}
            style={{
              padding: "0.25rem",
              borderRadius: 30,
              fontSize: 14,
              marginRight: 20,
              marginBottom: 20,
            }}
            onClick={() => activateTab({ item })}
          >
            <a
              href="#"
              className={`nav-link d-flex align-items-center gap-3 fw-500 ${
                activeTab === item.name ? "text-white" : "text-dark"
              }`}
            >
              {item.icon}
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsSidebar;
