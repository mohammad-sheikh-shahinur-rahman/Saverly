import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  colorClassName?: string;
  description?: string;
}

// No direct text here to translate, text comes from props.
// Ensure props passed to this component are translated.
export function SummaryCard({ title, value, icon: Icon, colorClassName, description }: SummaryCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-body">{title}</CardTitle>
        <Icon className={cn("h-5 w-5 text-muted-foreground", colorClassName)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
