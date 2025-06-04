
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

const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, { message: "ফোন নম্বর কমপক্ষে ১০ সংখ্যার হতে হবে।" })
    .regex(/^\+?[0-9\s-()]*$/, { message: "অবৈধ ফোন নম্বর ফরম্যাট।" }),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

export default function PhoneSignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignUp = searchParams.get('isSignUp') === 'true';

  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  function onSubmit(values: PhoneFormValues) {
    // ** Firebase Logic Placeholder **
    // 1. Initialize RecaptchaVerifier here (e.g., on a div with id 'recaptcha-container')
    //    Make sure the 'recaptcha-container' div exists in the JSX.
    //    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    //      'size': 'invisible', // or 'normal'
    //      'callback': (response) => { /* reCAPTCHA solved, allow signInWithPhoneNumber. */ },
    //      'expired-callback': () => { /* Response expired. Ask user to solve reCAPTCHA again. */ }
    //    });
    // 2. Call signInWithPhoneNumber(auth, values.phoneNumber, recaptchaVerifier)
    //    .then((confirmationResult) => {
    //      // SMS sent. Save confirmationResult to pass to OTP verification page.
    //      // e.g., store it in a state management solution or pass via router state if possible.
    //      // For this demo, we'll just navigate.
    //      console.log("OTP sent to", values.phoneNumber);
    //      router.push(`/auth/verify-otp?phoneNumber=${encodeURIComponent(values.phoneNumber)}`);
    //    }).catch((error) => {
    //      // Handle error (e.g., invalid phone number, quota exceeded)
    //      console.error("Error sending OTP:", error);
    //      form.setError("phoneNumber", { type: "manual", message: "OTP পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" });
    //    });
    console.log("Attempting to send OTP to:", values.phoneNumber);
    // For demo, directly navigate to OTP verification page
    router.push(`/auth/verify-otp?phoneNumber=${encodeURIComponent(values.phoneNumber)}&isSignUp=${isSignUp}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <Link href="/" aria-label="হোমপেজে ফিরে যান">
            <SaverlyLogo className="h-16 w-16 text-primary mx-auto mb-4" />
          </Link>
          <CardTitle className="font-headline text-3xl">ফোন নম্বর দিয়ে {isSignUp ? 'সাইন আপ' : 'সাইন ইন'}</CardTitle>
          <CardDescription>আপনার ফোন নম্বর প্রবেশ করান। আমরা আপনাকে একটি যাচাইকরণ কোড পাঠাব।</CardDescription>
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
                        <Input type="tel" placeholder="যেমনঃ +৮৮০১৭xxxxxxxx" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Invisible reCAPTCHA container (needed for Firebase Phone Auth on web) */}
              <div id="recaptcha-container"></div>

              <Button type="submit" className="w-full">
                OTP পাঠান
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
