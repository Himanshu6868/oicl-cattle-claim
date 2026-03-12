import logo from "../assets/logo.png";

function Navbar() {
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
      </div>

    </div>
  );
}

export default Navbar;