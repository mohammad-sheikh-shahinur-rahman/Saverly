
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

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: SignupFormValues) {
    console.log(values);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
             <SaverlyLogo className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">অ্যাকাউন্ট তৈরি করুন</CardTitle>
          <CardDescription>আপনার আর্থিক ট্র্যাকিং শুরু করতে সেভারলিতে যোগ দিন।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পূর্ণ নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="যেমনঃ জন ডো" {...field} />
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
                      <Input placeholder="you@example.com" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                সাইন আপ
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <Link href="/" className="font-medium text-primary hover:underline">
                সাইন ইন
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
