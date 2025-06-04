
import { AppLayout } from '@/components/AppLayout';
import React, { Suspense } from 'react';
import { TransactionFormClient } from './TransactionFormClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewTransactionPageContainer() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">নতুন লেনদেন যোগ করুন</CardTitle>
            </CardHeader>
            <CardContent>
              <p>ফর্ম লোড হচ্ছে...</p>
            </CardContent>
          </Card>
        }>
          <TransactionFormClient />
        </Suspense>
      </div>
    </AppLayout>
  );
}
