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

const mockTransactions = [
  { id: '1', type: 'income', title: 'Salary', category: 'Work', amount: 2500, date: '2024-07-01', note: 'Monthly salary' },
  { id: '2', type: 'expense', title: 'Groceries', category: 'Food', amount: 75.50, date: '2024-07-02', note: 'Weekly grocery shopping' },
  { id: '3', type: 'expense', title: 'Rent', category: 'Housing', amount: 800, date: '2024-07-05', note: 'Monthly rent' },
  { id: '4', type: 'income', title: 'Freelance Project', category: 'Work', amount: 500, date: '2024-07-10', note: 'Web design project' },
  { id: '5', type: 'expense', title: 'Dinner Out', category: 'Food', amount: 45.00, date: '2024-07-12', note: 'Restaurant meal' },
  { id: '6', type: 'expense', title: 'Gasoline', category: 'Transport', amount: 50.00, date: '2024-07-15', note: 'Car fuel' },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(''); // e.g., '2024-07'

  const categories = useMemo(() => {
    const allCategories = mockTransactions.map(t => t.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, []);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      const matchesDate = dateFilter === '' || transaction.date.startsWith(dateFilter);
      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [searchTerm, categoryFilter, dateFilter]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Transactions</h1>
          <Button asChild>
            <Link href="/transactions/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Transaction
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              type="month" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Transaction List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="font-medium">{transaction.title}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {transaction.type === 'income' ? 
                        <TrendingUp className="h-5 w-5 text-green-500 inline-block" /> : 
                        <TrendingDown className="h-5 w-5 text-red-500 inline-block" />}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/transactions/edit/${transaction.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No transactions found.
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
