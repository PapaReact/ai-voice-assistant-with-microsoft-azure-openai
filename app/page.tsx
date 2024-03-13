import transcript from "@/actions/transcript";

export default function Home() {
  // const [state, formAction] = useFormState(transcript, initialState);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Lets build siri</h1>

      <form action={transcript}>
        <input type="file" name="audio" />

        <button type="submit">Send Audio</button>
      </form>
    </main>
  );
}
