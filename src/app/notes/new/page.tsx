
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const noteSchema = z.object({
  title: z.string().min(1, { message: "শিরোনাম আবশ্যক" }),
  content: z.string().min(1, { message: "বিষয়বস্তু আবশ্যক" }),
});

type NoteFormValues = z.infer<typeof noteSchema>;

export default function NewNotePage() {
  const router = useRouter();
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  function onSubmit(values: NoteFormValues) {
    console.log(values);
    router.push('/notes');
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">নতুন আর্থিক নোট তৈরি করুন</CardTitle>
            <CardDescription>আপনার আর্থিক ধারণা, পরিকল্পনা বা গুরুত্বপূর্ণ তথ্য লিখে রাখুন।</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>শিরোনাম</FormLabel>
                      <FormControl>
                        <Input placeholder="যেমনঃ বিনিয়োগ কৌশল, সঞ্চয় পরিকল্পনা" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>বিষয়বস্তু</FormLabel>
                      <FormControl>
                        <Textarea rows={8} placeholder="আপনার বিস্তারিত নোট এখানে লিখুন..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/notes">বাতিল</Link>
                  </Button>
                  <Button type="submit">সংরক্ষণ করুন</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
