
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type PinDialogMode = 'setup' | 'confirmSetup' | 'changeCurrent' | 'changeNew' | 'confirmNew';

interface PinDialogProps {
  open: boolean;
  mode: PinDialogMode;
  onOpenChange: (open: boolean) => void;
  onPinSet?: (pin: string) => void; // For initial setup
  onPinChanged?: (newPin: string) => void; // For changing PIN
  currentPinToVerify?: string; // Only for 'changeCurrent' mode
}

const PIN_LENGTH = 4; // Or 6, as preferred

export function PinDialog({
  open,
  mode: initialMode,
  onOpenChange,
  onPinSet,
  onPinChanged,
}: PinDialogProps) {
  const [mode, setMode] = useState<PinDialogMode>(initialMode);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMode(initialMode);
    setPin('');
    setConfirmPin('');
    setNewPin('');
    setError(null);
  }, [open, initialMode]);

  const handlePinInputChange = (value: string, field: 'pin' | 'confirmPin' | 'newPin') => {
    const numericValue = value.replace(/\D/g, ''); // Allow only digits
    if (numericValue.length <= PIN_LENGTH) {
      if (field === 'pin') setPin(numericValue);
      else if (field === 'confirmPin') setConfirmPin(numericValue);
      else if (field === 'newPin') setNewPin(numericValue);
      setError(null);
    }
  };

  const handleSubmit = () => {
    setError(null);
    if (mode === 'setup') {
      if (pin.length !== PIN_LENGTH) {
        setError(`PIN must be ${PIN_LENGTH} digits.`);
        return;
      }
      setMode('confirmSetup');
    } else if (mode === 'confirmSetup') {
      if (pin !== confirmPin) {
        setError('PINs do not match.');
        return;
      }
      onPinSet?.(pin);
      toast({ title: "PIN Set", description: "Your PIN has been successfully set." });
      onOpenChange(false);
    } else if (mode === 'changeCurrent') {
      // This mode implies external verification of current PIN via usePinLock.changePin
      // This dialog part is for setting the new PIN after old one is verified.
      // So, we transition directly to setting the new PIN.
      setMode('changeNew');
    } else if (mode === 'changeNew') {
      if (newPin.length !== PIN_LENGTH) {
        setError(`New PIN must be ${PIN_LENGTH} digits.`);
        return;
      }
      setConfirmPin(''); // Clear confirm for new pin entry
      setMode('confirmNew');
    } else if (mode === 'confirmNew') {
      if (newPin !== confirmPin) {
        setError('New PINs do not match.');
        return;
      }
      onPinChanged?.(newPin); // This callback should internally handle verification of old PIN if needed
      toast({ title: "PIN Changed", description: "Your PIN has been successfully changed." });
      onOpenChange(false);
    }
  };
  
  const getTitle = () => {
    if (mode === 'setup') return "Set Up PIN";
    if (mode === 'confirmSetup') return "Confirm Your PIN";
    if (mode === 'changeCurrent') return "Enter Current PIN"; // This state is mostly handled by settings page logic
    if (mode === 'changeNew') return "Set New PIN";
    if (mode === 'confirmNew') return "Confirm New PIN";
    return "PIN Dialog";
  }

  const getDescription = () => {
     if (mode === 'setup') return `Create a ${PIN_LENGTH}-digit PIN for your app.`;
     if (mode === 'confirmSetup') return "Please re-enter your PIN to confirm.";
     if (mode === 'changeCurrent') return `Enter your current ${PIN_LENGTH}-digit PIN.`;
     if (mode === 'changeNew') return `Enter your new ${PIN_LENGTH}-digit PIN.`;
     if (mode === 'confirmNew') return "Please re-enter your new PIN to confirm.";
     return "";
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setMode(initialMode); // Reset mode if dialog is closed externally
        setPin('');
        setConfirmPin('');
        setNewPin('');
        setError(null);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          
          {(mode === 'setup') && (
            <div className="space-y-1">
              <Label htmlFor="pin">Enter PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={PIN_LENGTH}
                value={pin}
                onChange={(e) => handlePinInputChange(e.target.value, 'pin')}
                className="text-center tracking-[0.5em]"
              />
            </div>
          )}

          {(mode === 'confirmSetup' || mode === 'confirmNew') && (
            <div className="space-y-1">
              <Label htmlFor="confirmPin">{mode === 'confirmSetup' ? 'Confirm PIN' : 'Confirm New PIN'}</Label>
              <Input
                id="confirmPin"
                type="password"
                maxLength={PIN_LENGTH}
                value={confirmPin}
                onChange={(e) => handlePinInputChange(e.target.value, 'confirmPin')}
                className="text-center tracking-[0.5em]"
              />
               {mode === 'confirmSetup' && <p className="text-xs text-muted-foreground text-center">You entered: {pin.split('').map(() => '*').join('')}</p>}
               {mode === 'confirmNew' && <p className="text-xs text-muted-foreground text-center">New PIN: {newPin.split('').map(() => '*').join('')}</p>}
            </div>
          )}

          {(mode === 'changeNew') && (
             <div className="space-y-1">
              <Label htmlFor="newPin">Enter New PIN</Label>
              <Input
                id="newPin"
                type="password"
                maxLength={PIN_LENGTH}
                value={newPin}
                onChange={(e) => handlePinInputChange(e.target.value, 'newPin')}
                className="text-center tracking-[0.5em]"
              />
            </div>
          )}

        </div>
        <DialogFooter className="sm:justify-between gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            {mode === 'setup' && 'Next'}
            {mode === 'confirmSetup' && 'Set PIN'}
            {mode === 'changeNew' && 'Next'}
            {mode === 'confirmNew' && 'Change PIN'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
