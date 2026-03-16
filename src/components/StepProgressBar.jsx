const STEP_ITEMS = ["Claimant Details", "Upload Documents", "Image Similarity Results"];

function StepProgressBar({ currentStep }) {
  const totalSteps = STEP_ITEMS.length;
  const safeStep = Math.min(Math.max(currentStep, 1), totalSteps);

  const getStepClass = (step) => {
    if (step < safeStep) return "completed";
    if (step === safeStep) return "active";
    return "";
  };

const progressWidth =
  ((currentStep - 1) / (STEP_ITEMS.length - 1)) * 66.666;
  
  return (
    <div className="stepper-container" aria-label="Cattle reidentification progress">
      <div className="progress-line" aria-hidden="true"></div>
      <div
        className="progress-active"
        style={{ width: `${progressWidth}%` }}
        aria-hidden="true"
      ></div>

      {STEP_ITEMS.map((stepLabel, index) => {
        const stepNumber = index + 1;
        const stepClass = getStepClass(stepNumber);

        return (
          <div className="step" key={stepLabel}>
              <div
              className={`circle ${stepClass}`.trim()}
              aria-current={safeStep === stepNumber ? "step" : undefined}
            >
              {stepClass === "completed" ? "✓" : stepNumber}
            </div>
            <span>{stepLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

export default StepProgressBar;
