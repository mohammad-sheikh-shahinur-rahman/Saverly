
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, NotebookText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock data - translate content if displayed and static
const mockNotes = [
  { id: '1', title: 'বিনিয়োগের ধারণা Q3', content: 'টেক স্টক এবং ইটিএফ গবেষণা করুন। দীর্ঘমেয়াদী সরকারি বন্ড বিবেচনা করুন।', date: '২০২৪-০৭-১০' },
  { id: '2', title: 'সঞ্চয়ের লক্ষ্য ২০২৫', content: '৳১০,০০০ জরুরি তহবিল লক্ষ্য করুন। অবকাশের জন্য প্রতি মাসে ৳৫০০ সঞ্চয় করুন।', date: '২০২৪-০৭-০৫' },
  { id: '3', title: 'ট্যাক্স ডিডাকশন চেকলিস্ট', content: 'বাড়ি থেকে কাজের খরচের সমস্ত রসিদ সংগ্রহ করুন। নতুন ট্যাক্স আইন পরীক্ষা করুন।', date: '২০২৪-০৬-২০' },
];

export default function NotesPage() {
  const [notes, setNotes] = useState(mockNotes);

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">আর্থিক নোট</h1>
          <Button asChild>
            <Link href="/notes/new">
              <PlusCircle className="mr-2 h-5 w-5" /> নোট যোগ করুন
            </Link>
          </Button>
        </div>

        {notes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id} className="shadow-lg flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline">{note.title}</CardTitle>
                  <CardDescription>শেষ আপডেট: {note.date}</CardDescription> {/* Date formatting may need localization */}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
                </CardContent>
                <div className="p-4 border-t flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/notes/edit/${note.id}`} title="সম্পাদনা করুন">
                      <Edit className="mr-1 h-4 w-4" /> সম্পাদনা
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id)} className="text-destructive hover:text-destructive" title="মুছে ফেলুন">
                    <Trash2 className="mr-1 h-4 w-4" /> মুছুন
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <NotebookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">এখনও কোনো আর্থিক নোট নেই</h3>
              <p className="text-muted-foreground">
                আপনার আর্থিক চিন্তা ও পরিকল্পনা লিখতে "নোট যোগ করুন" এ ক্লিক করুন।
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
