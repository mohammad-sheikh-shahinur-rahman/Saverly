"use client";

// This is largely a copy of new/page.tsx for placeholder purposes.
// In a real app, you'd fetch the reminder data by id.

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

const reminderSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  date: z.date({ required_error: "Date is required" }),
  note: z.string().optional(),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

// Mock data for editing
const mockReminderData: { [id: string]: ReminderFormValues } = {
  '1': { title: 'Credit Card Payment', date: new Date('2024-07-25'), note: 'Pay Visa bill' },
  '2': { title: 'Rent Due', date: new Date('2024-08-01'), note: 'Monthly rent for August' },
};

export default function EditReminderPage() {
  const router = useRouter();
  const params = useParams();
  const reminderId = params.id as string;

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
  });

  useEffect(() => {
    if (reminderId && mockReminderData[reminderId]) {
      const data = mockReminderData[reminderId];
      form.reset({
        ...data,
        date: new Date(data.date)
      });
    }
  }, [reminderId, form]);

  function onSubmit(values: ReminderFormValues) {
    console.log("Updated reminder:", values);
    router.push('/reminders');
  }
  
  if (!reminderId || !mockReminderData[reminderId] && !form.formState.isDirty) {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Loading reminder...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>If this takes too long, the reminder might not exist.</p>
                        <Button variant="link" asChild><Link href="/reminders">Back to reminders</Link></Button>
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
            <CardTitle className="font-headline text-2xl">Edit Reminder</CardTitle>
            <CardDescription>Update the details of your financial reminder.</CardDescription>
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
                        <Input placeholder="e.g., Credit Card Bill, Rent Payment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Reminder Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any relevant details for the reminder..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/reminders">Cancel</Link>
                  </Button>
                  <Button type="submit">Update Reminder</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
