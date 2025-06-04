"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, BellRing } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const mockReminders = [
  { id: '1', title: 'Credit Card Payment', date: '2024-07-25', note: 'Pay Visa bill' },
  { id: '2', title: 'Rent Due', date: '2024-08-01', note: 'Monthly rent for August' },
  { id: '3', title: 'Subscription Renewal', date: '2024-08-10', note: 'Netflix subscription' },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState(mockReminders);

  const handleDelete = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    // Add actual delete logic here (e.g., API call)
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Reminders</h1>
          <Button asChild>
            <Link href="/reminders/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Reminder
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-6 w-6 text-primary" />
              Your Financial Reminders
            </CardTitle>
            <CardDescription>Stay on top of your bills and financial events.</CardDescription>
          </CardHeader>
          <CardContent>
            {reminders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell>{reminder.date}</TableCell>
                      <TableCell className="font-medium">{reminder.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{reminder.note}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                           {/* Placeholder: Link to edit page */}
                          <Link href={`/reminders/edit/${reminder.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(reminder.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 border border-dashed rounded-lg text-center">
                <BellRing className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Reminders Set</h3>
                <p className="text-muted-foreground">
                  Click &quot;Add Reminder&quot; to create your first financial reminder.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
