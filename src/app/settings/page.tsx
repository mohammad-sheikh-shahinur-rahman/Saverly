
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

export default function SettingsPage() {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [summaryNotifications, setSummaryNotifications] = useState(false);
  const [pinLockEnabled, setPinLockEnabled] = useState(false);

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
            <CardDescription>Enhance your app security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="pin-lock" className="text-base">Enable PIN Lock</Label>
                <Switch 
                  id="pin-lock" 
                  checked={pinLockEnabled}
                  onCheckedChange={(checked) => {
                    setPinLockEnabled(checked);
                    toast({ title: "Security Settings Updated", description: `PIN Lock ${checked ? 'enabled' : 'disabled'}. (Functionality not saved yet)` });
                  }}
                />
            </div>
            <Button 
              variant="outline" 
              disabled={!pinLockEnabled}
              onClick={() => toast({ title: "Change PIN", description: "PIN change functionality is not yet implemented."})}
            >
              Change PIN
            </Button>
            <p className="text-sm text-muted-foreground">
                Biometric authentication (Fingerprint/Face ID) is typically handled by your device/browser and not directly configurable here for web apps.
            </p>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
