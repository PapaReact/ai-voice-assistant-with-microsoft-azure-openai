"use server";

import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

async function transcript(formData: FormData) {
  "use server";
  if (
    process.env.AZURE_API_KEY === undefined ||
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined
  ) {
    console.error("Azure credentials not set");
    return;
  }

  const file = formData.get("audio") as File;
  if (!file) {
    console.error("No file provided");
    return;
  }

  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);

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

export default transcript;
