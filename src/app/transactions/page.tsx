
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

// Mock data, consider translating categories if they are fixed
const mockTransactions = [
  { id: '1', type: 'income', title: 'বেতন', category: 'কাজ', amount: 2500, date: '2024-07-01', note: 'মাসিক বেতন' },
  { id: '2', type: 'expense', title: 'মুদি বাজার', category: 'খাবার', amount: 75.50, date: '2024-07-02', note: 'সাপ্তাহিক মুদি বাজার' },
  { id: '3', type: 'expense', title: 'ভাড়া', category: 'আবাসন', amount: 800, date: '2024-07-05', note: 'মাসিক ভাড়া' },
  { id: '4', type: 'income', title: 'ফ্রিল্যান্স প্রকল্প', category: 'কাজ', amount: 500, date: '2024-07-10', note: 'ওয়েব ডিজাইন প্রকল্প' },
  { id: '5', type: 'expense', title: 'রাতের খাবার', category: 'খাবার', amount: 45.00, date: '2024-07-12', note: 'রেস্টুরেন্টে খাবার' },
  { id: '6', type: 'expense', title: 'পেট্রোল', category: 'পরিবহন', amount: 50.00, date: '2024-07-15', note: 'গাড়ির জ্বালানি' },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(''); // e.g., '2024-07'

  const categories = useMemo(() => {
    // For dynamic categories, ensure they are translated at source or use an i18n key
    const allCategories = mockTransactions.map(t => t.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, []);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (transaction.note && transaction.note.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      const matchesDate = dateFilter === '' || transaction.date.startsWith(dateFilter);
      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [searchTerm, categoryFilter, dateFilter]);
  
  const getCategoryDisplay = (categoryValue: string) => {
    // This is a simple example. For a real app, use a proper i18n solution.
    const translations: { [key: string]: string } = {
      'all': 'সব বিভাগ',
      'Work': 'কাজ',
      'Food': 'খাবার',
      'Housing': 'আবাসন',
      'Transport': 'পরিবহন',
      'Entertainment': 'বিনোদন',
      'Health': 'স্বাস্থ্য',
      'Other': 'অন্যান্য',
    };
    return translations[categoryValue] || categoryValue;
  };


  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">লেনদেন</h1>
          <Button asChild>
            <Link href="/transactions/new">
              <PlusCircle className="mr-2 h-5 w-5" /> লেনদেন যোগ করুন
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> ফিল্টার
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="লেনদেন খুঁজুন..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="বিভাগ দ্বারা ফিল্টার করুন" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{getCategoryDisplay(cat)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              type="month" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="মাস দ্বারা ফিল্টার"
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>লেনদেনের তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>বিভাগ</TableHead>
                  <TableHead className="text-right">পরিমাণ</TableHead>
                  <TableHead className="text-center">ধরন</TableHead>
                  <TableHead className="text-right">ক্রিয়াকলাপ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell> {/* Date formatting might need localization */}
                    <TableCell className="font-medium">{transaction.title}</TableCell>
                    <TableCell>{getCategoryDisplay(transaction.category)}</TableCell>
                    <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'income' ? '+' : '-'}৳{transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {transaction.type === 'income' ? 
                        <TrendingUp className="h-5 w-5 text-green-500 inline-block" title="আয়" /> : 
                        <TrendingDown className="h-5 w-5 text-red-500 inline-block" title="ব্যয়" />}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/transactions/edit/${transaction.id}`} title="সম্পাদনা করুন">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="মুছে ফেলুন">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      কোনো লেনদেন পাওয়া যায়নি।
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
