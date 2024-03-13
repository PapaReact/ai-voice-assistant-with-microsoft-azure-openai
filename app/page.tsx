import transcript from "@/actions/transcript";

import { useFormState } from "react-dom";
const fs = require("fs/promises");
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const initialState = {
  audio: null,
};

export default function Home() {
  // const [state, formAction] = useFormState(transcript, initialState);

  const endpoint = "https://siri-assistant-demo.openai.azure.com/"; // TODO: Change me to env variable

  async function sendAudio(formData: FormData) {
    "use server";

    const file = formData.get("audio") as File;

    const arr = await file.arrayBuffer();
    const audio = new Uint8Array(arr);

    console.log(audio);
    if (
      process.env.AZURE_API_KEY === undefined ||
      process.env.AZURE_ENDPOINT === undefined ||
      process.env.AZURE_DEPLOYMENT_NAME === undefined
    ) {
      console.error("Azure credentials not set");
    }

    console.log("== Transcribe Audio Sample ==");

    const client = new OpenAIClient(
      process.env.AZURE_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_API_KEY)
    );

    const result = await client.getAudioTranscription(
      process.env.AZURE_DEPLOYMENT_NAME,
      audio
    );
    console.log(`Transcription: ${result.text}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Lets build siri</h1>

      <form action={sendAudio}>
        <input type="file" name="audio" />

        <button type="submit">Send Audio</button>
      </form>
    </main>
  );
}
