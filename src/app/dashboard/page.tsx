"use client";

import { AppLayout } from '@/components/AppLayout';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ExpensesBarChart } from '@/components/dashboard/ExpensesBarChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { TrendingUp, TrendingDown, Scale, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  // Placeholder data
  const totalIncome = "$5,230.00";
  const totalExpenses = "$2,150.00";
  const balance = "$3,080.00";

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
          <Button asChild>
            <Link href="/transactions/new">Add Transaction</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <SummaryCard
            title="Total Income"
            value={totalIncome}
            icon={TrendingUp}
            colorClassName="text-green-500"
            description="+15% from last month"
          />
          <SummaryCard
            title="Total Expenses"
            value={totalExpenses}
            icon={TrendingDown}
            colorClassName="text-red-500"
            description="+5% from last month"
          />
          <SummaryCard
            title="Balance"
            value={balance}
            icon={Scale}
            colorClassName="text-primary"
            description="Current account balance"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ExpensesBarChart />
          <CategoryPieChart />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Salary</p>
                                <p className="text-sm text-muted-foreground">Income</p>
                            </div>
                            <p className="text-green-500">+$2500.00</p>
                        </li>
                        <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Groceries</p>
                                <p className="text-sm text-muted-foreground">Expense</p>
                            </div>
                            <p className="text-red-500">-$75.50</p>
                        </li>
                         <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Rent</p>
                                <p className="text-sm text-muted-foreground">Expense</p>
                            </div>
                            <p className="text-red-500">-$800.00</p>
                        </li>
                    </ul>
                    <Button variant="link" className="mt-4 p-0" asChild>
                        <Link href="/transactions">View all transactions</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Upcoming Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Credit Card Bill</p>
                                <p className="text-sm text-muted-foreground">Due: 25th July</p>
                            </div>
                             <DollarSign className="h-5 w-5 text-yellow-500" />
                        </li>
                        <li className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Electricity Bill</p>
                                <p className="text-sm text-muted-foreground">Due: 28th July</p>
                            </div>
                            <DollarSign className="h-5 w-5 text-yellow-500" />
                        </li>
                    </ul>
                    <Button variant="link" className="mt-4 p-0" asChild>
                        <Link href="/reminders">Manage reminders</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button className="w-full justify-start" variant="outline" asChild><Link href="/transactions/new?type=income">Add Income</Link></Button>
                    <Button className="w-full justify-start" variant="outline" asChild><Link href="/transactions/new?type=expense">Add Expense</Link></Button>
                    <Button className="w-full justify-start" variant="outline" asChild><Link href="/reminders/new">Set Reminder</Link></Button>
                    <Button className="w-full justify-start" variant="outline" asChild><Link href="/reports">View Reports</Link></Button>
                </CardContent>
            </Card>
        </div>

      </div>
    </AppLayout>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Already imported
