import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cattleIllustration from "../assets/cattle-illustration.png";
import StepProgressBar from "../components/StepProgressBar";
import { clearAuthToken, getAuthToken } from "../utils/auth";
import { trackApiRequest } from "../utils/apiLoader";
import { useToast } from "../components/ToastProvider";
import "../cattle.css";

const FETCH_OCR_DATA_API_URL =
  "https://y4132nnj76.execute-api.ap-south-1.amazonaws.com/pre-prod/api/v1/claim/cattle/fetch-ocr-data";

const encodeQueryParamPreservingSlash = (value) => encodeURIComponent(value).replaceAll("%2F", "/");

const formatSimilarity = (value) => {
  if (typeof value !== "number") {
    return "0.00";
  }

  return (value * 100).toFixed(2);
};

function CattleReidentificationResults() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentStep = state?.currentStep || 3;
  const claimNumber = state?.claimNumber?.trim() || "";
  const [ocrData, setOcrData] = useState(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const { showToast } = useToast();

  const getRequestToken = () => getAuthToken() || localStorage.getItem("token");

  useEffect(() => {
    const fetchOcrData = async () => {
      if (!claimNumber) {
        showToast("Claim number is missing. Please go back and try again.");
        return;
      }

      const token = getRequestToken();

      if (!token) {
        showToast("Authentication required. Please login again.");
        navigate("/", { replace: true });
        return;
      }

      setIsLoadingResults(true);
      const requestUrl = `${FETCH_OCR_DATA_API_URL}?claimNumber=${encodeQueryParamPreservingSlash(claimNumber)}`;

      try {
        const response = await trackApiRequest(fetch(requestUrl, {
          method: "GET",
          headers: {
            accept: "application/json, text/plain, */*",
            "x-language": "en",
            "x-source": "WEB",
            Authorization: `Bearer ${token}`,
          },
        }));

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
          throw new Error(responseBody?.message || "Failed to fetch cattle reidentification results.");
        }

        setOcrData(responseBody);
      } catch (error) {
        const errorMessage = error instanceof Error
        ? error.message
        : "Unexpected error occurred while fetching cattle reidentification results.";
      showToast(errorMessage);
      } finally {
        setIsLoadingResults(false);
      }
    };

    fetchOcrData();
  }, [claimNumber, navigate]);

  const similarityData = useMemo(() => {
    const analysisRows = ocrData?.verificationAnalysisDetails || [];
    const deadImages = analysisRows[0]?.resultDetails?.map((detail) => detail.deadImage) || [];
    const rows = analysisRows.map((analysisDetail, index) => {
      const values = (analysisDetail.resultDetails || []).map((resultDetail) =>
        formatSimilarity(resultDetail.similarity),
      );

      const averageValue = values.length
        ? (values.reduce((sum, value) => sum + Number(value), 0) / values.length).toFixed(2)
        : "0.00";

      return {
        alive: analysisDetail.liveImage || `Live Image ${index + 1}`,
        values,
        average: averageValue,
      };
    });

    return {
      deadImages,
      rows,
      overallScore: formatSimilarity(ocrData?.avgSimilarity),
    };
  }, [ocrData]);

  const rejectedImages = useMemo(() => {
    const failedAliveImages = (ocrData?.faileAliveImagesDetails || []).map((imageDetail) => ({
      name: imageDetail.file,
      type: "live",
    }));

    const failedDeadImages = (ocrData?.failedDeadImagesDetails || []).map((imageDetail) => ({
      name: imageDetail.file,
      type: "dead",
    }));

    return [...failedAliveImages, ...failedDeadImages];
  }, [ocrData]);

  const leftColumn = rejectedImages.filter((_, index) => index % 2 === 0);
  const rightColumn = rejectedImages.filter((_, index) => index % 2 !== 0);

  const renderRejectedCard = (image) => (
    <div key={image.name} className="rejected-image-card">
      <img src={cattleIllustration} alt={image.name} className="rejected-thumbnail" />
      <span className="rejected-image-name">{image.name}</span>
      <div className="rejected-actions" aria-label={`actions for ${image.name}`}>
        <button type="button" className="rejected-action-btn" aria-label="View image">
          👁
        </button>
        <button type="button" className="rejected-action-btn" aria-label="Download image">
          ⬇
        </button>
      </div>
    </div>
  );

  return (
    <div className="cattle-page">
      <div className="progress-wrapper">
        <StepProgressBar currentStep={currentStep} />
      </div>

      <div className="title-row results-title-row">
        <button className="back-btn" onClick={() => navigate("/cattle-reidentification")}>←</button>
        <h1 className="cattle-title">Cattle Reidentification</h1>
      </div>

      <section className="similarity-container">
        <div className="claim-header">Image Similarity Results</div>
        {isLoadingResults ? <p className="upload-helper-text">Loading similarity results...</p> : null}
        <div className="similarity-table-wrapper">
          <table className="similarity-table">
            <thead>
              <tr>
                <th rowSpan={2}>Alive Images</th>
                <th colSpan={similarityData.deadImages.length}>Dead Images</th>
                <th rowSpan={2}>Average Similarity Score</th>
              </tr>
              <tr>
                {similarityData.deadImages.map((imageName, index) => (
                  <th key={imageName}>{`Dead ${index + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {similarityData.rows.map((row) => (
                <tr key={row.alive}>
                  <td>{row.alive}</td>
                  {row.values.map((value, index) => (
                    <td key={`${row.alive}-${index}`}>{value}%</td>
                  ))}
                  <td className="average-cell">{row.average}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overall-score-row">
          Overall Cattle Reidentification Score is <strong>{similarityData.overallScore}%</strong>
        </div>
      </section>

      <section className="rejected-section">
        <div className="claim-header">Rejected Images</div>
        <div className="rejected-grid">
          <div className="rejected-column">{leftColumn.map((image) => renderRejectedCard(image))}</div>
          <div className="rejected-column">{rightColumn.map((image) => renderRejectedCard(image))}</div>
        </div>
      </section>

      <button className="submit-btn" type="button">Submit</button>
    </div>
  );
}

export default CattleReidentificationResults;
