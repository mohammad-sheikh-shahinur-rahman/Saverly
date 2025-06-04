
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
import { Hash } from 'lucide-react'; // Icon for OTP

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP অবশ্যই ৬ সংখ্যার হতে হবে।" }),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber');
  const isSignUp = searchParams.get('isSignUp') === 'true';


  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(values: OtpFormValues) {
    // ** Firebase Logic Placeholder **
    // 1. Get the confirmationResult object (saved from the previous step, e.g., from state management).
    // 2. Call confirmationResult.confirm(values.otp)
    //    .then((result) => {
    //      // User signed in successfully.
    //      const user = result.user;
    //      console.log("User signed in:", user);
    //      router.push('/dashboard');
    //    }).catch((error) => {
    //      // Handle error (e.g., incorrect OTP)
    //      console.error("Error verifying OTP:", error);
    //      form.setError("otp", { type: "manual", message: "ভুল OTP। অনুগ্রহ করে আবার চেষ্টা করুন।" });
    //    });
    console.log("Verifying OTP:", values.otp, "for phone number:", phoneNumber);
    // For demo, directly navigate to dashboard
    router.push('/dashboard');
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
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                ভেরিফাই ও {isSignUp ? 'সাইন আপ' : 'সাইন ইন'}
              </Button>
            </form>
          </Form>
           <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              কোড পাননি?{' '}
              <Button variant="link" className="p-0 h-auto text-primary" onClick={() => router.push(`/auth/phone-signin?isSignUp=${isSignUp}`)}>
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
