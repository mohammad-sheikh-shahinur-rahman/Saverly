
"use client";

// This is a simplified printable view.
// It mirrors much of the [id]/page.tsx but with minimal UI for printing.

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import type { Invoice } from '../page';
import { SaverlyLogo } from '@/components/icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Re-use table for structure
import { useToast } from '@/hooks/use-toast';

const INVOICES_STORAGE_KEY = 'app_invoices';

export default function PrintInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const invoiceId = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && invoiceId) {
      const storedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
      if (storedInvoices) {
        const invoicesData: Invoice[] = JSON.parse(storedInvoices);
        const currentInvoice = invoicesData.find(inv => inv.id === invoiceId);
        if (currentInvoice) {
          setInvoice(currentInvoice);
        } else {
          toast({ title: "ত্রুটি", description: "ইনভয়েস খুঁজে পাওয়া যায়নি।", variant: "destructive" });
          router.push('/invoices'); // Redirect if not found
        }
      }
      setIsLoading(false);
    }
  }, [invoiceId, router, toast]);

  useEffect(() => {
    if (!isLoading && invoice) {
        // This timeout ensures content is rendered before print dialog appears
        // setTimeout(() => window.print(), 500); 
        // Print is triggered from parent window now
    }
  }, [isLoading, invoice]);

  if (isLoading) {
    return <div className="p-8">ইনভয়েস লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।</div>;
  }

  if (!invoice) {
    return <div className="p-8">ইনভয়েস খুঁজে পাওয়া যায়নি।</div>;
  }

  const getStatusText = (status: 'Paid' | 'Unpaid' | 'Overdue') => {
    switch (status) {
      case 'Paid': return 'পরিশোধিত';
      case 'Unpaid': return 'অপরিশোধিত';
      case 'Overdue': return 'বকেয়া';
      default: return status;
    }
  };

  return (
    <html lang="bn">
        <head>
            <title>ইনভয়েস - {invoice.invoiceNumber}</title>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap');
                body { 
                    font-family: 'Noto Sans Bengali', sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    background-color: #fff; 
                    color: #333;
                    -webkit-print-color-adjust: exact; /* Chrome, Safari */
                    color-adjust: exact; /* Firefox */
                }
                .invoice-container { max-width: 800px; margin: auto; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
                .header .company-details { text-align: right; }
                .header h1 { color: #5A38E8; margin:0; font-size: 28px; } /* Primary color for INVOICE text */
                .client-dates { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
                .text-right { text-align: right; }
                .font-semibold { font-weight: 700; }
                .muted-foreground { color: #718096; }
                .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
                .totals-box { width: 40%; }
                .totals-box div { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .totals-box .grand-total { font-size: 1.2em; font-weight: bold; border-top: 1px solid #eee; padding-top: 10px; margin-top:10px; }
                .grand-total span:last-child { color: #5A38E8; } /* Primary color for grand total amount */
                .notes { margin-top: 40px; padding-top:20px; border-top: 1px solid #eee; font-size: 0.9em; color: #555; }
                .footer-print { margin-top: 50px; text-align: center; font-size: 0.8em; color: #aaa; }

                /* Basic Table Styling */
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 0.95em; }
                th { background-color: #f9f9f9; }
                td.text-center { text-align: center; }
                td.text-right { text-align: right; }

                @media print {
                    body { margin: 0; padding: 20mm; font-size: 10pt; }
                    .invoice-container { max-width: 100%; box-shadow: none; }
                    /* Add any print-specific styles here */
                }
            `}</style>
        </head>
        <body>
            <div className="invoice-container">
                <div className="header">
                    <div>
                        <SaverlyLogo className="h-12 w-12" style={{ color: '#5A38E8' }} />
                        <h1>ইনভয়েস</h1>
                        <p className="muted-foreground">ইনভয়েস নং: {invoice.invoiceNumber}</p>
                    </div>
                    <div className="company-details">
                        <h2 className="font-semibold" style={{fontSize: '1.3em'}}>সেভারলি ইনকর্পোরেটেড</h2>
                        <p className="text-sm muted-foreground">১২৩ ফিনান্স স্ট্রিট, ঢাকা, বাংলাদেশ</p>
                        <p className="text-sm muted-foreground">hello@saverly.app</p>
                    </div>
                </div>

                <div className="client-dates">
                    <div>
                        <h3 className="text-sm font-semibold muted-foreground" style={{marginBottom: '2px'}}>বিল টু:</h3>
                        <p className="font-semibold" style={{fontSize: '1.1em', margin: 0}}>{invoice.clientName}</p>
                        <p className="muted-foreground" style={{fontSize: '0.9em', margin: 0}}>{invoice.clientEmail}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-semibold">ইস্যু তারিখ:</span> {format(new Date(invoice.issueDate), "dd MMMM, yyyy", { locale: bn })}</p>
                        <p><span className="font-semibold">পরিশোধের শেষ তারিখ:</span> {format(new Date(invoice.dueDate), "dd MMMM, yyyy", { locale: bn })}</p>
                        <p style={{marginTop: '5px'}}><span className="font-semibold">স্ট্যাটাস:</span> {getStatusText(invoice.status)}</p>
                    </div>
                </div>

                <table>
                    <thead>
                    <tr>
                        <th>আইটেমের বিবরণ</th>
                        <th className="text-center">পরিমাণ</th>
                        <th className="text-right">একক মূল্য (৳)</th>
                        <th className="text-right">মোট (৳)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoice.items.map((item) => (
                        <tr key={item.id}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">{item.price.toFixed(2)}</td>
                        <td className="text-right">{item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="totals">
                    <div className="totals-box">
                        <div>
                            <span className="muted-foreground">সাবটোটাল:</span>
                            <span>৳{invoice.subTotal.toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="muted-foreground">ট্যাক্স ({invoice.taxRate}%):</span>
                            <span>৳{invoice.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="grand-total">
                            <span>সর্বমোট:</span>
                            <span>৳{invoice.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="notes">
                    <h4 className="font-semibold" style={{color: '#333'}}>নোট:</h4>
                    <p>পরিশোধের জন্য আপনাকে ধন্যবাদ। কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।</p>
                    <p style={{marginTop: '5px'}}>পরিশোধের পদ্ধতি: ব্যাংক ট্রান্সফার, অনলাইন পেমেন্ট।</p>
                </div>

                <div className="footer-print">
                    এটি সেভারলি দ্বারা তৈরি একটি কম্পিউটার-জেনারেটেড ইনভয়েস।
                </div>
            </div>
        </body>
    </html>
  );
}
