import { useLocation, useNavigate } from "react-router-dom";
import cattleIllustration from "../assets/cattle-illustration.png";
import StepProgressBar from "../components/StepProgressBar";
import "../cattle.css";

const similarityData = {
  aliveImages: ["Image 1", "Image 2", "Image 3"],
  deadImages: ["Image 1", "Image 2", "Image 3", "Image 4"],
  rows: [
    {
      alive: "Image 1",
      values: [80, 68, 50, 10],
      average: 52,
    },
    {
      alive: "Image 2",
      values: [50, 10, 60, 5],
      average: 31.2,
    },
    {
      alive: "Image 3",
      values: [40, 25, 35, 20],
      average: 30,
    },
  ],
  overallScore: 37.7,
};

const rejectedImages = [
  {
    name: "Cattle image live 1.png",
    type: "live",
  },
  {
    name: "Cattle image live 2.png",
    type: "live",
  },
  {
    name: "Cattle image dead 1.png",
    type: "dead",
  },
  {
    name: "Cattle image dead 2.png",
    type: "dead",
  },
];

function CattleReidentificationResults() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentStep = state?.currentStep || 3;
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
        <div className="similarity-table-wrapper">
          <table className="similarity-table">
            <thead>
              <tr>
                <th rowSpan={2}>Alive Images</th>
                <th colSpan={similarityData.deadImages.length}>Dead Images</th>
                <th rowSpan={2}>Average Similarity Score</th>
              </tr>
              <tr>
                {similarityData.deadImages.map((imageName) => (
                  <th key={imageName}>{`Dead ${imageName}`}</th>
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
