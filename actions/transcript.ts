"use server";

import {
  AzureKeyCredential,
  ChatRequestMessage,
  OpenAIClient,
} from "@azure/openai";

async function transcript(prevState: any, formData: FormData) {
  "use server";

  console.log("PREVIOUS STATE:", prevState);
  if (
    process.env.AZURE_API_KEY === undefined ||
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined ||
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME === undefined
  ) {
    console.error("Azure credentials not set");
    return {
      sender: "",
      response: "Azure credentials not set",
    };
  }

  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
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

  // ---   get chat completion from OpenAI ----

  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant. You will answer questions and reply I cannot answer that if you dont know the answer.",
    },
    { role: "user", content: result.text },
    // {
    //   role: "assistant",
    //   content: "Arrrr! Of course, me hearty! What can I do for ye?",
    // },
    // { role: "user", content: "What's the best way to train a parrot?" },
  ];

  console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);

  const completions = await client.getChatCompletions(
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME,
    messages,
    { maxTokens: 128 }
  );

  console.log("chatbot: ", completions.choices[0].message?.content);

  const response = completions.choices[0].message?.content;
  //   for await (const event of events) {
  //     for (const choice of event.choices) {
  //       const delta = choice.delta?.content;
  //       if (delta !== undefined) {
  //         console.log(`Chatbot: ${delta}`);
  //       }
  //     }
  //   }
  //   ------

  console.log(prevState.sender, "+++", result.text);
  return {
    sender: result.text,
    response: response,
  };
}

export default transcript;
