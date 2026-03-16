import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StepProgressBar from "../components/StepProgressBar";
import { encryptPayload } from "../utils/encryption";
import { clearAuthToken, getAuthToken } from "../utils/auth";
import "../cattle.css";
import downloadIcon from "../assets/download.png";
import deleteIcon from "../assets/bin.png";

const UPLOAD_DOCUMENT_API_URL =
  "https://y4132nnj76.execute-api.ap-south-1.amazonaws.com/pre-prod/api/v1/claim/cattle/upload-docs";
const DELETE_DOCUMENT_API_URL =
  "https://y4132nnj76.execute-api.ap-south-1.amazonaws.com/pre-prod/api/v1/claim/cattle/delete-doc";
const FETCH_OCR_DATA_API_URL =
  "https://y4132nnj76.execute-api.ap-south-1.amazonaws.com/pre-prod/api/v1/claim/cattle/fetch-ocr-data";

function CattleReidentificationUpload() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const claimNumber = useMemo(() => state?.claimNumber?.trim() || "", [state?.claimNumber]);
  const policyNumber = useMemo(() => state?.policyNumber?.trim() || "", [state?.policyNumber]);

  const [currentStep, setCurrentStep] = useState(state?.currentStep || 2);
  const [liveImages, setLiveImages] = useState([]);
  const [deadImages, setDeadImages] = useState([]);
  const [uploadValidationError, setUploadValidationError] = useState("");
  const [isValidatingUploads, setIsValidatingUploads] = useState(false);
  const [isClaimantDetailsOpen, setIsClaimantDetailsOpen] = useState(true);
  const [isUploadPhotosOpen, setIsUploadPhotosOpen] = useState(true);

  useEffect(() => {
    if (!claimNumber || !policyNumber) {
      navigate("/cattle-reidentification", { replace: true });
    }
  }, [claimNumber, navigate, policyNumber]);

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
      throw new Error(responseBody?.message || "Request failed.");
    }

    return responseBody;
  };

  const getFileExtension = (fileName) => {
    const extension = fileName.split(".").pop();
    return extension ? extension.toLowerCase() : "";
  };

  const getUploadDetails = async ({ fileName, mediaType, documentType }) => {
    const responseBody = await postEncryptedApiRequest(UPLOAD_DOCUMENT_API_URL, {
      fileName,
      mediaType,
      documentType,
      claimNumber,
    });

    const responseData = responseBody?.data ?? responseBody;
    const uploadUrl =
      responseData?.uploadUrl ||
      responseData?.url ||
      responseBody?.uploadUrl ||
      responseBody?.url ||
      null;
    const documentId =
      responseData?.id ||
      responseData?.docId ||
      responseData?.documentId ||
      responseBody?.id ||
      responseBody?.docId ||
      responseBody?.documentId ||
      null;

    return { uploadUrl, documentId };
  };

  const deleteDocumentRequest = async ({ documentId, documentType }) => {
    const token = getRequestToken();

    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    const deleteUrl = `${DELETE_DOCUMENT_API_URL}/${encodeURIComponent(
      documentId,
    )}?claimNumber=${encodeURIComponent(claimNumber)}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-language": "en",
        "x-source": "WEB",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payload: await encryptPayload({ documentType }),
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
      throw new Error(responseBody?.message || "Failed to delete file.");
    }
  };

  const uploadFileToS3 = async (uploadUrl, file) => {
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`S3 upload failed with status ${uploadResponse.status}.`);
    }
  };

  const openUploadedFile = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const fetchOcrData = async () => {
    const token = getRequestToken();

    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    const requestUrl = `${FETCH_OCR_DATA_API_URL}?claimNumber=${encodeURIComponent(
      claimNumber,
    )}&policyNumber=${encodeURIComponent(policyNumber)}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        "x-language": "en",
        "x-source": "WEB",
        Authorization: `Bearer ${token}`,
      },
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
      throw new Error(responseBody?.message || "Failed to validate uploaded cattle photos.");
    }

    return responseBody;
  };

  const handleUploadDetailsNext = async () => {
    setUploadValidationError("");

    if (!liveImages.length || !deadImages.length) {
      setUploadValidationError(
        "Please upload at least one Live Cattle Photo and one Dead Cattle Photo to continue.",
      );
      return;
    }

    setIsValidatingUploads(true);

    setCurrentStep(3);
    navigate("/cattle-reidentification-results", { state: { currentStep: 3 } });
    try {
      await fetchOcrData();
    } catch (error) {
      if (error instanceof Error && error.message === "Session expired. Please login again.") {
        return;
      }

      if (error instanceof Error && error.message === "Authentication required. Please login again.") {
        navigate("/", { replace: true });
        return;
      }

      setUploadValidationError(
        error instanceof Error
          ? error.message
          : "Unexpected error occurred while validating uploaded cattle photos.",
      );
    } finally {
      setIsValidatingUploads(false);
    }
  };

  const deleteUploadedFile = async ({ type, file }) => {
    try {
      await deleteDocumentRequest({
        documentId: file.documentId || file.id,
        documentType: type === "live" ? "ALIVE" : "DEAD",
      });

      if (type === "live") {
        setLiveImages((previousFiles) =>
          previousFiles.filter((uploadedFile) => uploadedFile.id !== file.id),
        );
        return;
      }

      setDeadImages((previousFiles) =>
        previousFiles.filter((uploadedFile) => uploadedFile.id !== file.id),
      );
    } catch (error) {
      console.error("Failed to delete file:", file.fileName, error);
    }
  };

  const handleFilesChange = async (event, type) => {
    const files = Array.from(event.target.files || []);
    const documentType = type === "live" ? "ALIVE" : "DEAD";

    if (!files.length) {
      if (type === "live") {
        setLiveImages([]);
        return;
      }

      setDeadImages([]);
      return;
    }

    const uploadedFiles = [];

    for (const file of files) {
      try {
        const { uploadUrl, documentId } = await getUploadDetails({
          fileName: file.name,
          mediaType: getFileExtension(file.name),
          documentType,
        });

        if (!uploadUrl || typeof uploadUrl !== "string") {
          throw new Error("Upload URL missing in upload-docs response.");
        }

        await uploadFileToS3(uploadUrl, file);
        uploadedFiles.push({
          id: documentId || `${file.name}-${file.lastModified}`,
          documentId,
          fileName: file.name,
          url: uploadUrl,
          rawFile: file,
        });
      } catch (error) {
        console.error("Failed to upload file:", file.name, error);
      }
    }

    if (type === "live") {
      setLiveImages(uploadedFiles);
      return;
    }

    setDeadImages(uploadedFiles);
  };

  return (
    <div>
      <Navbar />

      <div className="cattle-page">
        <div className="breadcrumb">Home &gt; Digital Products & Services &gt; Cattle Reidentification</div>

        <div className="progress-wrapper">
          <StepProgressBar currentStep={currentStep} />
        </div>

        <div className="title-row">
          <button className="back-btn" onClick={() => navigate("/dashboard?tab=others")}>
            ←
          </button>

          <h1 className="cattle-title">Cattle Reidentification</h1>
        </div>

        <div className="claim-box" style={{ marginTop: "15px" }}>
          <button
            className="claim-header accordion-toggle"
            type="button"
            onClick={() => setIsClaimantDetailsOpen((previous) => !previous)}
            aria-expanded={isClaimantDetailsOpen}
            aria-controls="claimant-details-panel"
          >
            <span>Claimant Details</span>
            <span className="accordion-icon" aria-hidden="true">{isClaimantDetailsOpen ? "▴" : "▾"}</span>
          </button>

          <div
            id="claimant-details-panel"
            className={`accordion-panel ${isClaimantDetailsOpen ? "is-open" : "is-closed"}`}
            aria-hidden={!isClaimantDetailsOpen}
          >
              <div className="form-row">
                <div className="field">
                  <label>Claim Number *</label>
                  <input value={claimNumber} placeholder="Enter claim number" disabled />
                </div>

                <div className="field">
                  <label>Policy Number *</label>
                  <input value={policyNumber} placeholder="Enter policy number" disabled />
                </div>
              </div>

              <button
                className="next-btn secondary-nav-btn"
                type="button"
                onClick={() =>
                  navigate("/cattle-reidentification", {
                    state: { claimNumber, policyNumber, currentStep: 1 },
                  })
                }
              >
                Back to Claimant Details
              </button>
            </div>
        </div>

        <div className="upload-box">
          <button
            className="claim-header accordion-toggle"
            type="button"
            onClick={() => setIsUploadPhotosOpen((previous) => !previous)}
            aria-expanded={isUploadPhotosOpen}
            aria-controls="upload-photos-panel"
          >
            <span>Upload Cattle Photos</span>
            <span className="accordion-icon" aria-hidden="true">{isUploadPhotosOpen ? "▴" : "▾"}</span>
          </button>

          <div
            id="upload-photos-panel"
            className={`accordion-panel ${isUploadPhotosOpen ? "is-open" : "is-closed"}`}
            aria-hidden={!isUploadPhotosOpen}
          >
              <div className="form-row upload-form-row">
            <div className="field upload-field">
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
              <p className="upload-helper-text supported-file-text">Supported File Type: .png, .jpg</p>

              <ul className="file-list">
                {liveImages.map((file) => (
                  <li className="uploaded-file-row" key={file.id}>
                    <span className="file-saved-text">File saved</span>

                    <div className="file-actions">
                      <button className="file-btn" type="button" onClick={() => openUploadedFile(file.url)}>

                        <img className="file-btn-icon" src={downloadIcon} alt="Download file" />
                      </button>

                      <button
                        className="file-btn"
                        type="button"
                        onClick={() => deleteUploadedFile({ type: "live", file })}
                      >
                        <img className="file-btn-icon" src={deleteIcon} alt="Delete file" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="field upload-field">
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
              <p className="upload-helper-text supported-file-text">Supported File Type: .png, .jpg</p>

              <ul className="file-list">
                {deadImages.map((file) => (
                  <li className="uploaded-file-row" key={file.id}>
                    <span className="file-saved-text">File saved</span>

                    <div className="file-actions">
                      <button className="file-btn" type="button" onClick={() => openUploadedFile(file.url)}>
                        <img className="file-btn-icon" src={downloadIcon} alt="Download file" />
                      </button>

                      <button
                        className="file-btn"
                        type="button"
                        onClick={() => deleteUploadedFile({ type: "dead", file })}
                      >
                        <img className="file-btn-icon" src={deleteIcon} alt="Delete file" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

              <button
                className="next-btn validate-btn"
                type="button"
                onClick={handleUploadDetailsNext}
                disabled={isValidatingUploads}
              >
                {isValidatingUploads ? "Validating..." : "Validate"}
              </button>
              {uploadValidationError ? <p className="field-error">{uploadValidationError}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CattleReidentificationUpload;
