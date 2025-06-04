
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, BellRing } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock data needs to be translated if displayed directly.
const mockReminders = [
  { id: '1', title: 'ক্রেডিট কার্ড পেমেন্ট', date: '২০২৪-০৭-২৫', note: 'ভিসা বিল পরিশোধ করুন' },
  { id: '2', title: 'ভাড়া বাকি', date: '২০২৪-০৮-০১', note: 'আগস্ট মাসের মাসিক ভাড়া' },
  { id: '3', title: 'সাবস্ক্রিপশন নবায়ন', date: '২০২৪-০৮-১০', note: 'নেটফ্লিক্স সাবস্ক্রিপশন' },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState(mockReminders);

  const handleDelete = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">রিমাইন্ডার</h1>
          <Button asChild>
            <Link href="/reminders/new">
              <PlusCircle className="mr-2 h-5 w-5" /> রিমাইন্ডার যোগ করুন
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-6 w-6 text-primary" />
              আপনার আর্থিক রিমাইন্ডার
            </CardTitle>
            <CardDescription>আপনার বিল এবং আর্থিক ইভেন্টগুলির উপরে নজর রাখুন।</CardDescription>
          </CardHeader>
          <CardContent>
            {reminders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>শিরোনাম</TableHead>
                    <TableHead>নোট</TableHead>
                    <TableHead className="text-right">ক্রিয়াকলাপ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell>{reminder.date}</TableCell> {/* Date formatting might need localization */}
                      <TableCell className="font-medium">{reminder.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{reminder.note}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/reminders/edit/${reminder.id}`} title="সম্পাদনা করুন">
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(reminder.id)} className="text-destructive hover:text-destructive" title="মুছে ফেলুন">
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
                <h3 className="text-lg font-semibold">কোনো রিমাইন্ডার সেট করা নেই</h3>
                <p className="text-muted-foreground">
                  আপনার প্রথম আর্থিক রিমাইন্ডার তৈরি করতে "রিমাইন্ডার যোগ করুন" এ ক্লিক করুন।
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
