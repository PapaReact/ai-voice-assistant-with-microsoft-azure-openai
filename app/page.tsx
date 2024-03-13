"use client";

import { useState } from "react";

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const endpoint = "https://siri-assistant-demo.openai.azure.com/"; // TODO: Change me to env variable

  async function sendAudio() {
    if (!file) return;

    console.log("== Transcribe Audio Sample ==");

    const client = new OpenAIClient(
      endpoint,
      new AzureKeyCredential(process.env.AZURE_API_KEY)
    );
    const deploymentName = "siri-assistant";

    var reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const audio = e.target.result as string;

        const result = await client.getAudioTranscription(
          deploymentName,
          audio
        );

        console.log(`Transcription: ${result.text}`);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Lets build siri</h1>

      <form>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target?.files?.[0];
            if (file) setFile(file);

            console.log(file);
          }}
        />

        <button
          onClick={() => {
            sendAudio();
          }}
        >
          Send Audio
        </button>
      </form>
    </main>
  );
}
