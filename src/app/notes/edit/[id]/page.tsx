"use client";

// This is largely a copy of new/page.tsx for placeholder purposes.
// In a real app, you'd fetch the note data by id.

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
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

type NoteFormValues = z.infer<typeof noteSchema>;

// Mock data for editing
const mockNoteData: { [id: string]: NoteFormValues } = {
  '1': { title: 'Investment Ideas Q3', content: 'Research tech stocks and ETFs. Consider long-term government bonds.'},
  '2': { title: 'Savings Goals 2025', content: 'Aim for $10,000 emergency fund. Save $500/month for vacation.'},
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
    console.log("Updated note:", values);
    router.push('/notes');
  }

  if (!noteId || !mockNoteData[noteId] && !form.formState.isDirty) {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Loading note...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>If this takes too long, the note might not exist.</p>
                         <Button variant="link" asChild><Link href="/notes">Back to notes</Link></Button>
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
            <CardTitle className="font-headline text-2xl">Edit Financial Note</CardTitle>
            <CardDescription>Update your financial ideas, plans, or important information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Investment Strategy, Savings Plan" {...field} />
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
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea rows={8} placeholder="Write your detailed notes here..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/notes">Cancel</Link>
                  </Button>
                  <Button type="submit">Update Note</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
