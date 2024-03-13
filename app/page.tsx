"use client";

import transcript from "@/actions/transcript";
import SubmitButton from "@/components/SubmitButton";
import { useFormState, useFormStatus } from "react-dom";
import { AudioRecorder } from "react-audio-voice-recorder";
import { useRef } from "react";

const initialState = {
  message: "",
};

// const TIME_PER_KB = 0.007576; // Estimated seconds per kilobyte

export default function Home() {
  const [state, formAction] = useFormState(transcript, initialState);
  const fileRef = useRef<HTMLInputElement | null>(null);

  console.log("state", state);

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);

    // Create a File object from the Blob
    const file = new File([blob], "audio.webm", { type: blob.type });

    // Set the file as the value of the file input element
    if (fileRef.current) {
      // Create a DataTransfer object to simulate a file input event
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;
    }
  };

  return (
    <main className="p-24">
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadFileExtension="webm"
      />

      <form action={formAction}>
        <input type="file" name="audio" ref={fileRef} />

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
