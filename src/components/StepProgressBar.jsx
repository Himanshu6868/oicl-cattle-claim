const STEP_ITEMS = ["Claimant Details", "Upload Documents", "Image Similarity Results"];

function StepProgressBar({ currentStep }) {
  const getStepClass = (step) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "";
  };

  return (
    <div className="stepper-container" aria-label="Cattle reidentification progress">
      <div className="stepper-line" aria-hidden="true"></div>

      {STEP_ITEMS.map((stepLabel, index) => {
        const stepNumber = index + 1;
        const stepClass = getStepClass(stepNumber);

        return (
          <div className="step" key={stepLabel}>
            <div
              className={`step-circle ${stepClass}`.trim()}
              aria-current={currentStep === stepNumber ? "step" : undefined}
            >
              {stepClass === "completed" ? "✔" : stepNumber}
            </div>
            <span>{stepLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

export default StepProgressBar;
