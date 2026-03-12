import "../App.css"
import { useNavigate } from "react-router-dom"

function LoginPage() {

  const navigate = useNavigate()

  return (
    <main className="page-bg">
      <section className="login-card">

        <h1>Login To Your OICL Account</h1>

        <p className="sub-line">
          For a more personalized experience, login
        </p>

        <p className="note-line">
          <strong>Note:</strong> Click <a href="#">here</a> to view important guidelines before proceeding
        </p>

        <div className="tab-row">
          <button className="tab active">User ID</button>
          <button className="tab">Mobile Number/Email ID</button>
        </div>

        <input className="input-field" placeholder="Username *" />
        <input className="input-field" placeholder="Password *" />

        <div className="captcha-label">Captcha *</div>

        <div className="captcha-box">2 k Z K n</div>

        <input className="input-field" placeholder="Enter Captcha" />

        <button
          className="login-btn"
          onClick={() => navigate("/dashboard")}
        >
          Login
        </button>

        <div className="divider">Or, login with</div>

        <div className="social-row">
          <button className="social-btn">Google</button>
          <button className="social-btn">Facebook</button>
          <button className="social-btn">CSC Connect</button>
        </div>

      </section>
    </main>
  )
}

export default LoginPage