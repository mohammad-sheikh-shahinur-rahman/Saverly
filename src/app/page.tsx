
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SaverlyLogo } from '@/components/icons';
import { ListChecks, BarChartBig, Sparkles, LogIn, UserPlus } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <ListChecks className="h-10 w-10 text-primary mb-4" />,
    title: 'সহজ লেনদেন ট্র্যাকিং',
    description: 'আপনার আয় এবং ব্যয় অনায়াসে রেকর্ড এবং শ্রেণীবদ্ধ করুন, আর্থিক স্বচ্ছতা নিশ্চিত করুন।',
  },
  {
    icon: <BarChartBig className="h-10 w-10 text-primary mb-4" />,
    title: 'শক্তিশালী রিপোর্টিং',
    description: 'আপনার আর্থিক অভ্যাসের গভীর অন্তর্দৃষ্টি পান, তথ্যভিত্তিক সিদ্ধান্ত নিতে সহায়তা করবে।',
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
    title: 'AI আর্থিক উপদেষ্টা',
    description: 'ব্যক্তিগতকৃত আর্থিক পরামর্শ এবং সুপারিশ গ্রহণ করুন, আপনার অর্থ ব্যবস্থাপনাকে করবে আরও সহজ।',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
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
        <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-slate-50 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline mb-6">
              সেভারলি: আপনার <span className="text-primary">আর্থিক স্বচ্ছলতার</span> চাবিকাঠি
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              আপনার আয় ও ব্যয় ট্র্যাক করুন, বাজেট তৈরি করুন, এবং আর্থিক লক্ষ্যে পৌঁছান – সবই এক জায়গায়। সেভারলি আপনার অর্থ ব্যবস্থাপনাকে সহজ ও কার্যকর করে তোলে।
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/signup">
                  এখনি শুরু করুন
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/dashboard">
                  ডেমো দেখুন
                </Link>
              </Button>
            </div>
            <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
               <Image 
                src="https://placehold.co/1200x600.png" 
                alt="সেভারলি অ্যাপ ড্যাশবোর্ডের স্ক্রিনশট" 
                width={1200} 
                height={600}
                className="rounded-lg shadow-2xl object-cover"
                data-ai-hint="finance app dashboard"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold font-headline">কেন সেভারলি?</h2>
              <p className="text-lg text-muted-foreground mt-2">আপনার আর্থিক জীবনকে সহজ করার জন্য সেরা ফিচারসমূহ।</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
              {features.map((feature) => (
                <div key={feature.title} className="bg-card p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-center items-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold font-headline mt-2 mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 sm:py-24 bg-primary/5 dark:bg-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold font-headline mb-6">
              আপনার আর্থিক নিয়ন্ত্রণ নিতে প্রস্তুত?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              আজই সেভারলিতে যোগ দিন এবং একটি চাপমুক্ত আর্থিক ভবিষ্যতের দিকে প্রথম পদক্ষেপ নিন।
            </p>
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/signup">
                বিনামূল্যে সাইন আপ করুন
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-slate-100 dark:bg-slate-800 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} সেভারলি। সর্বস্বত্ব সংরক্ষিত।</p>
           <p className="text-xs mt-1">একটি ডেমো অ্যাপ্লিকেশন</p>
        </div>
      </footer>
    </div>
  );
}
