
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_PIN_KEY = 'app_pin';

interface PinLockContextType {
  isPinEnabled: boolean;
  isAppLocked: boolean;
  enablePin: (pin: string) => void;
  disablePin: () => void;
  changePin: (oldPin: string, newPin: string) => Promise<boolean>;
  attemptUnlock: (pin: string) => boolean;
  lockApp: () => void;
}

const PinLockContext = createContext<PinLockContextType | undefined>(undefined);

export function PinLockProvider({ children }: { children: ReactNode }) {
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [isAppLocked, setIsAppLocked] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pinFromStorage = localStorage.getItem(LOCAL_STORAGE_PIN_KEY);
      setStoredPin(pinFromStorage);
      if (pinFromStorage) {
        setIsAppLocked(true); // Lock app if PIN is set
      }
    }
  }, []);

  const isPinEnabled = storedPin !== null;

  const enablePin = useCallback((pin: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PIN_KEY, pin);
      setStoredPin(pin);
      setIsAppLocked(false); // Unlock after setting/enabling
    }
  }, []);

  const disablePin = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_PIN_KEY);
      setStoredPin(null);
      setIsAppLocked(false);
    }
  }, []);

  const changePin = useCallback(async (oldPin: string, newPin: string): Promise<boolean> => {
    if (typeof window !== 'undefined') {
      const currentPin = localStorage.getItem(LOCAL_STORAGE_PIN_KEY);
      if (currentPin === oldPin) {
        localStorage.setItem(LOCAL_STORAGE_PIN_KEY, newPin);
        setStoredPin(newPin);
        return true;
      }
    }
    return false;
  }, []);

  const attemptUnlock = useCallback((pin: string): boolean => {
    if (typeof window !== 'undefined') {
      const currentPin = localStorage.getItem(LOCAL_STORAGE_PIN_KEY);
      if (currentPin === pin) {
        setIsAppLocked(false);
        return true;
      }
    }
    return false;
  }, []);

  const lockApp = useCallback(() => {
    if (isPinEnabled) {
      setIsAppLocked(true);
    }
  }, [isPinEnabled]);

  return (
    <PinLockContext.Provider
      value={{
        isPinEnabled,
        isAppLocked,
        enablePin,
        disablePin,
        changePin,
        attemptUnlock,
        lockApp,
      }}
    >
      {children}
    </PinLockContext.Provider>
  );
}

export function usePinLock(): PinLockContextType {
  const context = useContext(PinLockContext);
  if (context === undefined) {
    throw new Error('usePinLock must be used within a PinLockProvider');
  }
  return context;
}
