
"use client";

import { AppLayout } from '@/components/AppLayout';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ExpensesBarChart } from '@/components/dashboard/ExpensesBarChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { TrendingUp, TrendingDown, Scale, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from 'react';
import { getFinancialAdvice, type FinancialAdviceInput, type FinancialAdviceOutput } from '@/ai/flows/financial-advisor-flow';

export default function DashboardPage() {
  const totalIncome = "৳৫,২৩০.০০";
  const totalExpenses = "৳২,১৫০.০০";
  const balance = "৳৩,০৮০.০০";

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);

  const recentTransactionsForAI: FinancialAdviceInput['transactions'] = [
      { title: "বেতন", type: "income", amount: 2500.00, category: "কাজ" },
      { title: "মুদি বাজার", type: "expense", amount: 75.50, category: "খাবার" },
      { title: "ভাড়া", type: "expense", amount: 800.00, category: "আবাসন" },
  ];

  const handleGetAIAdvice = async () => {
      setIsLoadingAdvice(true);
      setAiAdvice(null);
      setAdviceError(null);
      try {
          const input: FinancialAdviceInput = {
              transactions: recentTransactionsForAI,
              userName: "尊用戶", // Example User, consider localization
          };
          const result: FinancialAdviceOutput = await getFinancialAdvice(input);
          setAiAdvice(result.advice);
      } catch (error) {
          console.error("AI পরামর্শ পেতে ত্রুটি:", error);
          setAdviceError("দুঃখিত, এই মুহূর্তে আর্থিক পরামর্শ আনতে পারছি না। অনুগ্রহ করে পরে আবার চেষ্টা করুন।");
      } finally {
          setIsLoadingAdvice(false);
      }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">ড্যাশবোর্ড</h1>
          <Button asChild>
            <Link href="/transactions/new">লেনদেন যোগ করুন</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <SummaryCard
            title="মোট আয়"
            value={totalIncome}
            icon={TrendingUp}
            colorClassName="text-green-500"
            description="গত মাস থেকে +১৫%"
          />
          <SummaryCard
            title="মোট ব্যয়"
            value={totalExpenses}
            icon={TrendingDown}
            colorClassName="text-red-500"
            description="গত মাস থেকে +৫%"
          />
          <SummaryCard
            title="ব্যালেন্স"
            value={balance}
            icon={Scale}
            colorClassName="text-primary"
            description="বর্তমান অ্যাকাউন্ট ব্যালেন্স"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ExpensesBarChart />
          <CategoryPieChart />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"> 
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">সাম্প্রতিক লেনদেন</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">বেতন</p>
                                <p className="text-sm text-muted-foreground">আয়</p>
                            </div>
                            <p className="text-green-500">+৳২৫০০.০০</p>
                        </li>
                        <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">মুদি বাজার</p>
                                <p className="text-sm text-muted-foreground">ব্যয়</p>
                            </div>
                            <p className="text-red-500">-৳৭৫.৫০</p>
                        </li>
                         <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">ভাড়া</p>
                                <p className="text-sm text-muted-foreground">ব্যয়</p>
                            </div>
                            <p className="text-red-500">-৳৮০০.০০</p>
                        </li>
                    </ul>
                    <Button variant="link" className="mt-4 p-0" asChild>
                        <Link href="/transactions">সব লেনদেন দেখুন</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">আসন্ন রিমাইন্ডার</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">ক্রেডিট কার্ড বিল</p>
                                <p className="text-sm text-muted-foreground">শেষ তারিখ: ২৫শে জুলাই</p>
                            </div>
                             <DollarSign className="h-5 w-5 text-yellow-500" />
                        </li>
                        <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">বিদ্যুৎ বিল</p>
                                <p className="text-sm text-muted-foreground">শেষ তারিখ: ২৮শে জুলাই</p>
                            </div>
                            <DollarSign className="h-5 w-5 text-yellow-500" />
                        </li>
                    </ul>
                    <Button variant="link" className="mt-4 p-0" asChild>
                        <Link href="/reminders">রিমাইন্ডার পরিচালনা করুন</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">দ্রুত পদক্ষেপ</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button className="w-full justify-start" variant="outline" asChild><Link href="/transactions/new?type=income">আয় যোগ করুন</Link></Button>
                    <Button className="w-full justify-start" variant="outline" asChild><Link href="/transactions/new?type=expense">ব্যয় যোগ করুন</Link></Button>
                    <Button className="w-full justify-start" variant="outline" asChild><Link href="/reminders/new">রিমাইন্ডার সেট করুন</Link></Button>
                    <Button className="w-full justify-start" variant="outline" asChild><Link href="/reports">রিপোর্ট দেখুন</Link></Button>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI আর্থিক উপদেষ্টা
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 h-full">
                    {isLoadingAdvice && <p className="text-sm text-muted-foreground">ভাবছে...</p>}
                    {adviceError && <p className="text-sm text-destructive">{adviceError}</p>}
                    {aiAdvice && !isLoadingAdvice && !adviceError && (
                        <p className="text-sm text-foreground bg-accent/10 p-3 rounded-md flex-grow">{aiAdvice}</p>
                    )}
                    {!aiAdvice && !isLoadingAdvice && !adviceError && (
                         <p className="text-sm text-muted-foreground flex-grow">আপনার সাম্প্রতিক কার্যকলাপের উপর ভিত্তি করে ব্যক্তিগতকৃত আর্থিক অন্তর্দৃষ্টি পেতে নীচের বোতামে ক্লিক করুন।</p>
                    )}
                    <Button onClick={handleGetAIAdvice} disabled={isLoadingAdvice} className="mt-auto">
                        {isLoadingAdvice ? 'পরামর্শ আনা হচ্ছে...' : 'AI পরামর্শ পান'}
                    </Button>
                </CardContent>
            </Card>
        </div>

      </div>
    </AppLayout>
  );
}
