
"use client";

import { AppLayout } from '@/components/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Palette, Globe, DollarSign, Bell, Fingerprint } from 'lucide-react';
import { useState } from 'react';
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


export default function SettingsPage() {
  const { toast } = useToast();
  const { isPinEnabled, enablePin, disablePin, changePin } = usePinLock();

  const [selectedCurrency, setSelectedCurrency] = useState('bdt'); // Default to BDT
  const [selectedLanguage, setSelectedLanguage] = useState('bn'); // Default to Bangla
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [summaryNotifications, setSummaryNotifications] = useState(false);
  
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [pinDialogMode, setPinDialogMode] = useState<'setup' | 'changeNew'>('setup');
  
  const [isChangePinDialogOpen, setIsChangePinDialogOpen] = useState(false);
  const [currentPinForChange, setCurrentPinForChange] = useState('');
  const [changePinError, setChangePinError] = useState<string | null>(null);


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
    // Toast is shown in PinDialog
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
                onValueChange={(value) => {
                  setSelectedCurrency(value);
                  const currencyMap: {[key:string]: string} = {"usd": "USD ($)", "eur": "EUR (€)", "gbp": "GBP (£)", "inr": "INR (₹)", "bdt": "BDT (৳)"};
                  toast({ title: "মুদ্রা আপডেট করা হয়েছে", description: `মুদ্রা ${currencyMap[value]}-তে সেট করা হয়েছে। (পছন্দ এখনও সংরক্ষিত হয়নি)` });
                }}
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
             <div className="p-6 border border-dashed rounded-lg text-center bg-muted/20">
                <DollarSign className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <h4 className="text-md font-semibold">আরও আর্থিক সেটিংস শীঘ্রই আসছে!</h4>
                <p className="text-sm text-muted-foreground">
                  যেমন ডিফল্ট অ্যাকাউন্ট, অর্থবছর শুরু ইত্যাদি।
                </p>
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
                onValueChange={(value) => {
                  setSelectedLanguage(value);
                  toast({ title: "ভাষা আপডেট করা হয়েছে", description: `ভাষা ${value === 'bn' ? 'বাংলা' : 'English'}-তে সেট করা হয়েছে। (UI অনুবাদ এবং পছন্দ সংরক্ষণ এখনও প্রয়োগ করা হয়নি)` });
                }}
              >
                <SelectTrigger id="language-selector" className="w-[180px]">
                  <SelectValue placeholder="ভাষা নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es" disabled>Español (শীঘ্রই আসছে)</SelectItem>
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
            <CardDescription>আপনার বিজ্ঞপ্তি পছন্দগুলি পরিচালনা করুন।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="reminder-notifications" className="text-base">রিমাইন্ডার বিজ্ঞপ্তি</Label>
                <Switch 
                  id="reminder-notifications" 
                  checked={reminderNotifications}
                  onCheckedChange={(checked) => {
                    setReminderNotifications(checked);
                    toast({ title: "বিজ্ঞপ্তি সেটিংস আপডেট করা হয়েছে", description: `রিমাইন্ডার বিজ্ঞপ্তি ${checked ? 'সক্ষম' : 'অক্ষম'} করা হয়েছে। (পছন্দ এখনও সংরক্ষিত হয়নি)` });
                  }}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="summary-notifications" className="text-base">সাপ্তাহিক সারাংশ</Label>
                <Switch 
                  id="summary-notifications" 
                  checked={summaryNotifications}
                  onCheckedChange={(checked) => {
                    setSummaryNotifications(checked);
                    toast({ title: "বিজ্ঞপ্তি সেটিংস আপডেট করা হয়েছে", description: `সাপ্তাহিক সারাংশ ${checked ? 'সক্ষম' : 'অক্ষম'} করা হয়েছে। (পছন্দ এখনও সংরক্ষিত হয়নি)` });
                  }}
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
            <CardDescription>আপনার অ্যাপের নিরাপত্তা বৃদ্ধি করুন। পিন ডেমো উদ্দেশ্যে localStorage-এ সংরক্ষণ করা হয় এবং প্রোডাকশনের জন্য নিরাপদ নয়।</CardDescription>
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
            <p className="text-sm text-muted-foreground">
                বায়োমেট্রিক প্রমাণীকরণ (ফিঙ্গারপ্রিন্ট/ফেস আইডি) সাধারণত আপনার ডিভাইস/ব্রাউজার দ্বারা পরিচালিত হয় এবং ওয়েব অ্যাপের জন্য এখানে সরাসরি কনফিগার করা যায় না।
            </p>
          </CardContent>
        </Card>
      </div>

      <PinDialog
        open={isPinDialogOpen}
        mode={pinDialogMode}
        onOpenChange={setIsPinDialogOpen}
        onPinSet={handleSetPin}
        onPinChanged={handleActualPinChange}
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
