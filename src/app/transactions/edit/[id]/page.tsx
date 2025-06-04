
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], { required_error: "প্রকার আবশ্যক" }),
  title: z.string().min(1, { message: "শিরোনাম আবশ্যক" }),
  amount: z.coerce.number().positive({ message: "পরিমাণ ধনাত্মক হতে হবে" }),
  category: z.string().min(1, { message: "বিভাগ আবশ্যক" }),
  date: z.date({ required_error: "তারিখ আবশ্যক" }),
  note: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

// Ensure categories are translated or use i18n keys
const categories = [
  { value: 'Work', label: 'কাজ' },
  { value: 'Food', label: 'খাবার' },
  { value: 'Housing', label: 'আবাসন' },
  { value: 'Transport', label: 'পরিবহন' },
  { value: 'Entertainment', label: 'বিনোদন' },
  { value: 'Health', label: 'স্বাস্থ্য' },
  { value: 'Other', label: 'অন্যান্য' },
];

// Mock data for editing - ensure this data is also translated or handled via i18n if dynamic
const mockTransactionData: { [id: string]: TransactionFormValues } = {
  '1': { type: 'income', title: 'বেতন', category: 'কাজ', amount: 2500, date: new Date('2024-07-01'), note: 'মাসিক বেতন' },
  '2': { type: 'expense', title: 'মুদি বাজার', category: 'খাবার', amount: 75.50, date: new Date('2024-07-02'), note: 'সাপ্তাহিক মুদি বাজার' },
};

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
  });

  useEffect(() => {
    if (transactionId && mockTransactionData[transactionId]) {
      const data = mockTransactionData[transactionId];
      form.reset({
        ...data,
        date: new Date(data.date) 
      });
    } 
  }, [transactionId, form, router]);

  function onSubmit(values: TransactionFormValues) {
    console.log("আপডেট করা মান:", values);
    router.push('/transactions');
  }

  if (!transactionId || !mockTransactionData[transactionId] && !form.formState.isDirty) {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>লেনদেন লোড হচ্ছে...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>যদি এটি খুব বেশি সময় নেয়, তাহলে লেনদেনটি নাও থাকতে পারে।</p>
                         <Button variant="link" asChild><Link href="/transactions">লেনদেনে ফিরে যান</Link></Button>
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
            <CardTitle className="font-headline text-2xl">লেনদেন সম্পাদনা করুন</CardTitle>
            <CardDescription>আপনার লেনদেনের বিবরণ আপডেট করুন।</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>প্রকার</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="লেনদেনের প্রকার নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="income">আয়</SelectItem>
                          <SelectItem value="expense">ব্যয়</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>শিরোনাম</FormLabel>
                      <FormControl>
                        <Input placeholder="যেমনঃ বেতন, মুদি বাজার" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>পরিমাণ (৳)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>বিভাগ</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="একটি বিভাগ নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>তারিখ</FormLabel>
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
                            locale={bn}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
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
                        <Textarea placeholder="প্রাসঙ্গিক কোনো নোট যোগ করুন..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/transactions">বাতিল</Link>
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
