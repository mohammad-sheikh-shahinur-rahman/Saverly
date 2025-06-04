
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

const noteSchema = z.object({
  title: z.string().min(1, { message: "শিরোনাম আবশ্যক" }),
  content: z.string().min(1, { message: "বিষয়বস্তু আবশ্যক" }),
});

type NoteFormValues = z.infer<typeof noteSchema>;

// Mock data for editing - translate if static
const mockNoteData: { [id: string]: NoteFormValues } = {
  '1': { title: 'বিনিয়োগের ধারণা Q3', content: 'টেক স্টক এবং ইটিএফ গবেষণা করুন। দীর্ঘমেয়াদী সরকারি বন্ড বিবেচনা করুন।'},
  '2': { title: 'সঞ্চয়ের লক্ষ্য ২০২৫', content: '৳১০,০০০ জরুরি তহবিল লক্ষ্য করুন। অবকাশের জন্য প্রতি মাসে ৳৫০০ সঞ্চয় করুন।'},
};

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
  });

  useEffect(() => {
    if (noteId && mockNoteData[noteId]) {
      form.reset(mockNoteData[noteId]);
    }
  }, [noteId, form]);

  function onSubmit(values: NoteFormValues) {
    console.log("আপডেট করা নোট:", values);
    router.push('/notes');
  }

  if (!noteId || !mockNoteData[noteId] && !form.formState.isDirty) {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>নোট লোড হচ্ছে...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>যদি এটি খুব বেশি সময় নেয়, নোটটি নাও থাকতে পারে।</p>
                         <Button variant="link" asChild><Link href="/notes">নোটে ফিরে যান</Link></Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">আর্থিক নোট সম্পাদনা করুন</CardTitle>
            <CardDescription>আপনার আর্থিক ধারণা, পরিকল্পনা বা গুরুত্বপূর্ণ তথ্য আপডেট করুন।</CardDescription>
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
                  <Button type="submit">আপডেট করুন</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
