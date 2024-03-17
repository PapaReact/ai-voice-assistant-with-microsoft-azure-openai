import { Message } from "@/app/page";
import SubmitButton from "./SubmitButton";
import { ChevronDownCircle } from "lucide-react";

interface Props {
  messages: Message[];
}

function Messages({ messages }: Props) {
  const DummyMessages = [
    {
      sender: "Hello",
      response:
        "Once upon a time, in a small village nestled at the foot of a mighty mountain, there lived a young girl named Lily. Lily was known for her adventurous spirit and endless curiosity. One day, as she was exploring the dense forest that surrounded her village, she stumbled upon a hidden path she had never seen before. Intrigued, Lily decided to follow the path and see where it led. As she walked deeper into the forest, the sounds of chirping birds and rustling leaves filled the air around her. After a while, she found herself in a meadow bathed in golden sunlight. In the center of the me",
      id: "1",
    },
    {
      sender:
        "Once upon a time, in a small village nestled at the foot of a mighty mountain, there lived a young girl named Lily. Lily was known for her adventurous spirit and endless curiosity. One day, as she was exploring the dense forest that surrounded her village, she stumbled upon a hidden path she had never seen before. Intrigued, Lily decided to follow the path and see where it led. As she walked deeper into the forest, the sounds of chirping birds and rustling leaves filled the air around her. After a while, she found herself in a meadow bathed in golden sunlight. In the center of the me",
      response: "I'm good",
      id: "2",
    },
    {
      sender: "What's your name?",
      response: "I'm a bot",
      id: "3",
    },
    {
      sender: "Hello",
      response:
        "Once upon a time, in a small village nestled at the foot of a mighty mountain, there lived a young",
      id: 4,
    },
    {
      sender: "Hello",
      response:
        "Once upon a time, in a small village nestled at the foot of a mighty mountain, there lived a young",
      id: 4,
    },
    {
      sender: "Hello",
      response:
        "Once upon a time, in a small village nestled at the foot of a mighty mountain, there lived a young",
      id: 4,
    },
    {
      sender: "Hello",
      response:
        "Once upon a time, in a small village nestled at the foot of a mighty mountain, there lived a young",
      id: 4,
    },
  ];
  return (
    <div
      className={`flex flex-col min-h-screen p-5 pt-20 ${
        messages.length > 0 ? "pb-96" : "pb-32"
      }`}
    >
      <div className="flex flex-col flex-1 space-y-5 max-w-3xl mx-auto">
        <SubmitButton />

        {!messages.length && (
          <div className="flex flex-col space-y-10 flex-1 items-center justify-end pl-6">
            <p className="text-gray-500 animate-pulse">Start a conversation</p>
            <ChevronDownCircle
              size={64}
              className="animate-bounce text-gray-500"
            />
          </div>
        )}

        <div className="p-5 space-y-5">
          {messages.map((message) => (
            <div key={message.id} className="space-y-5">
              {/* reciever */}
              <div className="pr-48">
                <p className="message bg-gray-800 rounded-bl-none">
                  {message.response}
                </p>
              </div>

              {/* sender */}
              <div className="pl-48">
                <p className="message text-left ml-auto rounded-br-none">
                  {message.sender}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Messages;
