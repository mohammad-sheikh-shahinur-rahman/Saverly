
import React from 'react'; // Added this line
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SaverlyLogo } from '@/components/icons';
import { ListChecks, BarChartBig, Sparkles, LogIn, UserPlus, BellRing, NotebookText, Info, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <ListChecks className="h-10 w-10 text-primary mb-4" />,
    title: 'সহজ লেনদেন ট্র্যাকিং',
    description: 'আপনার আয় এবং ব্যয় অনায়াসে রেকর্ড এবং শ্রেণীবদ্ধ করুন, আর্থিক স্বচ্ছতা নিশ্চিত করুন। প্রতিটি লেনদেনের পুঙ্খানুপুঙ্খ হিসাব রাখুন।',
  },
  {
    icon: <BarChartBig className="h-10 w-10 text-primary mb-4" />,
    title: 'শক্তিশালী রিপোর্টিং',
    description: 'আপনার আর্থিক অভ্যাসের গভীর অন্তর্দৃষ্টি পান। বিস্তারিত চার্ট ও প্রতিবেদনের মাধ্যমে আপনার খরচের ধরণ বুঝুন ও ভবিষ্যতের জন্য পরিকল্পনা করুন।',
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
    title: 'AI আর্থিক উপদেষ্টা',
    description: 'ব্যক্তিগতকৃত আর্থিক পরামর্শ এবং সুপারিশ গ্রহণ করুন। AI চ্যাটবটের সাথে কথা বলে আপনার আর্থিক সিদ্ধান্ত গ্রহণে সহায়তা পান।',
  },
  {
    icon: <BellRing className="h-10 w-10 text-primary mb-4" />,
    title: 'বিল রিমাইন্ডার সেট করুন',
    description: 'গুরুত্বপূর্ণ পেমেন্টের ডেডলাইন আর মিস করবেন না। সময়মত বিল পরিশোধের জন্য কাস্টমাইজড রিমাইন্ডার সেট করুন।',
  },
  {
    icon: <NotebookText className="h-10 w-10 text-primary mb-4" />,
    title: 'আর্থিক নোট সংরক্ষণ করুন',
    description: 'আপনার আর্থিক পরিকল্পনা, বাজারের বিশ্লেষণ, সঞ্চয়ের লক্ষ্য এবং অন্যান্য গুরুত্বপূর্ণ তথ্য নিরাপদে নোট করে রাখুন।',
  },
  {
    icon: <LogIn className="h-10 w-10 text-primary mb-4" />, // Changed icon for better visual
    title: 'একাধিক লগইন অপশন',
    description: 'ইমেইল, গুগল অ্যাকাউন্ট অথবা ফোন নম্বর ব্যবহার করে সহজেই সাইন ইন বা সাইন আপ করুন। আপনার পছন্দের পদ্ধতি বেছে নিন।',
  }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 shadow-sm sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <SaverlyLogo className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold">সেভারলি</span>
          </Link>
          <nav className="space-x-2 sm:space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                সাইন ইন
              </Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                সাইন আপ
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-20 sm:py-28 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/20 dark:from-primary/10 dark:via-background dark:to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline mb-6">
              সেভারলি: আপনার <span className="text-primary">আর্থিক স্বচ্ছলতার</span> চাবিকাঠি
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              সেভারলি একটি অত্যাধুনিক ব্যক্তিগত অর্থ ব্যবস্থাপনার অ্যাপ। এর মাধ্যমে আপনি সহজেই আপনার আয়-ব্যয় ট্র্যাক করতে পারবেন, বিলের জন্য রিমাইন্ডার সেট করতে পারবেন, আর্থিক নোট সংরক্ষণ করতে পারবেন এবং AI চালিত উপদেষ্টার কাছ থেকে পরামর্শ নিতে পারবেন। আপনার আর্থিক জীবনকে গুছিয়ে তুলুন সেভারলির সাথে।
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                <Link href="/signup">
                  এখনি শুরু করুন <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                <Link href="/dashboard">
                  অতিথি হিসেবে দেখুন
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-headline">কেন সেভারলি?</h2>
              <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">আপনার আর্থিক জীবনকে সহজ করার জন্য সেরা ফিচারসমূহ। সেভারলি আপনাকে আপনার অর্থের উপর পূর্ণ নিয়ন্ত্রণ দেয়।</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center border border-transparent hover:border-primary/50 transform hover:-translate-y-1">
                  <CardHeader className="p-0 mb-4">
                    <div className="bg-primary/10 p-4 rounded-full inline-block">
                      {React.cloneElement(feature.icon, { className: "h-10 w-10 text-primary"})}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col flex-grow">
                    <CardTitle className="text-xl font-semibold font-headline mb-2">{feature.title}</CardTitle>
                    <p className="text-muted-foreground text-sm flex-grow">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-tr from-primary/5 via-background to-secondary/20 dark:from-primary/10 dark:via-background dark:to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold font-headline mb-6">
              আপনার আর্থিক নিয়ন্ত্রণ নিতে প্রস্তুত?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              আজই সেভারলিতে যোগ দিন এবং একটি চাপমুক্ত আর্থিক ভবিষ্যতের দিকে প্রথম পদক্ষেপ নিন। আমাদের সহজ এবং শক্তিশালী টুলস আপনার অর্থ ব্যবস্থাপনাকে করবে আরও কার্যকর।
            </p>
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/signup">
                বিনামূল্যে সাইন আপ করুন <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <div className="mb-6">
            <SaverlyLogo className="h-10 w-10 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold font-headline text-foreground">সেভারলি</p>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} সেভারলি। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-xs mt-1">একটি ডেমো অ্যাপ্লিকেশন</p>
           
           {/* Developer Info Section */}
            <div className="mt-10 pt-8 border-t border-border/50 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-foreground">ডেভেলপার পরিচিতি</h3>
                <div className="flex flex-col items-center gap-4">
                    {/* Developer image removed as per request for landing page, but can be in dedicated page */}
                    <div>
                        <p className="text-xl font-bold text-foreground">মোহাম্মদ শেখ শাহিনুর রহমান</p>
                        <p className="text-sm text-muted-foreground">কবি | লেখক | সফটওয়্যার ইঞ্জিনিয়ার | প্রোগ্রামার | ডিজিটাল ফরেনসিক বিশেষজ্ঞ | প্রযুক্তি উদ্ভাবক</p>
                    </div>
                    <Button asChild variant="outline" className="mt-2">
                        <Link href="/developer-info">
                            <Info className="mr-2 h-4 w-4" />
                            আরও বিস্তারিত জানুন
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
