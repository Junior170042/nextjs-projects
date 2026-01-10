"use client";
import React from "react";
import { useCallback } from "react";

//modal context
type ModalContextType = {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = () => {
    const context = React.useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    return context;
};
