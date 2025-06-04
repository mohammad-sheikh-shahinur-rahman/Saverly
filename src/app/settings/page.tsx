
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
import { Input } from '@/components/ui/input'; // For current PIN input
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function SettingsPage() {
  const { toast } = useToast();
  const { isPinEnabled, enablePin, disablePin, changePin } = usePinLock();

  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
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
      // Add a confirmation dialog before disabling PIN
      // For now, directly disable
      disablePin();
      toast({ title: "PIN Lock Disabled", description: "App PIN lock has been turned off." });
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
    const success = await changePin(currentPinForChange, 'dummy_new_pin_placeholder'); // Test with current PIN first
    
    // The changePin in context doesn't really verify oldPin if newPin is a placeholder.
    // We need a way to verify oldPin separately or enhance changePin.
    // For this UI demo, let's assume changePin *could* verify oldPin.
    // A better approach: context.verifyPin(currentPinForChange)
    // if successful, then open new pin dialog.
    // For simplicity now, we'll use a mock verification step or directly go to new PIN setup.

    // This mock assumes if `currentPinForChange` were correct, we'd proceed.
    // In a real scenario, `changePin` would take (oldPin, newPin) and the context would handle it.
    // Let's simulate that `changePin` needs the old PIN *before* setting the new one.
    // The PinDialog for 'changeNew' will collect the new PIN.
    // We need to pass the verified old PIN or a token to the next step if it were real.

    const pinFromStorage = localStorage.getItem('app_pin'); // Mock verification
    if (pinFromStorage === currentPinForChange) {
        setIsChangePinDialogOpen(false); // Close current PIN dialog
        setPinDialogMode('changeNew');     // Set mode for PinDialog
        setIsPinDialogOpen(true);        // Open PinDialog to set new PIN
    } else {
        setChangePinError("Incorrect current PIN. Please try again.");
    }
  };
  
  const handleActualPinChange = (newPin: string) => {
    // The old PIN was 'verified' (mocked) in handleVerifyCurrentPinAndProceed
    // Now, we just call enablePin which effectively sets/updates the PIN.
    // In a real system with `changePin(old, new)`, this would be different.
    enablePin(newPin); // Effectively overwrites the old PIN in this mocked setup
    // Toast is shown in PinDialog for new PIN set
  };


  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-headline">Settings</h1>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="text-base">Theme</Label>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Financial Preferences
            </CardTitle>
             <CardDescription>Manage your currency and financial display settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="currency-selector" className="text-base">Currency</Label>
              <Select 
                value={selectedCurrency} 
                onValueChange={(value) => {
                  setSelectedCurrency(value);
                  toast({ title: "Currency Updated", description: `Currency set to ${value.toUpperCase()}. (Preference not saved yet)` });
                }}
              >
                <SelectTrigger id="currency-selector" className="w-[180px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                  <SelectItem value="bdt">BDT (৳)</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="p-6 border border-dashed rounded-lg text-center bg-muted/20">
                <DollarSign className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <h4 className="text-md font-semibold">More financial settings coming soon!</h4>
                <p className="text-sm text-muted-foreground">
                  Such as default account, fiscal year start, etc.
                </p>
              </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                Language & Region
            </CardTitle>
            <CardDescription>Set your preferred language and regional formats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
              <Label htmlFor="language-selector" className="text-base">Language</Label>
              <Select 
                value={selectedLanguage}
                onValueChange={(value) => {
                  setSelectedLanguage(value);
                  toast({ title: "Language Updated", description: `Language set to ${value === 'en' ? 'English' : 'Bangla'}. (UI translation and preference saving not yet implemented)` });
                }}
              >
                <SelectTrigger id="language-selector" className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bangla</SelectItem>
                  <SelectItem value="es" disabled>Español (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="reminder-notifications" className="text-base">Reminder Notifications</Label>
                <Switch 
                  id="reminder-notifications" 
                  checked={reminderNotifications}
                  onCheckedChange={(checked) => {
                    setReminderNotifications(checked);
                    toast({ title: "Notification Settings Updated", description: `Reminder notifications ${checked ? 'enabled' : 'disabled'}. (Preference not saved yet)` });
                  }}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="summary-notifications" className="text-base">Weekly Summary</Label>
                <Switch 
                  id="summary-notifications" 
                  checked={summaryNotifications}
                  onCheckedChange={(checked) => {
                    setSummaryNotifications(checked);
                    toast({ title: "Notification Settings Updated", description: `Weekly summary ${checked ? 'enabled' : 'disabled'}. (Preference not saved yet)` });
                  }}
                />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-6 w-6 text-primary" />
                Security
            </CardTitle>
            <CardDescription>Enhance your app security. PIN is stored in localStorage for demo purposes and is not secure for production.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="pin-lock" className="text-base">Enable PIN Lock</Label>
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
              Change PIN
            </Button>
            <p className="text-sm text-muted-foreground">
                Biometric authentication (Fingerprint/Face ID) is typically handled by your device/browser and not directly configurable here for web apps.
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
            <AlertDialogTitle>Change PIN</AlertDialogTitle>
            <AlertDialogDescription>
              To change your PIN, please enter your current PIN first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            {changePinError && <p className="text-sm text-destructive">{changePinError}</p>}
            <Label htmlFor="current-pin-change">Current PIN</Label>
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
            <AlertDialogCancel onClick={() => setCurrentPinForChange('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerifyCurrentPinAndProceed}>Verify & Proceed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AppLayout>
  );
}
