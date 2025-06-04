"use client";

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, NotebookText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const mockNotes = [
  { id: '1', title: 'Investment Ideas Q3', content: 'Research tech stocks and ETFs. Consider long-term government bonds.', date: '2024-07-10' },
  { id: '2', title: 'Savings Goals 2025', content: 'Aim for $10,000 emergency fund. Save $500/month for vacation.', date: '2024-07-05' },
  { id: '3', title: 'Tax Deduction Checklist', content: 'Gather all receipts for work-from-home expenses. Check new tax laws.', date: '2024-06-20' },
];

export default function NotesPage() {
  const [notes, setNotes] = useState(mockNotes);

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    // Add actual delete logic here
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Financial Notes</h1>
          <Button asChild>
            <Link href="/notes/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Note
            </Link>
          </Button>
        </div>

        {notes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id} className="shadow-lg flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline">{note.title}</CardTitle>
                  <CardDescription>Last updated: {note.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
                </CardContent>
                <div className="p-4 border-t flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/notes/edit/${note.id}`}> {/* Placeholder link */}
                      <Edit className="mr-1 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <NotebookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Financial Notes Yet</h3>
              <p className="text-muted-foreground">
                Click &quot;Add Note&quot; to start jotting down your financial thoughts and plans.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
