"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import activeAssistantIcon from "@/img/active.gif";
import notActiveAssistantIcon from "@/img/notactive.png";
import { useFormStatus } from "react-dom";

const mimeType = "audio/webm";

function Recorder({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { pending } = useFormStatus();

  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    if (mediaRecorder === null || stream === null) return;

    if (pending) return;

    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { mimeType: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    if (mediaRecorder.current === null) return;

    if (pending) return;

    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  };

  return (
    <div className="audio-controls">
      {!permission ? (
        <button onClick={getMicrophonePermission} type="button">
          Get Microphone
        </button>
      ) : null}

      {permission && recordingStatus === "inactive" ? (
        <Image
          src={notActiveAssistantIcon}
          alt="Not Recording"
          width={500}
          height={500}
          onClick={startRecording}
          priority={true}
          className={`cursor-pointer 

          ${
            pending
              ? "animate-pulse grayscale"
              : "grayscale-0 hover:scale-110 duration-150 transition-all ease-in-out"
          }`}
        />
      ) : null}
      {recordingStatus === "recording" ? (
        <Image
          src={activeAssistantIcon}
          alt="Recording"
          width={500}
          height={500}
          onClick={stopRecording}
          priority={true}
          className="cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      ) : null}

      {/* {audio ? (
        <div className="audio-container">
          <audio src={audio} controls></audio>
          <a download href={audio}>
            Download Recording
          </a>
        </div>
      ) : null} */}
    </div>
  );
}

export default Recorder;
