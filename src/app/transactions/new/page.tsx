
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
import { bn } from 'date-fns/locale'; // Bangla locale for date-fns
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], { required_error: "প্রকার আবশ্যক" }),
  title: z.string().min(1, { message: "শিরোনাম আবশ্যক" }),
  amount: z.coerce.number().positive({ message: "পরিমাণ ধনাত্মক হতে হবে" }),
  category: z.string().min(1, { message: "বিভাগ আবশ্যক" }),
  date: z.date({ required_error: "তারিখ আবশ্যক" }),
  note: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const categories = [
  { value: 'Work', label: 'কাজ' },
  { value: 'Food', label: 'খাবার' },
  { value: 'Housing', label: 'আবাসন' },
  { value: 'Transport', label: 'পরিবহন' },
  { value: 'Entertainment', label: 'বিনোদন' },
  { value: 'Health', label: 'স্বাস্থ্য' },
  { value: 'Other', label: 'অন্যান্য' },
];

export default function NewTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Directly used in the page component
  const defaultTypeFromQuery = searchParams.get('type');
  const defaultType = defaultTypeFromQuery === 'income' || defaultTypeFromQuery === 'expense' ? defaultTypeFromQuery : 'expense';


  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: defaultType,
      title: '',
      amount: 0,
      category: '',
      date: new Date(),
      note: '',
    },
  });

  // Update default type if query param changes after initial load
  // This might happen with client-side navigation if the page isn't fully re-rendered.
  // For robustness, but might be optional depending on exact navigation patterns.
  // useEffect(() => {
  //   const newDefaultType = searchParams.get('type') === 'income' ? 'income' : 'expense';
  //   if (form.getValues('type') !== newDefaultType) {
  //     form.reset({ ...form.getValues(), type: newDefaultType });
  //   }
  // }, [searchParams, form]);


  function onSubmit(values: TransactionFormValues) {
    console.log(values);
    // In a real app, you'd save this data
    router.push('/transactions');
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">নতুন লেনদেন যোগ করুন</CardTitle>
            <CardDescription>আপনার আয় বা ব্যয়ের বিবরণ পূরণ করুন।</CardDescription>
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
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                                format(field.value, "PPP", { locale: bn })
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
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={bn} // Pass Bangla locale
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
