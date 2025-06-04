
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
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Phone, User, Mail } from 'lucide-react';
import { auth } from '@/lib/firebase'; // Firebase auth instance
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import React, { useState } from 'react';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.54,18.33 21.54,12.81C21.54,11.45 21.35,11.1 21.35,11.1Z"/>
  </svg>
);

const signupSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে।" }),
  email: z.string().email({ message: "অবৈধ ইমেইল ঠিকানা।" }),
  password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মেলেনি",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      // Optionally, update user profile with name here if needed: await updateProfile(auth.currentUser, { displayName: values.name });
      toast({ title: "সফল", description: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Email/Password Sign Up Error:", error);
      let errorMessage = "সাইন আপ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "এই ইমেইল ঠিকানাটি ইতিমধ্যে নিবন্ধিত।";
      }
      toast({ title: "ত্রুটি", description: errorMessage, variant: "destructive" });
      form.setError("email", { type: "manual", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "সফল", description: "গুগল দিয়ে সফলভাবে সাইন আপ করেছেন।" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google Sign Up Error:", error);
      let errorMessage = "গুগল দিয়ে সাইন আপ করতে সমস্যা হয়েছে।";
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "পপ-আপ বন্ধ করে দেওয়া হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      }
      toast({ title: "ত্রুটি", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignUp = () => {
    router.push('/auth/phone-signin?isSignUp=true'); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" aria-label="হোমপেজে ফিরে যান">
            <SaverlyLogo className="h-16 w-16 text-primary mx-auto mb-4" />
          </Link>
          <CardTitle className="font-headline text-3xl">অ্যাকাউন্ট তৈরি করুন</CardTitle>
          <CardDescription>আপনার আর্থিক ট্র্যাকিং শুরু করতে সেভারলিতে যোগ দিন।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পূর্ণ নাম</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="যেমনঃ জন ডো" {...field} className="pl-10" disabled={isLoading} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ইমেইল</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="you@example.com" {...field} className="pl-10" disabled={isLoading} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পাসওয়ার্ড</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'লোড হচ্ছে...' : 'সাইন আপ করুন'}
              </Button>
            </form>
          </Form>

          <div className="my-6 flex items-center">
            <Separator className="flex-grow" />
            <span className="mx-4 text-sm text-muted-foreground">অথবা</span>
            <Separator className="flex-grow" />
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isLoading}>
              <GoogleIcon />
              <span className="ml-2">{isLoading ? 'লোড হচ্ছে...' : 'গুগল দিয়ে সাইন আপ করুন'}</span>
            </Button>
            <Button variant="outline" className="w-full" onClick={handlePhoneSignUp} disabled={isLoading}>
              <Phone className="h-4 w-4" />
              <span className="ml-2">ফোন নম্বর দিয়ে সাইন আপ করুন</span>
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                সাইন ইন
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
