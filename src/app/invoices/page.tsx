
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Eye, Printer, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string; // ISO string
  dueDate: string; // ISO string
  items: InvoiceItem[];
  subTotal: number;
  taxRate: number; // Percentage e.g., 10 for 10%
  taxAmount: number;
  grandTotal: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

const INVOICES_STORAGE_KEY = 'app_invoices';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
      if (storedInvoices) {
        setInvoices(JSON.parse(storedInvoices));
      }
    }
  }, []);

  const saveInvoicesToLocalStorage = (updatedInvoices: Invoice[]) => {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updatedInvoices));
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    setInvoices(updatedInvoices);
    saveInvoicesToLocalStorage(updatedInvoices);
    toast({
      title: "ইনভয়েস মোছা হয়েছে",
      description: "ইনভয়েসটি সফলভাবে তালিকা থেকে সরানো হয়েছে।",
    });
  };
  
  const handlePrintInvoice = (invoiceId: string) => {
     // In a real app, you might redirect to a printable view or use a PDF library.
     // For this prototype, we'll use browser's print.
    const printableInvoice = invoices.find(inv => inv.id === invoiceId);
    if (printableInvoice) {
      const printWindow = window.open(`/invoices/print/${invoiceId}`, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => { // Ensure content is loaded
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
    }
  };


  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">ইনভয়েসসমূহ</h1>
          <Button asChild>
            <Link href="/invoices/new">
              <PlusCircle className="mr-2 h-5 w-5" /> নতুন ইনভয়েস তৈরি করুন
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              আপনার ইনভয়েসের তালিকা
            </CardTitle>
            <CardDescription>তৈরি করা ইনভয়েসগুলো এখানে দেখুন, সম্পাদনা করুন বা মুছুন।</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ইনভয়েস নং</TableHead>
                    <TableHead>ক্লায়েন্টের নাম</TableHead>
                    <TableHead>ইস্যু তারিখ</TableHead>
                    <TableHead>মোট পরিমাণ</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">ক্রিয়াকলাপ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell>{format(new Date(invoice.issueDate), "dd MMM, yyyy", { locale: bn })}</TableCell>
                      <TableCell>৳{invoice.grandTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                          invoice.status === 'Unpaid' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {invoice.status === 'Paid' ? 'পরিশোধিত' : invoice.status === 'Unpaid' ? 'অপরিশোধিত' : 'বকেয়া'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" asChild title="দেখুন">
                          <Link href={`/invoices/${invoice.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="সম্পাদনা করুন">
                          <Link href={`/invoices/edit/${invoice.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" title="প্রিন্ট/ডাউনলোড" onClick={() => handlePrintInvoice(invoice.id)}>
                            <Printer className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="মুছে ফেলুন">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                              <AlertDialogDescription>
                                এই ইনভয়েসটি মুছে ফেলা হবে এবং এই পদক্ষেপটি ফেরানো যাবে না।
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteInvoice(invoice.id)}>
                                নিশ্চিত করুন
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 border border-dashed rounded-lg text-center">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">এখনও কোনো ইনভয়েস তৈরি করা হয়নি</h3>
                <p className="text-muted-foreground">
                  আপনার প্রথম ইনভয়েস তৈরি করতে "নতুন ইনভয়েস তৈরি করুন" বাটনে ক্লিক করুন।
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

