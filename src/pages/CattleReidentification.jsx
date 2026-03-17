import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StepProgressBar from "../components/StepProgressBar";
import cattleIllustration from "../assets/cattle-illustration.png";
import { encryptPayload } from "../utils/encryption";
import { clearAuthToken, getAuthToken, getAuthorizationHeaderValue } from "../utils/auth";
import { trackApiRequest } from "../utils/apiLoader";
import { useToast } from "../components/ToastProvider";
import "../cattle.css";

const CLAIM_DETAILS_API_URL =
  "https://y4132nnj76.execute-api.ap-south-1.amazonaws.com/pre-prod/api/v1/claim/cattle/save-basic-details";

function CattleReidentification() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [claimNumber, setClaimNumber] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    if (state?.claimNumber) {
      setClaimNumber(state.claimNumber);
    }

    if (state?.policyNumber) {
      setPolicyNumber(state.policyNumber);
    }

    setCurrentStep(state?.currentStep || 1);
  }, [state]);

  const getRequestToken = () => getAuthToken();

  const postEncryptedApiRequest = async (apiUrl, payload) => {
    const token = getRequestToken();

    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    const encryptedPayload = await encryptPayload(payload);

    const response = await trackApiRequest(fetch(apiUrl, {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-language": "en",
        "x-source": "WEB",
        Authorization: getAuthorizationHeaderValue(token),
      },
      body: JSON.stringify({
        payload: encryptedPayload,
      }),
    }));

    let responseBody = null;
    try {
      responseBody = await response.json();
    } catch (_error) {
      responseBody = null;
    }

    if (response.status === 401) {
      clearAuthToken();
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
    if (Object.keys(newErrors).length === 0) {
      try {
        await postEncryptedApiRequest(CLAIM_DETAILS_API_URL, {
          claimNumber,
          policyNumber,
        });

        setCurrentStep(2);
        navigate("/cattle-reidentification/upload", {
          state: {
            claimNumber: claimNumber.trim(),
            policyNumber: policyNumber.trim(),
            currentStep: 2,
          },
        });
      } catch (error) {
        if (error instanceof Error && error.message === "Session expired. Please login again.") {
          return;
        }

        if (error instanceof Error && error.message === "Authentication required. Please login again.") {
          navigate("/", { replace: true });
        }

        const errorMessage = error instanceof Error
          ? error.message
          : "Unexpected error occurred while fetching claim details.";
        showToast(errorMessage);
      }
    }
  };

  return (
    <div>
      <Navbar />

      <div className="cattle-page">
        <div className="breadcrumb" style={{marginBottom: "10px"}}>
          Home &gt; Digital Products & Services &gt; Cattle Reidentification
        </div>

        <div className="progress-wrapper">
          <StepProgressBar currentStep={currentStep} />
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
          <div className="claim-box claimant-details-box">
            <div className="claim-header">Claimant Details</div>


            <div className="form-row">
              <div className="field">
                <label>Claim Number <span className="required-star">*</span></label>
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
                <label>Policy Number <span className="required-star">*</span></label>
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

          <img
            src={cattleIllustration}
            className="cattle-image"
            alt="Cattle illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default CattleReidentification;
