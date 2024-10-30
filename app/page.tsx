"use client";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { socket, setChatId } = useContext(AppContext);
  const [chatId, setRoomId] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleJoinChat = () => {
    setLoading(true);
    socket?.emit("join-chat", {
      chatId,
    });
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };
  useEffect(() => {
    socket?.on("joined-chat", (data: { chatId: string }) => {
      setLoading(false);
      console.log(data);
      setChatId!(data.chatId);
      router.push(`/chat/${data.chatId}`);
    });
  }, [socket]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] mt-5">
      <div className="flex flex-col gap-3">
        <div>
          <h1>
            Simple real time <span className="text-blue-500">Chat</span>
          </h1>
        </div>
        <div>
          <input
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="#chat id"
            className="border border-black rounded-lg p-1"
            type="text"
          />
        </div>
        <div>
          <button
            disabled={loading}
            onClick={handleJoinChat}
            className="bg-black py-1 px-5 text-white rounded-lg w-full"
          >
            Join Chat
          </button>
        </div>
      </div>
    </div>
  );
}
