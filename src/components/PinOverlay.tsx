
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SaverlyLogo } from '@/components/icons';
import { usePinLock } from '@/contexts/PinLockContext';

const PIN_LENGTH = 4;

export function PinOverlay() {
  const { attemptUnlock } = usePinLock();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePinInputChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= PIN_LENGTH) {
      setPin(numericValue);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (pin.length !== PIN_LENGTH) {
      setError(`পিন অবশ্যই ${PIN_LENGTH} সংখ্যার হতে হবে।`);
      return;
    }
    if (!attemptUnlock(pin)) {
      setError('ভুল পিন। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setPin(''); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <Card className="w-full max-w-xs shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <SaverlyLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">পিন লিখুন</CardTitle>
          <CardDescription>সেভারলি আনলক করতে অনুগ্রহ করে আপনার {PIN_LENGTH}-সংখ্যার পিন লিখুন।</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Input
              type="password"
              value={pin}
              onChange={(e) => handlePinInputChange(e.target.value)}
              maxLength={PIN_LENGTH}
              placeholder="••••"
              className="text-center text-2xl tracking-[0.5em] h-14"
              autoFocus
            />
            <Button type="submit" className="w-full">
              আনলক
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
