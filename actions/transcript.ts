"use server";

import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

async function transcript(prevState: any, formData: FormData) {
  "use server";

  console.log("PREVIOUS STATE:", prevState);
  if (
    process.env.AZURE_API_KEY === undefined ||
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined
  ) {
    console.error("Azure credentials not set");
    return {
      message: "Azure credentials not set",
    };
  }

  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      message: "No audio file provided",
    };
  }

  console.log(">>", file);

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

  return { message: result.text };
}

export default transcript;
