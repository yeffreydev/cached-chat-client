"use client";

import { AppContext } from "@/app/context/AppProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface MessageI {
  text: string;
  owner: boolean;
  name: string;
}

const Message = ({ text, name, owner }: MessageI) => {
  return (
    <div className={`flex ${owner ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
          owner ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {!owner && <h1 className="font-bold mb-1">{name}</h1>}
        <p>{text}</p>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const { chatId, socket, chatName } = useContext(AppContext);
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<MessageI[]>([]);
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
      name: chatName,
    });
    setMessage("");
  };

  useEffect(() => {
    socket?.on(
      "chat",
      (data: { message: string; name: string; id: string }) => {
        setMessages((prev) => [
          ...prev,
          {
            text: data.message,
            owner: socket?.id === data.id,
            name: data.name,
          },
        ]);
      }
    );
    return () => {
      socket?.off("chat");
    };
  }, [socket]);

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
        <div>name : {chatName}</div>
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
          className="flex-1 overflow-y-scroll border border-red-400 pb-[100px]"
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              text={message.text}
              owner={message.owner}
              name={message.name}
            />
          ))}
        </div>
        <div className="bg-gray-300 py-2 px-7 flex gap-5 fixed bottom-0">
          <input
            className=" border border-black p-1 rounded-lg"
            placeholder="type message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button
            onClick={handleSendMessage}
            className="bg-black text-white px-5 rounded-lg "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
