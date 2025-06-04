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
          <h1 className="text-3xl font-bold font-headline">Reports</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Monthly Summary Report
            </CardTitle>
            <CardDescription>View and export your monthly financial summaries.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This section will provide detailed monthly reports of your income, expenses, and savings. 
                You&apos;ll be able to filter by month and year, and export reports to PDF.
              </p>
              <div className="p-8 border border-dashed rounded-lg text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Report Generation Feature</h3>
                <p className="text-muted-foreground">
                  Currently under development. Check back soon for interactive reports!
                </p>
              </div>
              <Button disabled> {/* Enable when feature is ready */}
                <Download className="mr-2 h-4 w-4" />
                Export Current Month (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>

         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Search & Filter Options</CardTitle>
             <CardDescription>Advanced search and filtering for reports will be available here.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="p-8 border border-dashed rounded-lg text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Advanced Filtering</h3>
                <p className="text-muted-foreground">
                  More detailed search and filter capabilities for reports are coming soon.
                </p>
              </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
