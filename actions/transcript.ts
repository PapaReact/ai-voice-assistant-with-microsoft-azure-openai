"use server";

import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

async function transcript(prevState: any, formData: FormData) {
  console.log(prevState);
  if (!formData) return;

  console.log(formData.get("audio"));
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

  var reader = new FileReader();

  reader.onabort = () => console.log("file reading was aborted");
  reader.onerror = () => console.log("file reading has failed");

  reader.onload = async (e: ProgressEvent<FileReader>) => {
    if (e.target?.result) {
      const audio = e.target.result as string;

      const result = await client.getAudioTranscription(
        process.env.AZURE_DEPLOYMENT_NAME,
        audio
      );

      console.log(`Transcription: ${result.text}`);
    }
  };
  reader.readAsArrayBuffer(file);

  return true;
}

export default transcript;
