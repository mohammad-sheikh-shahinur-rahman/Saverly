
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have this
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import type { Invoice, InvoiceItem } from '../page'; // Import types

const INVOICES_STORAGE_KEY = 'app_invoices';

const invoiceItemSchema = z.object({
  id: z.string().optional(), // for existing items during edit
  name: z.string().min(1, "আইটেমের নাম আবশ্যক"),
  quantity: z.coerce.number().min(1, "পরিমাণ কমপক্ষে ১ হতে হবে"),
  price: z.coerce.number().min(0, "মূল্য ০ বা তার বেশি হতে হবে"),
});

const invoiceSchema = z.object({
  clientName: z.string().min(1, "ক্লায়েন্টের নাম আবশ্যক"),
  clientEmail: z.string().email("অবৈধ ইমেইল ঠিকানা"),
  issueDate: z.date({ required_error: "ইস্যু তারিখ আবশ্যক" }),
  dueDate: z.date({ required_error: "পরিশোধের শেষ তারিখ আবশ্যক" }),
  items: z.array(invoiceItemSchema).min(1, "কমপক্ষে একটি আইটেম যোগ করুন"),
  taxRate: z.coerce.number().min(0).max(100).optional().default(0),
  status: z.enum(['Paid', 'Unpaid', 'Overdue']).default('Unpaid'),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

function generateInvoiceNumber(): string {
  const prefix = "INV";
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `${prefix}-${year}${month}-${randomNumber}`;
}


export default function NewInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default due date 30 days from issue
      items: [{ name: '', quantity: 1, price: 0 }],
      taxRate: 0,
      status: 'Unpaid',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(values: InvoiceFormValues) {
    const subTotal = values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = subTotal * (values.taxRate / 100);
    const grandTotal = subTotal + taxAmount;

    const newInvoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: generateInvoiceNumber(),
      ...values,
      issueDate: values.issueDate.toISOString(),
      dueDate: values.dueDate.toISOString(),
      items: values.items.map(item => ({...item, id: crypto.randomUUID(), total: item.quantity * item.price })),
      subTotal,
      taxAmount,
      grandTotal,
    };

    const storedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
    const invoices: Invoice[] = storedInvoices ? JSON.parse(storedInvoices) : [];
    invoices.push(newInvoice);
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
    
    toast({
      title: "ইনভয়েস তৈরি হয়েছে",
      description: `ইনভয়েস নং ${newInvoice.invoiceNumber} সফলভাবে তৈরি হয়েছে।`,
    });
    router.push('/invoices');
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">নতুন ইনভয়েস তৈরি করুন</CardTitle>
            <CardDescription>ক্লায়েন্টের জন্য একটি নতুন ইনভয়েস তৈরি করুন।</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Client Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ক্লায়েন্টের নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="ক্লায়েন্টের পুরো নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ক্লায়েন্টের ইমেইল</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="client@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>ইস্যু তারিখ</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP", { locale: bn }) : <span>একটি তারিখ নির্বাচন করুন</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} locale={bn} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>পরিশোধের শেষ তারিখ</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP", { locale: bn }) : <span>একটি তারিখ নির্বাচন করুন</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} locale={bn} initialFocus 
                                      disabled={(date) => date < form.getValues("issueDate") || date < new Date(new Date().setHours(0,0,0,0))} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Invoice Items */}
                <div>
                  <FormLabel className="text-lg font-semibold mb-2 block">ইনভয়েস আইটেমসমূহ</FormLabel>
                  <div className="space-y-4">
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-4 items-start p-4 border rounded-md">
                        <FormField
                          control={form.control}
                          name={`items.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormLabel className="sr-only">আইটেমের নাম</FormLabel>
                              <FormControl>
                                <Input placeholder="আইটেমের নাম বা বিবরণ" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-4 w-full md:w-auto">
                           <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="w-full md:w-24">
                                <FormLabel className="sr-only">পরিমাণ</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="পরিমাণ" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`items.${index}.price`}
                            render={({ field }) => (
                              <FormItem className="w-full md:w-32">
                                <FormLabel className="sr-only">একক মূল্য (৳)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" placeholder="একক মূল্য" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive-hover mt-2 md:mt-0" title="আইটেম মুছুন">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', quantity: 1, price: 0 })} className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" /> আইটেম যোগ করুন
                  </Button>
                  <FormMessage>{form.formState.errors.items?.message || form.formState.errors.items?.root?.message}</FormMessage>
                </div>

                {/* Tax and Status */}
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>ট্যাক্স হার (%)</FormLabel>
                            <FormControl>
                            <Input type="number" step="0.01" placeholder="যেমন: ১০ (১০% এর জন্য)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>স্ট্যাটাস</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="Unpaid">অপরিশোধিত</SelectItem>
                                    <SelectItem value="Paid">পরিশোধিত</SelectItem>
                                    <SelectItem value="Overdue">বকেয়া</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/invoices">বাতিল</Link>
                  </Button>
                  <Button type="submit">ইনভয়েস তৈরি করুন</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
