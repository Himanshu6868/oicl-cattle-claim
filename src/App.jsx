import './App.css'

function App() {
  return (
    <main className="page-bg">
      <section className="login-card" aria-label="OICL login form">
        <button className="close-btn" aria-label="Close">
          ×
        </button>

        <h1>Login To Your OICL Account</h1>
        <p className="sub-line">For a more personalized experience, login</p>
        <p className="note-line">
          <strong>Note:</strong> Click <a href="#">here</a> to view important guidelines before proceeding
        </p>

        <div className="tab-row">
          <button className="tab active">User ID</button>
          <button className="tab">Mobile Number/Email ID</button>
        </div>

        <div className="field-wrap">
          <input type="text" placeholder="Username  *" />
          <span className="trailing-icon">◌</span>
        </div>

        <div className="field-wrap">
          <input type="password" placeholder="Password  *" />
          <a className="forgot" href="#">
            Forgot?
          </a>
          <span className="eye">◉</span>
        </div>

        <label className="captcha-label">Captcha <span>*</span></label>

        <div className="captcha-row">
          <div className="captcha-box">2 k Z K n</div>
          <button className="icon-btn" aria-label="Read captcha">
            🔊
          </button>
          <button className="icon-btn" aria-label="Refresh captcha">
            ↻
          </button>
        </div>

        <div className="field-wrap">
          <input type="text" placeholder="Enter Captcha" />
          <span className="trailing-icon">⌂</span>
        </div>

        <p className="help-text">◔ Click the speaker icon to hear the captcha read aloud</p>

        <button className="login-btn">Login</button>

        <div className="divider">
          <span>Or, login with</span>
        </div>

        <div className="social-row">
          <button className="social-btn">Google</button>
          <button className="social-btn">Facebook</button>
          <button className="social-btn">CSC Connect</button>
        </div>

        <button className="guide-btn">🖥 User Login Guide</button>

        <p className="signup-line">
          Don&apos;t you have an account? <a href="#">Sign Up</a>
        </p>
      </section>
    </main>
  )
}

export default App
