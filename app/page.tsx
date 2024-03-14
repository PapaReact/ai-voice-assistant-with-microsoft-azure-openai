"use client";

import transcript from "@/actions/transcript";
import SubmitButton from "@/components/SubmitButton";
import { useFormState } from "react-dom";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Recorder from "@/components/Recorder";
import TextToSpeech from "@/components/TextToSpeech";

const initialState = {
  sender: "",
  response: "",
};

type Message = {
  sender: string;
  response: string;
};

// const TIME_PER_KB = 0.007576; // Estimated seconds per kilobyte

export default function Home() {
  const [state, formAction] = useFormState(transcript, initialState);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);

  console.log("state", state);

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices[0]);
  }, []);

  useEffect(() => {
    if (state) {
      setMessages((messages) => [
        ...messages,
        {
          sender: state.sender || "",
          response: state.response || "",
        },
      ]);
    }
  }, [state]);

  console.log(state);

  const uploadAudio = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    // Create a File object from the Blob
    const file = new File([blob], "audio.webm", { type: blob.type });

    // Set the file as the value of the file input element
    if (fileRef.current) {
      // Create a DataTransfer object to simulate a file input event
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      // Submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  useEffect(() => {
    const synth = window.speechSynthesis;

    if (!state.response) return;

    const wordsToSay = new SpeechSynthesisUtterance(state.response);

    wordsToSay.voice = voice;
    wordsToSay.pitch = pitch;
    wordsToSay.rate = rate;
    wordsToSay.volume = volume;
    synth.speak(wordsToSay);

    return () => {
      synth.cancel();
    };
  }, [state]);

  const handleVoiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.name === e.target.value);
    if (!voice) return;
    setVoice(voice);
  };

  const handlePitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPitch(parseFloat(e.target.value));
  };

  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <main className="p-24">
      <form action={formAction}>
        <input type="file" name="audio" ref={fileRef} hidden />
        <Recorder uploadAudio={uploadAudio} />
        <SubmitButton />
        <button type="submit" hidden ref={submitButtonRef} />
      </form>

      {state.response && (
        <div className="p-10">
          <h2 className="font-bold text-3xl mb-3">Transcription</h2>
          <p>{state.response}</p>
        </div>
      )}

      {messages.length > 0 && (
        <div className="p-10">
          <h2 className="font-bold text-3xl mb-3">Transcription History</h2>
          <ul>
            {messages.map((message, i) => (
              <li key={i}>
                {message.sender} <br /> {message.response}
              </li>
            ))}
          </ul>
        </div>
      )}

      <label>
        Voice:
        <select value={voice?.name} onChange={handleVoiceChange}>
          {window.speechSynthesis.getVoices().map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </label>

      <div>
        <label>
          Pitch:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={handlePitchChange}
          />
        </label>

        <label>
          Speed:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={handleRateChange}
          />
        </label>
        <br />
        <label>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
        </label>
      </div>

      <TextToSpeech text="HEllo World this is cool" />
    </main>
  );
}
