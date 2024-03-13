"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        disabled:bg-gray-300 disabled:cursor-not-allowed
      "
      disabled={pending}
    >
      {pending ? "Transcribing..." : "Transcribe"}
    </button>
  );
}

export default SubmitButton;
