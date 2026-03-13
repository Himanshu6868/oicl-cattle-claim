import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import cattleIllustration from "../assets/cattle-illustration.png";
import "../cattle.css";

function CattleReidentification() {
  const navigate = useNavigate();
  const [claimNumber, setClaimNumber] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [liveImages, setLiveImages] = useState([]);
  const [deadImages, setDeadImages] = useState([]);

  const handleClaimDetailsNext = () => {
    const newErrors = {};

    if (!claimNumber.trim()) {
      newErrors.claimNumber = "Please fill claim number.";
    }

    if (!policyNumber.trim()) {
      newErrors.policyNumber = "Please fill policy number.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowUploadSection(true);
    }
  };

  const handleFilesChange = (event, type) => {
    const files = Array.from(event.target.files || []);

    if (type === "live") {
      setLiveImages(files);
      return;
    }

    setDeadImages(files);
  };

  return (
    <div>
      <Navbar />

      <div className="cattle-page">
        <div className="breadcrumb">
          Home &gt; Digital Products & Services &gt; Cattle Reidentification
        </div>

        <div className="progress-wrapper">
          <div className="step active">
            <div className="circle">1</div>
            <div className="step-text">Upload Documents</div>
          </div>

          <div className="line"></div>

          <div className="step">
            <div className={`circle ${showUploadSection ? "" : "grey"}`}>2</div>
            <div className="step-text">Validate</div>
          </div>
        </div>

        <div className="title-row">
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard?tab=others")}
          >
            ←
          </button>

          <h1 className="cattle-title">Cattle Reidentification</h1>
        </div>

        <div className="content-layout">
          <div className="claim-box">
            <div className="claim-header">Claimant Details</div>

            <div className="form-row">
              <div className="field">
                <label>Claim Number *</label>
                <input
                  value={claimNumber}
                  onChange={(event) => setClaimNumber(event.target.value)}
                  placeholder="Enter claim number"
                />
                {errors.claimNumber ? (
                  <p className="field-error">{errors.claimNumber}</p>
                ) : null}
              </div>

              <div className="field">
                <label>Policy Number *</label>
                <input
                  value={policyNumber}
                  onChange={(event) => setPolicyNumber(event.target.value)}
                  placeholder="Enter policy number"
                />
                {errors.policyNumber ? (
                  <p className="field-error">{errors.policyNumber}</p>
                ) : null}
              </div>
            </div>

            <button className="next-btn" onClick={handleClaimDetailsNext}>
              Next
            </button>
          </div>

          {!showUploadSection ? (
            <img
              src={cattleIllustration}
              className="cattle-image"
              alt="Cattle illustration"
            />
          ) : null}
        </div>

        {showUploadSection ? (
          <div className="upload-box">
            <div className="claim-header">Upload Cattle Photos</div>

            <div className="form-row upload-form-row">
              <div className="field">
                <label>Upload Live Cattle Photos *</label>
                <input
                  className="upload-input"
                  type="file"
                  accept="image/png,image/jpg,image/jpeg"
                  multiple
                  onChange={(event) => handleFilesChange(event, "live")}
                />
                <p className="helper-text">Supported File Type: .png, .jpg, .jpeg</p>

                <ul className="file-list">
                  {liveImages.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              </div>

              <div className="field">
                <label>Upload Dead Cattle Photos *</label>
                <input
                  className="upload-input"
                  type="file"
                  accept="image/png,image/jpg,image/jpeg"
                  multiple
                  onChange={(event) => handleFilesChange(event, "dead")}
                />
                <p className="helper-text">Supported File Type: .png, .jpg, .jpeg</p>

                <ul className="file-list">
                  {deadImages.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="next-btn validate-btn">Validate</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CattleReidentification;
