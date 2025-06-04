
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
import { Phone } from 'lucide-react';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";

// Extend window type to include recaptchaVerifier and confirmationResult
declare global {
  interface Window { 
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
    recaptchaWidgetId?: number;
  }
}

const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, { message: "ফোন নম্বর কমপক্ষে ১০ সংখ্যার হতে হবে।" })
    .regex(/^\+?[0-9\s-()]*$/, { message: "অবৈধ ফোন নম্বর ফরম্যাট। একটি দেশের কোডসহ নম্বর দিন (যেমন +৮৮০...)।" }),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

function PhoneSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignUp = searchParams.get('isSignUp') === 'true';
  const defaultPhoneNumber = searchParams.get('phoneNumber');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);


  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: defaultPhoneNumber || "+৮৮০", 
    },
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined' && recaptchaContainerRef.current && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible',
        'callback': (response: any) => {
          console.log("reCAPTCHA verified:", response);
        },
        'expired-callback': () => {
          toast({ title: "ত্রুটি", description: "reCAPTCHA মেয়াদ উত্তীর্ণ হয়েছে। আবার চেষ্টা করুন।", variant: "destructive" });
          setIsLoading(false);
        }
      });
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
    return () => {
        // Cleanup if needed, though RecaptchaVerifier might self-clean or cause issues if cleared too aggressively.
    };
  }, [toast]);


  async function onSubmit(values: PhoneFormValues) {
    setIsLoading(true);
    if (!window.recaptchaVerifier) {
      toast({ title: "ত্রুটি", description: "reCAPTCHA প্রস্তুত নয়। পৃষ্ঠাটি রিফ্রেশ করে আবার চেষ্টা করুন।", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, values.phoneNumber, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult; 
      toast({ title: "OTP পাঠানো হয়েছে", description: `${values.phoneNumber}-এ একটি যাচাইকরণ কোড পাঠানো হয়েছে।` });
      router.push(`/auth/verify-otp?phoneNumber=${encodeURIComponent(values.phoneNumber)}&isSignUp=${isSignUp}`);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      let errorMessage = "OTP পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
       if (error.code === 'auth/invalid-phone-number') {
        errorMessage = "অবৈধ ফোন নম্বর। দেশের কোডসহ সঠিক ফরম্যাটে দিন।";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
      } else if (error.code === 'auth/captcha-check-failed' || error.code === 'auth/network-request-failed') {
        errorMessage = "reCAPTCHA যাচাইকরণ বা নেটওয়ার্ক সমস্যা। পৃষ্ঠাটি রিফ্রেশ করে আবার চেষ্টা করুন।";
         if (window.grecaptcha && window.recaptchaWidgetId !== undefined) {
           window.grecaptcha.reset(window.recaptchaWidgetId);
        }
      }
      toast({ title: "ত্রুটি", description: errorMessage, variant: "destructive" });
      form.setError("phoneNumber", { type: "manual", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <Link href="/" aria-label="হোমপেজে ফিরে যান">
            <SaverlyLogo className="h-16 w-16 text-primary mx-auto mb-4" />
          </Link>
          <CardTitle className="font-headline text-3xl">ফোন নম্বর দিয়ে {isSignUp ? 'সাইন আপ' : 'সাইন ইন'}</CardTitle>
          <CardDescription>আপনার ফোন নম্বর প্রবেশ করান (দেশের কোডসহ)। আমরা আপনাকে একটি যাচাইকরণ কোড পাঠাব।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ফোন নম্বর</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="tel" placeholder="যেমনঃ +৮৮০১৭xxxxxxxx" {...field} className="pl-10" disabled={isLoading}/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div ref={recaptchaContainerRef} id="recaptcha-container"></div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'লোড হচ্ছে...' : 'OTP পাঠান'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              ইমেইল ব্যবহার করতে চান?{' '}
              <Link href={isSignUp ? "/signup" : "/auth/login"} className="font-medium text-primary hover:underline">
                {isSignUp ? 'ইমেইল দিয়ে সাইন আপ করুন' : 'ইমেইল দিয়ে সাইন ইন করুন'}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PhoneSignInPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><p>লোড হচ্ছে...</p></div>}>
      <PhoneSignInForm />
    </Suspense>
  );
}
