
"use client";

import { AppLayout } from '@/components/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Palette, Globe, DollarSign, Bell, Fingerprint } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { usePinLock } from '@/contexts/PinLockContext';
import { PinDialog } from '@/components/PinDialog';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CURRENCY_KEY = 'app_currency';
const LANGUAGE_KEY = 'app_language';
const REMINDER_NOTIF_KEY = 'app_reminder_notifications';
const SUMMARY_NOTIF_KEY = 'app_summary_notifications';

export default function SettingsPage() {
  const { toast } = useToast();
  const { isPinEnabled, enablePin, disablePin } = usePinLock(); // Removed changePin for now

  const [selectedCurrency, setSelectedCurrency] = useState('bdt');
  const [selectedLanguage, setSelectedLanguage] = useState('bn');
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [summaryNotifications, setSummaryNotifications] = useState(false);
  
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [pinDialogMode, setPinDialogMode] = useState<'setup' | 'changeNew'>('setup');
  
  const [isChangePinDialogOpen, setIsChangePinDialogOpen] = useState(false);
  const [currentPinForChange, setCurrentPinForChange] = useState('');
  const [changePinError, setChangePinError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSelectedCurrency(localStorage.getItem(CURRENCY_KEY) || 'bdt');
      setSelectedLanguage(localStorage.getItem(LANGUAGE_KEY) || 'bn');
      setReminderNotifications(localStorage.getItem(REMINDER_NOTIF_KEY) === 'true');
      setSummaryNotifications(localStorage.getItem(SUMMARY_NOTIF_KEY) === 'true');
    }
  }, []);

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    localStorage.setItem(CURRENCY_KEY, value);
    const currencyMap: {[key:string]: string} = {"usd": "USD ($)", "eur": "EUR (€)", "gbp": "GBP (£)", "inr": "INR (₹)", "bdt": "BDT (৳)"};
    toast({ title: "মুদ্রা আপডেট করা হয়েছে", description: `মুদ্রা ${currencyMap[value]}-তে সেট করা হয়েছে।` });
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    localStorage.setItem(LANGUAGE_KEY, value);
    toast({ title: "ভাষা আপডেট করা হয়েছে", description: `ভাষা ${value === 'bn' ? 'বাংলা' : 'English'}-তে সেট করা হয়েছে। (সম্পূর্ণ UI অনুবাদ এই মুহূর্তে প্রয়োগ করা হয়নি)` });
    if (value === 'en') {
      alert("Changing language to English would typically reload the app or re-render with new translations. This prototype will just save the preference.");
    }
  };

  const handleReminderNotifChange = (checked: boolean) => {
    setReminderNotifications(checked);
    localStorage.setItem(REMINDER_NOTIF_KEY, String(checked));
    toast({ title: "বিজ্ঞপ্তি সেটিংস আপডেট করা হয়েছে", description: `রিমাইন্ডার বিজ্ঞপ্তি ${checked ? 'সক্ষম' : 'অক্ষম'} করা হয়েছে।` });
  };

  const handleSummaryNotifChange = (checked: boolean) => {
    setSummaryNotifications(checked);
    localStorage.setItem(SUMMARY_NOTIF_KEY, String(checked));
    toast({ title: "বিজ্ঞপ্তি সেটিংস আপডেট করা হয়েছে", description: `সাপ্তাহিক সারাংশ ${checked ? 'সক্ষম' : 'অক্ষম'} করা হয়েছে।` });
  };

  const handleEnablePinLockChange = (checked: boolean) => {
    if (checked) {
      setPinDialogMode('setup');
      setIsPinDialogOpen(true);
    } else {
      disablePin();
      toast({ title: "পিন লক অক্ষম", description: "অ্যাপ পিন লক বন্ধ করা হয়েছে।" });
    }
  };

  const handleSetPin = (pin: string) => {
    enablePin(pin);
  };

  const handleChangePinRequest = () => {
    setCurrentPinForChange('');
    setChangePinError(null);
    setIsChangePinDialogOpen(true);
  };

  const handleVerifyCurrentPinAndProceed = async () => {
    setChangePinError(null);
    const pinFromStorage = localStorage.getItem('app_pin'); 
    if (pinFromStorage === currentPinForChange) {
        setIsChangePinDialogOpen(false); 
        setPinDialogMode('changeNew');    
        setIsPinDialogOpen(true);       
    } else {
        setChangePinError("বর্তমান পিনটি ভুল। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };
  
  const handleActualPinChange = (newPin: string) => {
    enablePin(newPin); 
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-headline">সেটিংস</h1>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-primary" />
              অ্যাপের চেহারা
            </CardTitle>
            <CardDescription>অ্যাপ্লিকেশনের চেহারা ও অনুভূতি কাস্টমাইজ করুন।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="text-base">থিম</Label>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              আর্থিক পছন্দসমূহ
            </CardTitle>
             <CardDescription>আপনার মুদ্রা এবং আর্থিক প্রদর্শন সেটিংস পরিচালনা করুন।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="currency-selector" className="text-base">মুদ্রা</Label>
              <Select 
                value={selectedCurrency} 
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger id="currency-selector" className="w-[180px]">
                  <SelectValue placeholder="মুদ্রা নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bdt">BDT (৳)</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                ভাষা ও অঞ্চল
            </CardTitle>
            <CardDescription>আপনার পছন্দের ভাষা এবং আঞ্চলিক ফরম্যাট সেট করুন।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
              <Label htmlFor="language-selector" className="text-base">ভাষা</Label>
              <Select 
                value={selectedLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger id="language-selector" className="w-[180px]">
                  <SelectValue placeholder="ভাষা নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                বিজ্ঞপ্তি
            </CardTitle>
            <CardDescription>আপনার বিজ্ঞপ্তি পছন্দগুলি পরিচালনা করুন (বর্তমানে ডেমো)।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="reminder-notifications" className="text-base">রিমাইন্ডার বিজ্ঞপ্তি</Label>
                <Switch 
                  id="reminder-notifications" 
                  checked={reminderNotifications}
                  onCheckedChange={handleReminderNotifChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="summary-notifications" className="text-base">সাপ্তাহিক সারাংশ</Label>
                <Switch 
                  id="summary-notifications" 
                  checked={summaryNotifications}
                  onCheckedChange={handleSummaryNotifChange}
                />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-6 w-6 text-primary" />
                নিরাপত্তা
            </CardTitle>
            <CardDescription>আপনার অ্যাপের নিরাপত্তা বৃদ্ধি করুন। পিন localStorage-এ সংরক্ষণ করা হয়।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="pin-lock" className="text-base">পিন লক সক্ষম করুন</Label>
                <Switch 
                  id="pin-lock" 
                  checked={isPinEnabled}
                  onCheckedChange={handleEnablePinLockChange}
                />
            </div>
            <Button 
              variant="outline" 
              disabled={!isPinEnabled}
              onClick={handleChangePinRequest}
            >
              পিন পরিবর্তন করুন
            </Button>
          </CardContent>
        </Card>
      </div>

      <PinDialog
        open={isPinDialogOpen}
        mode={pinDialogMode}
        onOpenChange={setIsPinDialogOpen}
        onPinSet={handleSetPin}
        onPinChanged={handleActualPinChange} // connect this prop
      />
      
      <AlertDialog open={isChangePinDialogOpen} onOpenChange={setIsChangePinDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>পিন পরিবর্তন করুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনার পিন পরিবর্তন করতে, প্রথমে আপনার বর্তমান পিন প্রবেশ করান।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            {changePinError && <p className="text-sm text-destructive">{changePinError}</p>}
            <Label htmlFor="current-pin-change">বর্তমান পিন</Label>
            <Input
              id="current-pin-change"
              type="password"
              value={currentPinForChange}
              onChange={(e) => setCurrentPinForChange(e.target.value.replace(/\D/g, '').slice(0,4))}
              maxLength={4}
              className="text-center tracking-[0.5em]"
              autoComplete="new-password"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentPinForChange('')}>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerifyCurrentPinAndProceed}>যাচাই করুন ও এগিয়ে যান</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
