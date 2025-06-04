
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import type { Invoice } from '../page'; // Import type
import { SaverlyLogo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

const INVOICES_STORAGE_KEY = 'app_invoices';

export default function ViewInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();


  useEffect(() => {
    if (typeof window !== 'undefined' && invoiceId) {
      const storedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
      if (storedInvoices) {
        const invoices: Invoice[] = JSON.parse(storedInvoices);
        const currentInvoice = invoices.find(inv => inv.id === invoiceId);
        if (currentInvoice) {
          setInvoice(currentInvoice);
        } else {
          toast({ title: "ত্রুটি", description: "ইনভয়েস খুঁজে পাওয়া যায়নি।", variant: "destructive" });
          router.push('/invoices');
        }
      }
      setIsLoading(false);
    }
  }, [invoiceId, router, toast]);

  const handlePrint = () => {
    const printWindow = window.open(`/invoices/print/${invoiceId}`, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => { 
            printWindow.print();
          }, 500); 
        };
      } else {
        toast({
          title: "ত্রুটি",
          description: "প্রিন্ট উইন্ডো খুলতে সমস্যা হয়েছে। পপ-আপ ব্লকার চেক করুন।",
          variant: "destructive"
        });
      }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader><CardTitle>লোড হচ্ছে...</CardTitle></CardHeader>
            <CardContent><p>ইনভয়েসের তথ্য লোড করা হচ্ছে...</p></CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!invoice) {
    // This case should ideally be handled by the redirect in useEffect
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader><CardTitle>ইনভয়েস পাওয়া যায়নি</CardTitle></CardHeader>
            <CardContent>
              <p>নির্দিষ্ট ইনভয়েসটি খুঁজে পাওয়া যায়নি।</p>
              <Button asChild className="mt-4"><Link href="/invoices">ইনভয়েস তালিকায় ফিরে যান</Link></Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  const getStatusChip = (status: 'Paid' | 'Unpaid' | 'Overdue') => {
    let bgColor, textColor, text;
    switch (status) {
      case 'Paid':
        bgColor = 'bg-green-100 dark:bg-green-900';
        textColor = 'text-green-700 dark:text-green-300';
        text = 'পরিশোধিত';
        break;
      case 'Unpaid':
        bgColor = 'bg-yellow-100 dark:bg-yellow-900';
        textColor = 'text-yellow-700 dark:text-yellow-300';
        text = 'অপরিশোধিত';
        break;
      case 'Overdue':
        bgColor = 'bg-red-100 dark:bg-red-900';
        textColor = 'text-red-700 dark:text-red-300';
        text = 'বকেয়া';
        break;
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-700';
        textColor = 'text-gray-700 dark:text-gray-300';
        text = status;
    }
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${bgColor} ${textColor}`}>{text}</span>;
  };


  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8 bg-card text-card-foreground rounded-lg shadow-xl print:shadow-none print:m-0 print:p-0">
        <div className="flex justify-between items-start mb-8 print:hidden">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> তালিকায় ফিরে যান
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href={`/invoices/edit/${invoice.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> সম্পাদনা
                </Link>
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> প্রিন্ট / ডাউনলোড (পিডিএফ)
            </Button>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start pb-6 border-b">
          <div>
            <SaverlyLogo className="h-12 w-12 text-primary mb-2" />
            <h1 className="text-3xl font-bold font-headline text-primary">ইনভয়েস</h1>
            <p className="text-muted-foreground">ইনভয়েস নং: {invoice.invoiceNumber}</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <h2 className="text-xl font-semibold">সেভারলি ইনকর্পোরেটেড (আপনার কোম্পানি)</h2>
            <p className="text-sm text-muted-foreground">১২৩ ফিনান্স স্ট্রিট, ঢাকা, বাংলাদেশ</p>
            <p className="text-sm text-muted-foreground">hello@saverly.app</p>
          </div>
        </div>

        {/* Client and Dates */}
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">বিল টু:</h3>
            <p className="font-medium text-lg">{invoice.clientName}</p>
            <p className="text-muted-foreground">{invoice.clientEmail}</p>
          </div>
          <div className="text-left md:text-right">
            <p><span className="font-semibold">ইস্যু তারিখ:</span> {format(new Date(invoice.issueDate), "dd MMMM, yyyy", { locale: bn })}</p>
            <p><span className="font-semibold">পরিশোধের শেষ তারিখ:</span> {format(new Date(invoice.dueDate), "dd MMMM, yyyy", { locale: bn })}</p>
            <div className="mt-2">{getStatusChip(invoice.status)}</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">আইটেমের বিবরণ</TableHead>
                <TableHead className="text-center">পরিমাণ</TableHead>
                <TableHead className="text-right">একক মূল্য (৳)</TableHead>
                <TableHead className="text-right">মোট (৳)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">সাবটোটাল:</span>
              <span>৳{invoice.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ট্যাক্স ({invoice.taxRate}%):</span>
              <span>৳{invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
              <span>সর্বমোট:</span>
              <span className="text-primary">৳{invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes / Terms */}
        <div className="border-t pt-6 text-sm text-muted-foreground">
          <h4 className="font-semibold mb-2 text-foreground">নোট:</h4>
          <p>পরিশোধের জন্য আপনাকে ধন্যবাদ। কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।</p>
          <p className="mt-1">পরিশোধের পদ্ধতি: ব্যাংক ট্রান্সফার, অনলাইন পেমেন্ট।</p>
        </div>
         <div className="mt-12 text-center text-xs text-muted-foreground print:block hidden">
            এটি সেভারলি দ্বারা তৈরি একটি কম্পিউটার-জেনারেটেড ইনভয়েস।
        </div>
      </div>
    </AppLayout>
  );
}
