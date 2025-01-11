import React, { ReactNode, useContext, useState } from "react";
import { useQuery } from "react-query";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import Toast from "../components/Toast";
import * as apiClient from "../api-client"

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

type appContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
}

const AppContext = React.createContext<appContext | undefined>(undefined);
const stripePromise = loadStripe(STRIPE_PUB_KEY);


export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });

    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => { setToast(toastMessage) },
            isLoggedIn: !isError,
            stripePromise
        }}
        >
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)} />}
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext) as appContext;
    return context;
}