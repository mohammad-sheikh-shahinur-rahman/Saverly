
import { Suspense } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { NewTransactionFormWrapper } from './NewTransactionFormWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function NewTransactionPage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">ফর্ম লোড হচ্ছে...</CardTitle>
            </CardHeader>
            <CardContent>
              <p>অনুগ্রহ করে অপেক্ষা করুন...</p>
            </CardContent>
          </Card>
        }>
          <NewTransactionFormWrapper />
        </Suspense>
      </div>
    </AppLayout>
  );
}
