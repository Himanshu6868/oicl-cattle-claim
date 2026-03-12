import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../cattle.css";

function CattleReidentification() {
  const navigate = useNavigate();

  return (
    <div>

      <Navbar />

      <div className="cattle-page">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          Home &gt; Digital Products & Services &gt; Cattle Reidentification
        </div>

        {/* Progress */}
        <div className="progress-wrapper">

          <div className="step active">
            <div className="circle">1</div>
            <div className="step-text">Upload Documents</div>
          </div>

          <div className="line"></div>

          <div className="step">
            <div className="circle grey">2</div>
            <div className="step-text">Validate</div>
          </div>

        </div>

        {/* Title Row */}
        <div className="title-row">

          <button
            className="back-btn"
            onClick={() => navigate("/dashboard?tab=others")}
          >
            ←
          </button>

          <h1 className="cattle-title">
            Cattle Reidentification
          </h1>

        </div>

        {/* Content Layout */}
        <div className="content-layout">

          {/* Claimant Details */}
          <div className="claim-box">

            <div className="claim-header">
              Claimant Details
            </div>

            <div className="form-row">

              <div className="field">
                <label>Claim Number *</label>
                <input value="423200/47/2025/PRTL/20006631" />
              </div>

              <div className="field">
                <label>Policy Number *</label>
                <input value="47589/31/2026/PRTL/397539" />
              </div>

            </div>

            <button className="next-btn">
              Next
            </button>

          </div>

          {/* Illustration */}
          <img
            src="/images/cattle-illustration.png"
            className="cattle-image"
          />

        </div>

      </div>

    </div>
  );
}

export default CattleReidentification;