
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
  onPinSet?: (pin: string) => void;
  onPinChanged?: (newPin: string) => void;
}

const PIN_LENGTH = 4;

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
    const numericValue = value.replace(/\D/g, ''); 
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
        setError(`পিন অবশ্যই ${PIN_LENGTH} সংখ্যার হতে হবে।`);
        return;
      }
      setMode('confirmSetup');
    } else if (mode === 'confirmSetup') {
      if (pin !== confirmPin) {
        setError('পিন মেলেনি।');
        return;
      }
      onPinSet?.(pin);
      toast({ title: "পিন সেট হয়েছে", description: "আপনার পিন সফলভাবে সেট করা হয়েছে।" });
      onOpenChange(false);
    } else if (mode === 'changeNew') {
      if (newPin.length !== PIN_LENGTH) {
        setError(`নতুন পিন অবশ্যই ${PIN_LENGTH} সংখ্যার হতে হবে।`);
        return;
      }
      setConfirmPin(''); 
      setMode('confirmNew');
    } else if (mode === 'confirmNew') {
      if (newPin !== confirmPin) {
        setError('নতুন পিন মেলেনি।');
        return;
      }
      onPinChanged?.(newPin); 
      toast({ title: "পিন পরিবর্তিত হয়েছে", description: "আপনার পিন সফলভাবে পরিবর্তিত হয়েছে।" });
      onOpenChange(false);
    }
  };
  
  const getTitle = () => {
    if (mode === 'setup') return "পিন সেট আপ করুন";
    if (mode === 'confirmSetup') return "আপনার পিন নিশ্চিত করুন";
    if (mode === 'changeNew') return "নতুন পিন সেট করুন";
    if (mode === 'confirmNew') return "নতুন পিন নিশ্চিত করুন";
    return "পিন ডায়ালগ";
  }

  const getDescription = () => {
     if (mode === 'setup') return `আপনার অ্যাপের জন্য একটি ${PIN_LENGTH}-সংখ্যার পিন তৈরি করুন।`;
     if (mode === 'confirmSetup') return "নিশ্চিত করতে অনুগ্রহ করে আপনার পিন পুনরায় লিখুন।";
     if (mode === 'changeNew') return `আপনার নতুন ${PIN_LENGTH}-সংখ্যার পিন লিখুন।`;
     if (mode === 'confirmNew') return "নিশ্চিত করতে অনুগ্রহ করে আপনার নতুন পিন পুনরায় লিখুন।";
     return "";
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setMode(initialMode); 
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
              <Label htmlFor="pin">পিন লিখুন</Label>
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
              <Label htmlFor="confirmPin">{mode === 'confirmSetup' ? 'পিন নিশ্চিত করুন' : 'নতুন পিন নিশ্চিত করুন'}</Label>
              <Input
                id="confirmPin"
                type="password"
                maxLength={PIN_LENGTH}
                value={confirmPin}
                onChange={(e) => handlePinInputChange(e.target.value, 'confirmPin')}
                className="text-center tracking-[0.5em]"
              />
               {mode === 'confirmSetup' && <p className="text-xs text-muted-foreground text-center">আপনি লিখেছেন: {pin.split('').map(() => '•').join('')}</p>}
               {mode === 'confirmNew' && <p className="text-xs text-muted-foreground text-center">নতুন পিন: {newPin.split('').map(() => '•').join('')}</p>}
            </div>
          )}

          {(mode === 'changeNew') && (
             <div className="space-y-1">
              <Label htmlFor="newPin">নতুন পিন লিখুন</Label>
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
              বাতিল
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            {mode === 'setup' && 'পরবর্তী'}
            {(mode === 'confirmSetup') && 'পিন সেট করুন'}
            {mode === 'changeNew' && 'পরবর্তী'}
            {(mode === 'confirmNew') && 'পিন পরিবর্তন করুন'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
