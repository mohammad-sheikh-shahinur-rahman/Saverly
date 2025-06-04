
"use client";

import { AppLayout } from '@/components/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link as LinkIcon, UserCircle, Briefcase, BookOpen, Cpu, Lightbulb, ExternalLink, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const developerInfo = {
  name: 'মোহাম্মদ শেখ শাহিনুর রহমান',
  photoUrl: 'https://m.media-amazon.com/images/S/amzn-author-media-prod/b02mvc2hucu96hchlksdjmogii._SY450_CR0%2C0%2C450%2C450_.jpg',
  titles: [
    { icon: <Briefcase className="h-5 w-5 text-primary" />, text: 'সফটওয়্যার ইঞ্জিনিয়ার' },
    { icon: <Cpu className="h-5 w-5 text-primary" />, text: 'প্রোগ্রামার' },
    { icon: <BookOpen className="h-5 w-5 text-primary" />, text: 'কবি ও লেখক' },
    { icon: <UserCircle className="h-5 w-5 text-primary" />, text: 'ডিজিটাল ফরেনসিক বিশেষজ্ঞ' },
    { icon: <Lightbulb className="h-5 w-5 text-primary" />, text: 'প্রযুক্তি উদ্ভাবক' },
  ],
  websites: [
    { name: 'ব্যক্তিগত ওয়েবসাইট', url: 'https://mohammad-sheikh-shahinur-rahman.vercel.app/', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'আমাদের সমাজ ব্লগ', url: 'https://shahinur.amadersomaj.com/', icon: <BookOpen className="h-4 w-4 mr-2" /> },
  ],
  bio: 'মোহাম্মদ শেখ শাহিনুর রহমান একজন বহুমাত্রিক প্রতিভার অধিকারী ব্যক্তিত্ব। তিনি একাধারে একজন সফটওয়্যার ইঞ্জিনিয়ার, প্রোগ্রামার, ডিজিটাল ফরেনসিক বিশেষজ্ঞ এবং প্রযুক্তি উদ্ভাবক। প্রযুক্তির জগতের বাইরেও তিনি একজন স্বনামধন্য কবি ও লেখক। তার লেখনী এবং প্রযুক্তিগত উদ্ভাবন উভয় ক্ষেত্রেই তিনি সমাজের জন্য গুরুত্বপূর্ণ অবদান রেখে চলেছেন। সেভারলি অ্যাপটি তারই একটি সৃষ্টি, যা ব্যবহারকারীদের আর্থিক ব্যবস্থাপনায় সহায়তা করার জন্য ডিজাইন করা হয়েছে।',
};

export default function DeveloperInfoPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Card className="shadow-2xl overflow-hidden rounded-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:via-background dark:to-secondary/10 p-6 text-center relative">
            <div className="absolute top-4 left-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/">
                        <Home className="h-4 w-4 mr-1" />
                        হোমপেজ
                    </Link>
                </Button>
            </div>
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 border-4 border-primary shadow-lg mb-4">
                <AvatarImage src={developerInfo.photoUrl} alt={developerInfo.name} />
                <AvatarFallback>{developerInfo.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-3xl text-primary">{developerInfo.name}</CardTitle>
              <CardDescription className="text-muted-foreground text-base mt-1">
                {developerInfo.titles.map(t => t.text).join(' | ')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold font-headline mb-3 text-foreground flex items-center">
                <UserCircle className="h-5 w-5 mr-2 text-primary" />
                সংক্ষিপ্ত পরিচিতি
              </h3>
              <p className="text-muted-foreground text-justify leading-relaxed">{developerInfo.bio}</p>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-lg font-semibold font-headline mb-4 text-foreground flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                পেশাগত পরিচয়
              </h3>
              <ul className="space-y-2">
                {developerInfo.titles.map((title, index) => (
                  <li key={index} className="flex items-center text-muted-foreground">
                    {React.cloneElement(title.icon, { className: "h-5 w-5 mr-3 text-primary flex-shrink-0" })}
                    <span>{title.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold font-headline mb-4 text-foreground flex items-center">
                <LinkIcon className="h-5 w-5 mr-2 text-primary" />
                আরও জানুন
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {developerInfo.websites.map((site, index) => (
                  <Button key={index} variant="outline" asChild className="justify-start text-left h-auto py-3">
                    <Link href={site.url} target="_blank" rel="noopener noreferrer">
                      {React.cloneElement(site.icon, {className: "h-5 w-5 mr-2 flex-shrink-0"})}
                      <div className="flex flex-col">
                        <span className="font-semibold">{site.name}</span>
                        <span className="text-xs text-muted-foreground truncate group-hover:text-primary">{site.url.replace('https://','')}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">সেভারলি অ্যাপটি {developerInfo.name} কর্তৃক তৈরি।</p>
        </div>
      </div>
    </AppLayout>
  );
}
