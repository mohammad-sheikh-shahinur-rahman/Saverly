
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">রিপোর্ট</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              মাসিক সারসংক্ষেপ রিপোর্ট
            </CardTitle>
            <CardDescription>আপনার মাসিক আর্থিক সারসংক্ষেপ দেখুন এবং এক্সপোর্ট করুন।</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                এই বিভাগে আপনার আয়, ব্যয় এবং সঞ্চয়ের বিস্তারিত মাসিক রিপোর্ট প্রদান করা হবে। 
                আপনি মাস এবং বছর অনুযায়ী ফিল্টার করতে এবং পিডিএফ-এ রিপোর্ট এক্সপোর্ট করতে পারবেন।
              </p>
              <div className="p-8 border border-dashed rounded-lg text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">রিপোর্ট জেনারেশন বৈশিষ্ট্য</h3>
                <p className="text-muted-foreground">
                  বর্তমানে উন্নয়নাধীন। ইন্টারেক্টিভ রিপোর্টের জন্য শীঘ্রই আবার দেখুন!
                </p>
              </div>
              <Button disabled> 
                <Download className="mr-2 h-4 w-4" />
                বর্তমান মাস এক্সপোর্ট করুন (পিডিএফ)
              </Button>
            </div>
          </CardContent>
        </Card>

         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>অনুসন্ধান ও ফিল্টার অপশন</CardTitle>
             <CardDescription>রিপোর্টের জন্য উন্নত অনুসন্ধান এবং ফিল্টারিং এখানে উপলব্ধ হবে।</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="p-8 border border-dashed rounded-lg text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">উন্নত ফিল্টারিং</h3>
                <p className="text-muted-foreground">
                  রিপোর্টের জন্য আরও বিস্তারিত অনুসন্ধান এবং ফিল্টার করার ক্ষমতা শীঘ্রই আসছে।
                </p>
              </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
