"use client";

import transcript from "@/actions/transcript";
import SubmitButton from "@/components/SubmitButton";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  message: "",
};

const TIME_PER_KB = 0.007576; // Estimated seconds per kilobyte

export default function Home() {
  const [state, formAction] = useFormState(transcript, initialState);

  console.log("state", state);
  return (
    <main className="p-24">
      <form action={formAction}>
        <input type="file" name="audio" />

        <SubmitButton />
      </form>

      {state.message && (
        <div className="p-10">
          <h2 className="font-bold text-3xl mb-3">Transcription</h2>
          <p>{state.message}</p>
        </div>
      )}
    </main>
  );
}
