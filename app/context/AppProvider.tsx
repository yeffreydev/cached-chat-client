"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { appConfig } from "../config/config";
import io from "socket.io-client";

interface AppState {
  socket: SocketIOClient.Socket | null;
  chatId: string | null;
  setChatId?: (chatId: string) => void;
  chatName: string;
  setChatName?: (name: string) => void;
}

const socket = io(`${appConfig.apiHost}`);

const initialState: AppState = {
  socket,
  chatId: null,
  chatName: "",
};

export const AppContext = createContext<AppState>(initialState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [socket] = useState<SocketIOClient.Socket | null>(initialState.socket);
  const [chatId, setChatId] = useState<string | null>(initialState.chatId);
  const [chatName, setChatName] = useState<string>(initialState.chatName);
  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connected with connection id " + socket.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        chatName,
        chatId,
        setChatId,
        socket,
        setChatName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
