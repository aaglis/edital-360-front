"use client";

import RecoverPasswordRequestStep from "../../../../components/RecoverPasswordRequest";

export default function RecoverPasswordPage() {

  const handleSuccess = () => {
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 mx-auto py-11">
      <RecoverPasswordRequestStep onSuccess={handleSuccess} />
    </div>
  );
}
