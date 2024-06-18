import React, { ReactNode, useContext, useState } from "react";
import { useQuery } from "react-query";
import Toast from "../components/Toast";
import * as apiClient from "../api-client"

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
}

type appContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
}

const AppContext = React.createContext<appContext | undefined>(undefined);


export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  return (
    <AppContext.Provider value={{ showToast: (toastMessage) => { setToast(toastMessage) }, isLoggedIn: !isError }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)} />}
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext) as appContext;
  return context;
}