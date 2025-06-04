
"use client";

import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SaverlyLogo } from '@/components/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { Hash } from 'lucide-react'; 
import React, { useState, useEffect, Suspense } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { ConfirmationResult } from 'firebase/auth';

// Extend window type for confirmationResult
declare global {
  interface Window { 
    confirmationResult?: ConfirmationResult;
  }
}

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP অবশ্যই ৬ সংখ্যার হতে হবে।" }),
});

type OtpFormValues = z.infer<typeof otpSchema>;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber');
  const isSignUp = searchParams.get('isSignUp') === 'true';
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResultState, setConfirmationResultState] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.confirmationResult) {
      setConfirmationResultState(window.confirmationResult);
    } else if (typeof window !== 'undefined' && !window.confirmationResult) {
      toast({
        title: "ত্রুটি",
        description: "OTP যাচাইকরণের জন্য প্রয়োজনীয় তথ্য পাওয়া যায়নি। অনুগ্রহ করে আবার ফোন নম্বর দিয়ে চেষ্টা করুন।",
        variant: "destructive",
      });
      router.replace(`/auth/phone-signin?isSignUp=${isSignUp ? 'true' : 'false'}`);
    }
  }, [isSignUp, router, toast]);


  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: OtpFormValues) {
    setIsLoading(true);
    if (!confirmationResultState) {
      toast({ title: "ত্রুটি", description: "OTP যাচাইকরণ সেশন খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।", variant: "destructive" });
      setIsLoading(false);
      router.replace(`/auth/phone-signin?isSignUp=${isSignUp ? 'true' : 'false'}`);
      return;
    }

    try {
      await confirmationResultState.confirm(values.otp);
      toast({ title: "সফল", description: `সফলভাবে ${isSignUp ? 'সাইন আপ' : 'সাইন ইন'} করেছেন।` });
      if (typeof window !== 'undefined') {
        delete window.confirmationResult;
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      let errorMessage = "OTP যাচাই করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = "ভুল OTP। অনুগ্রহ করে আবার চেষ্টা করুন।";
      } else if (error.code === 'auth/code-expired') {
        errorMessage = "OTP কোডের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার কোড পাঠান।";
      }
      toast({ title: "ত্রুটি", description: errorMessage, variant: "destructive" });
      form.setError("otp", { type: "manual", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendOtp = () => {
    if (typeof window !== 'undefined') {
        delete window.confirmationResult;
    }
    router.push(`/auth/phone-signin?isSignUp=${isSignUp ? 'true' : 'false'}&phoneNumber=${encodeURIComponent(phoneNumber || '')}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" aria-label="হোমপেজে ফিরে যান">
            <SaverlyLogo className="h-16 w-16 text-primary mx-auto mb-4" />
          </Link>
          <CardTitle className="font-headline text-3xl">OTP ভেরিফিকেশন</CardTitle>
          {phoneNumber && <CardDescription>আপনার {decodeURIComponent(phoneNumber)}-নম্বরে পাঠানো ৬-সংখ্যার কোডটি প্রবেশ করান।</CardDescription>}
          {!phoneNumber && <CardDescription>আপনার নম্বরে পাঠানো ৬-সংখ্যার কোডটি প্রবেশ করান।</CardDescription>}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP কোড</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="text" 
                          inputMode="numeric" 
                          autoComplete="one-time-code"
                          placeholder="••••••" 
                          {...field} 
                          className="pl-10 tracking-[0.3em] text-center"
                          maxLength={6}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || !confirmationResultState}>
                {isLoading ? 'লোড হচ্ছে...' : `ভেরিফাই ও ${isSignUp ? 'সাইন আপ' : 'সাইন ইন'}`}
              </Button>
            </form>
          </Form>
           <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              কোড পাননি?{' '}
              <Button variant="link" className="p-0 h-auto text-primary" onClick={handleResendOtp} disabled={isLoading}>
                আবার পাঠান
              </Button>
            </p>
            <p className="mt-2">
              <Link href={isSignUp ? "/signup" : "/auth/login"} className="text-sm font-medium text-primary hover:underline">
                অন্যান্য পদ্ধতিতে {isSignUp ? 'সাইন আপ/সাইন ইন' : 'সাইন ইন'}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><p>লোড হচ্ছে...</p></div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
