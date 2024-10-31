"use client";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { socket, setChatId, setChatName } = useContext(AppContext);
  const [chatId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleJoinChat = () => {
    setLoading(true);
    socket?.emit("join-chat", {
      chatId,
      name,
    });
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  useEffect(() => {
    socket?.on("joined-chat", (data: { chatId: string; name: string }) => {
      setLoading(false);
      setChatName!(data.name);
      setChatId!(data.chatId);
      router.push(`/chat/${data.chatId}`);
    });
  }, [socket]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] mt-5">
      <div className="flex flex-col gap-3 pt-5">
        <div>
          <h1 className="pt-5">
            Simple real time <span className="text-blue-500">Chat</span>
          </h1>
        </div>
        <div className="w-full flex flex-col gap-2">
          <span>nombre</span>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="nombre"
            className="border border-black rounded-lg p-1"
            type="text"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <span>Room ID</span>
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
