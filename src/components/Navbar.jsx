import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { clearAuthToken } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate("/", { replace: true });
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img
          src={logo}
          className="navbar-logo"
        />
      </div>

      <div className="nav-links">
        <span>About Us</span>
        <span>Products</span>
        <span>Quick Renewal</span>
        <span>Quick Pay</span>
        <span>Services</span>
      </div>

      <div className="nav-right">
        <span>Search</span>
        <span className="profile">Hi Himanshu</span>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            border: "none",
            background: "transparent",
            color: "#0f4f8f",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
