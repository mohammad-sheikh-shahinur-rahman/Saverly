
"use client";

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
import { bn } from 'date-fns/locale'; // Bangla locale
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

const reminderSchema = z.object({
  title: z.string().min(1, { message: "শিরোনাম আবশ্যক" }),
  date: z.date({ required_error: "তারিখ আবশ্যক" }),
  note: z.string().optional(),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

// Mock data - translate this data if it's static
const mockReminderData: { [id: string]: ReminderFormValues } = {
  '1': { title: 'ক্রেডিট কার্ড পেমেন্ট', date: new Date('2024-07-25'), note: 'ভিসা বিল পরিশোধ করুন' },
  '2': { title: 'ভাড়া বাকি', date: new Date('2024-08-01'), note: 'আগস্ট মাসের মাসিক ভাড়া' },
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
    console.log("আপডেট করা রিমাইন্ডার:", values);
    router.push('/reminders');
  }
  
  if (!reminderId || !mockReminderData[reminderId] && !form.formState.isDirty) {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>রিমাইন্ডার লোড হচ্ছে...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>যদি এটি খুব বেশি সময় নেয়, রিমাইন্ডারটি নাও থাকতে পারে।</p>
                        <Button variant="link" asChild><Link href="/reminders">রিমাইন্ডারে ফিরে যান</Link></Button>
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
            <CardTitle className="font-headline text-2xl">রিমাইন্ডার সম্পাদনা করুন</CardTitle>
            <CardDescription>আপনার আর্থিক রিমাইন্ডারের বিবরণ আপডেট করুন।</CardDescription>
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
                        <Input placeholder="যেমনঃ ক্রেডিট কার্ড বিল, ভাড়ার পেমেন্ট" {...field} />
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
                      <FormLabel>রিমাইন্ডারের তারিখ</FormLabel>
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
                                format(new Date(field.value), "PPP", { locale: bn })
                              ) : (
                                <span>একটি তারিখ নির্বাচন করুন</span>
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
                            locale={bn} // Pass Bangla locale
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
                      <FormLabel>নোট (ঐচ্ছিক)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="রিমাইন্ডারের জন্য প্রাসঙ্গিক কোনো বিবরণ যোগ করুন..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/reminders">বাতিল</Link>
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
