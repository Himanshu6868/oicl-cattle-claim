import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import cattleIllustration from "../assets/cattle-illustration.png";
import { encryptPayload } from "../utils/encryption";
import { clearAuthToken, getAuthToken } from "../utils/auth";
import "../cattle.css";

const CLAIM_DETAILS_API_URL =
  "https://y4132nnj76.execute-api.ap-south-1.amazonaws.com/pre-prod/api/v1/claim/cattle/save-basic-details";

function CattleReidentification() {
  const navigate = useNavigate();
  const [claimNumber, setClaimNumber] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [liveImages, setLiveImages] = useState([]);
  const [deadImages, setDeadImages] = useState([]);
  const [claimDetailsError, setClaimDetailsError] = useState("");

  const getRequestToken = () => getAuthToken() || localStorage.getItem("token");

  const postEncryptedApiRequest = async (apiUrl, payload) => {
    const token = getRequestToken();

    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    const encryptedPayload = await encryptPayload(payload);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-language": "en",
        "x-source": "WEB",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payload: encryptedPayload,
      }),
    });

    let responseBody = null;
    try {
      responseBody = await response.json();
    } catch (_error) {
      responseBody = null;
    }

    if (response.status === 401) {
      clearAuthToken();
      localStorage.removeItem("token");
      navigate("/", { replace: true });
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      throw new Error(responseBody?.message || "Failed to fetch claim details.");
    }

    return responseBody;
  };

  const handleClaimDetailsNext = async () => {
    const newErrors = {};

    if (!claimNumber.trim()) {
      newErrors.claimNumber = "Please fill claim number.";
    }

    if (!policyNumber.trim()) {
      newErrors.policyNumber = "Please fill policy number.";
    }

    setErrors(newErrors);
    setClaimDetailsError("");

    if (Object.keys(newErrors).length === 0) {
      try {
        await postEncryptedApiRequest(CLAIM_DETAILS_API_URL, {
          claimNumber,
          policyNumber,
        });

        setShowUploadSection(true);
      } catch (error) {
        if (error instanceof Error && error.message === "Session expired. Please login again.") {
          return;
        }

        if (error instanceof Error && error.message === "Authentication required. Please login again.") {
          navigate("/", { replace: true });
        }

        setClaimDetailsError(
          error instanceof Error
            ? error.message
            : "Unexpected error occurred while fetching claim details.",
        );
      }
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
            {claimDetailsError ? <p className="field-error">{claimDetailsError}</p> : null}
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
                <label className="upload-control">
                  <input
                    className="upload-input"
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    multiple
                    onChange={(event) => handleFilesChange(event, "live")}
                  />
                  <span className="upload-control-text">
                    Upload Live Cattle Photos <span className="required-star">*</span>
                  </span>
                  <span className="upload-control-icon" aria-hidden="true">
                    🔗
                  </span>
                </label>
                <p className="helper-text">Supported File Type: .png, .jpg</p>

                <ul className="file-list">
                  {liveImages.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              </div>

              <div className="field">
                <label className="upload-control">
                  <input
                    className="upload-input"
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    multiple
                    onChange={(event) => handleFilesChange(event, "dead")}
                  />
                  <span className="upload-control-text">
                    Upload Dead Cattle Photos <span className="required-star">*</span>
                  </span>
                  <span className="upload-control-icon" aria-hidden="true">
                    🔗
                  </span>
                </label>
                <p className="helper-text">Supported File Type: .png, .jpg</p>

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
