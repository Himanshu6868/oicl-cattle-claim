const STEP_ITEMS = ["Claimant Details", "Upload Documents", "Image Similarity Results"];

function StepProgressBar({ currentStep }) {
  const totalSteps = STEP_ITEMS.length;
  const progressWidth = ((Math.min(Math.max(currentStep, 1), totalSteps) - 1) / (totalSteps - 1)) * 100;

  const getStepCircleClass = (stepNumber) => {
    if (currentStep > stepNumber) {
      return "step-circle completed-step";
    }

    if (currentStep === stepNumber) {
      return "step-circle active-step";
    }

    return "step-circle inactive-step";
  };

  const getStepContent = (stepNumber) => (currentStep > stepNumber ? "✔" : stepNumber);

  return (
    <div className="custom-stepper" aria-label="Cattle reidentification progress">
      <div className="sub-progressbars">
        <div className="steps completed-step p-progressbar" style={{ width: `${progressWidth}%` }}></div>
        <div className="steps"></div>
      </div>

      <div className="steps-wrap">
        {STEP_ITEMS.map((stepLabel, index) => {
          const stepNumber = index + 1;

          return (
            <div className="step-item" key={stepLabel}>
              <div
                className={getStepCircleClass(stepNumber)}
                aria-current={currentStep === stepNumber ? "step" : undefined}
              >
                {getStepContent(stepNumber)}
              </div>
              <div className="step-label">{stepLabel}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepProgressBar;
