
"use client";

import { AppLayout } from '@/components/AppLayout';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ExpensesBarChart } from '@/components/dashboard/ExpensesBarChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { TrendingUp, TrendingDown, Scale, DollarSign, Sparkles, SendHorizonal, Lightbulb, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input as UiInput } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getFinancialChatResponse, type ChatInput, type ChatResponse } from '@/ai/flows/financial-advisor-flow';
import { getSavingsTip, type SavingsTipInput, type SavingsTipResponse } from '@/ai/flows/savings-tip-flow';
import type { FinancialAdviceInput } from '@/ai/flows/financial-advisor-flow'; // Keep for transaction type, though a bit redundant now

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

// Simplified Transaction type for local use, matching SavingsTipInput's expectation
type TransactionForTip = {
  title: string;
  type: "income" | "expense";
  amount: number;
  category: string;
};


export default function DashboardPage() {
  const totalIncome = "৳৫,২৩০.০০";
  const totalExpenses = "৳২,১৫০.০০";
  const balance = "৳৩,০৮০.০০";

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentUserMessage, setCurrentUserMessage] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [savingsTip, setSavingsTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [tipError, setTipError] = useState<string | null>(null);

  const recentTransactionsForAI: TransactionForTip[] = [ // Updated type here
      { title: "বেতন", type: "income", amount: 2500.00, category: "কাজ" },
      { title: "মুদি বাজার", type: "expense", amount: 75.50, category: "খাবার" },
      { title: "ভাড়া", type: "expense", amount: 800.00, category: "আবাসন" },
      { title: "সকালের নাস্তা", type: "expense", amount: 12.00, category: "খাবার" },
      { title: "মোবাইল বিল", type: "expense", amount: 20.00, category: "অন্যান্য" },
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages]);

  const fetchSavingsTip = useCallback(async () => {
    setIsLoadingTip(true);
    setTipError(null);
    try {
      const input: SavingsTipInput = {
        transactions: recentTransactionsForAI,
        userName: "ব্যবহারকারী",
      };
      const result: SavingsTipResponse = await getSavingsTip(input);
      setSavingsTip(result.tip);
    } catch (error) {
      console.error("AI সেভিংস টিপ পেতে ত্রুটি:", error);
      setTipError("দুঃখিত, এই মুহূর্তে সেভিংস টিপ পাওয়া যাচ্ছে না।");
      setSavingsTip(null);
    } finally {
      setIsLoadingTip(false);
    }
  }, [recentTransactionsForAI]); // Add dependencies if they change

  useEffect(() => {
    fetchSavingsTip();
  }, [fetchSavingsTip]);

  const handleSendMessage = async () => {
    if (!currentUserMessage.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', text: currentUserMessage.trim() };
    setChatMessages(prev => [...prev, newUserMessage]);
    setCurrentUserMessage('');
    setIsLoadingResponse(true);
    setChatError(null);

    try {
      const historyForAI = chatMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: msg.text,
      }));
      
      const input: ChatInput = {
          userQuery: newUserMessage.text,
          transactions: recentTransactionsForAI.map(t => ({ // Map to ChatInput's transaction type
            title: t.title,
            type: t.type,
            amount: t.amount,
            category: t.category,
          })),
          userName: "ব্যবহারকারী", 
          chatHistory: historyForAI,
      };
      const result: ChatResponse = await getFinancialChatResponse(input);
      setChatMessages(prev => [...prev, { role: 'ai', text: result.response }]);
    } catch (error) {
      console.error("AI চ্যাট প্রতিক্রিয়া পেতে ত্রুটি:", error);
      setChatError("দুঃখিত, এই মুহূর্তে AI এর সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে পরে আবার চেষ্টা করুন।");
    } finally {
      setIsLoadingResponse(false);
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
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              স্মার্ট সঞ্চয় টিপ
            </CardTitle>
            <CardDescription>আপনার লেনদেনের উপর ভিত্তি করে AI তৈরি টিপস।</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTip && <p className="text-muted-foreground">টিপ লোড হচ্ছে...</p>}
            {tipError && <p className="text-destructive">{tipError}</p>}
            {savingsTip && !isLoadingTip && <p className="text-foreground">{savingsTip}</p>}
            {!isLoadingTip && !savingsTip && !tipError && <p className="text-muted-foreground">কোনো টিপ পাওয়া যায়নি।</p>}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={fetchSavingsTip} disabled={isLoadingTip}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingTip ? 'animate-spin' : ''}`} />
              নতুন টিপ পান
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> 
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
            <Card className="shadow-lg lg:col-span-1 flex flex-col h-[500px]">
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI আর্থিক উপদেষ্টা চ্যাট
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0">
                    <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {chatMessages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoadingResponse && (
                                <div className="flex justify-start">
                                     <div className="max-w-[75%] p-3 rounded-lg bg-muted text-muted-foreground">
                                        <p className="text-sm">ভাবছে...</p>
                                    </div>
                                </div>
                            )}
                            {chatError && (
                                <div className="flex justify-start">
                                     <div className="max-w-[75%] p-3 rounded-lg bg-destructive text-destructive-foreground">
                                        <p className="text-sm">{chatError}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <div className="flex w-full items-center space-x-2">
                        <UiInput 
                            type="text" 
                            placeholder="একটি বার্তা লিখুন..." 
                            value={currentUserMessage}
                            onChange={(e) => setCurrentUserMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoadingResponse && handleSendMessage()}
                            disabled={isLoadingResponse}
                            className="flex-grow"
                        />
                        <Button type="submit" size="icon" onClick={handleSendMessage} disabled={isLoadingResponse || !currentUserMessage.trim()}>
                            <SendHorizonal className="h-5 w-5" />
                            <span className="sr-only">বার্তা পাঠান</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>

      </div>
    </AppLayout>
  );
}
