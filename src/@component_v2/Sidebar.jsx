import {
  Home,
  AccountBalance,
  Contactless,
  Settings,
  CreditCard,
  Logout,
  Language,
  ConnectingAirports,
  HomeOutlined,
  AccountBalanceOutlined,
  ContactlessOutlined,
  CreditCardOutlined,
  ConnectingAirportsOutlined,
  SettingsOutlined,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetUtilityStates,
  setActiveTab,
  setExpanded,
} from "../@redux/feature/Utility";
import { resetAuthStates } from "../@redux/feature/Auth";
import { resetAccountStates } from "../@redux/feature/account";
import { IconButton, Divider } from "@mui/material";

export const LogoutFn = ({ dispatch, navigate }) => {
  sessionStorage.clear();
  dispatch(setActiveTab("Dashboard"));
  dispatch(resetAuthStates());
  dispatch(resetAccountStates());
  // dispatch(resetUtilityStates());
  navigate("/");
};

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeTab = useSelector((state) => state.utility.activeTab);
  const program = useSelector((state) => state.utility.program);
  const type = useSelector((state) => state.auth.type);
  const iconSize = "small";

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home fontSize={iconSize} />,
      link: "/dashboard",
    },
    {
      name: "Accounts",
      icon: <AccountBalance fontSize={iconSize} />,
      link: "/accounts",
    },

    {
      name: "Transactions",
      icon: <Contactless fontSize={iconSize} />,
      link: "/transactions",
    },
    {
      name: program === "SMMAAS0" ? "Cards" : "Remittance",
      icon:
        program === "SMMAAS0" ? (
          <CreditCard fontSize={iconSize} />
        ) : (
          <ConnectingAirports fontSize={iconSize} />
        ),
      link: program === "SMMAAS0" ? "/cards" : "/remittance",
    },

    {
      name: "Settings",
      icon: <Settings fontSize={iconSize} />,
      link: "/settings",
    },
  ];

  const activateTab = ({ item }) => {
    dispatch(setActiveTab(item.name));
    navigate(item.link);
  };

  const userDetails = useSelector((state) => state.auth?.userDetails);
  const expanded = useSelector((state) => state.utility.isExpanded);

  return (
    <div
      className="d-flex flex-column flex-shrink-0 justify-content-between bg-dark"
      style={{
        width: expanded ? 250 : 90,
        height: "100vh",
        // borderRight: "1px solid lightgrey",
        // background: "#d3d3d345",
      }}
    >
      <div>
        {/* Logo */}
        <div
          className="sidebar-logo px-3 py-2 d-flex align-items-center justify-content-center gap-2"
          style={{ minHeight: 100 }}
        >
          {expanded && <img src="/auth/logo.png" alt="" width={85} />}
          <IconButton
            className="bg-dark text-white border border-secondary"
            sx={{
              width: 30,
              height: 30,
              position: "absolute",
              left: expanded ? 232 : 72,
            }}
            onClick={() => dispatch(setExpanded(!expanded))}
          >
            {expanded ? (
              <ChevronLeft fontSize="small" />
            ) : (
              <ChevronRight fontSize="small" sx={{ ps: "4px" }} />
            )}
          </IconButton>
        </div>
        <Divider variant="middle" sx={{ color: "#d3d3d3" }} />

        {/* Navigation Menu */}
        <ul className="nav nav-pills flex-column mt-4">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`nav-cards nav-item ${
                activeTab === item.name
                  ? "curved-box bg-white border-white"
                  : ""
              }`}
              style={{
                margin: "15px",
                padding: "4px 0",
                border: activeTab === item.name ? "2px solid blue" : "",
                borderRadius: activeTab === item.name ? 30 : "",
              }}
              onClick={() => activateTab({ item })}
            >
              <a
                href="#"
                className={`nav-link d-flex align-items-center justify-content-start gap-3 ${
                  activeTab === item.name
                    ? "text-dark fw-bold"
                    : "text-white fw-500"
                }`}
              >
                {item.icon}
                {expanded && item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Divider variant="middle" sx={{ color: "#d3d3d3" }} />

        <ul className="nav-cards nav nav-pills flex-column">
          <li
            className={`nav-item`}
            style={{
              margin: "10px 15px",
              padding: "4px 0",
            }}
            onClick={() => LogoutFn({ dispatch, navigate })}
          >
            <a
              href="#"
              className={`nav-link d-flex align-items-center gap-3 fw-500 text-white`}
            >
              <Logout fontSize={iconSize} />
              {expanded && "Logout"}
            </a>
          </li>
        </ul>
      </div>

      {/* <div className="footer text-secondary fs-8 text-end position-absolute bottom-0 w-100 pe-4">
        © {new Date().getFullYear()} Alliance Digital Corporate Banque Ltd.
      </div> */}
    </div>
  );
};

export default Sidebar;
