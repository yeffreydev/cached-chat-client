"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { appConfig } from "../config/config";
import { io } from "socket.io-client";

interface AppState {
  socket: SocketIOClient.Socket | null;
  chatId: string | null;
  setChatId?: (chatId: string) => void;
}

const socket = io(`${appConfig.apiHost}`);

const initialState: AppState = {
  socket,
  chatId: null,
};

export const AppContext = createContext<AppState>(initialState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(
    initialState.socket
  );
  const [chatId, setChatId] = useState<string | null>(initialState.chatId);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connected with connection id " + socket.id);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        chatId,
        setChatId,
        socket,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
