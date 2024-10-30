"use client";

import { AppContext } from "@/app/context/AppProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const Message = ({ text }: { text: string }) => {
  return <div className="border p-3">{text}</div>;
};
export default function ChatPage() {
  const { chatId, socket } = useContext(AppContext);
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isOpenSettins, setIsOpenSettings] = useState<boolean>(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    socket?.emit("chat", {
      message,
      chatId: roomId,
    });
    setMessage("");
  };

  useEffect(() => {
    socket?.on("chat", (data: any) => {
      setMessages((prev) => [...prev, data.message]);
    });
    return () => {
      socket?.off("chat");
    };
  }, []);

  if (!chatId) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <h1>Chat not found</h1>
        <Link href="/">Go to Home</Link>
      </div>
    );
  }
  return (
    <div className="w-screen h-screen flex flex-col">
      <div>
        <button
          onClick={() => setIsOpenSettings(!isOpenSettins)}
          className="bg-black text-white px-5 rounded-lg"
        >
          Settings
        </button>
        {isOpenSettins && (
          <div>
            <h1>Chat Room: {roomId}</h1>
            <button>
              <Link href="/">Leave Chat</Link>
            </button>
          </div>
        )}{" "}
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          ref={chatRef}
          className="flex-1 overflow-y-scroll border border-red-400"
        >
          {messages.map((message, index) => (
            <Message key={index} text={message} />
          ))}
        </div>
        <div className="bg-gray-300 py-2 px-7 flex gap-5">
          <input
            className=" border border-black p-1 rounded-lg"
            placeholder="type message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button
            onClick={handleSendMessage}
            className="bg-black text-white px-5 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
