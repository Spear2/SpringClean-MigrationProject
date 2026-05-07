import React from "react";
import CleanerForm from "../../components/ChooseYourRoleForm/SecondStep/CleanerForm";
import CustomerForm from "../../components/ChooseYourRoleForm/SecondStep/CustomerForm";
import ThirdStep from "../../components/ChooseYourRoleForm/ThirdStep/ThirdStep";
import StepJourney from "../../components/ChooseYourRoleForm/Journey/StepJourney";
import CompanyForm from "../../components/ChooseYourRoleForm/SecondStep/CompanyForm";
import FirstStep from "../../components/ChooseYourRoleForm/FirstStep/FirstStep";
import "./RegisterPage.css";
import { useState } from "react";

export default function ChooseYourUser() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="choose-user-page">
      <StepJourney currentStep={currentStep} />
      {currentStep === 1 && (
        <FirstStep
          currentStep={currentStep}
          onNext={nextStep}
          updateFormData={updateFormData}
          formData={formData}
        />
      )}

      {currentStep === 2 && formData.role === "cleaner" && (
        <CleanerForm
          onNext={nextStep}
          onBack={prevStep}
          updateFormData={updateFormData}
          formData={formData}
        />
      )}
      {currentStep === 2 && formData.role === "customer" && (
        <CustomerForm
          onNext={nextStep}
          onBack={prevStep}
          updateFormData={updateFormData}
          formData={formData}
        />
      )}
      {currentStep === 2 && formData.role === "company" && (
        <CompanyForm
          onNext={nextStep}
          onBack={prevStep}
          updateFormData={updateFormData}
          formData={formData}
        />
      )}

      {currentStep === 3 && <ThirdStep onBack={prevStep} formData={formData} />}
    </div>
  );
}
