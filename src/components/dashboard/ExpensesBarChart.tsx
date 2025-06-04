
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

// Chart data might need localization for month names if displayed directly
const chartData = [
  { month: "জানু", expenses: 186, income: 80 }, // Jan
  { month: "ফেব্রু", expenses: 305, income: 200 }, // Feb
  { month: "মার্চ", expenses: 237, income: 120 }, // Mar
  { month: "এপ্রিল", expenses: 73, income: 190 }, // Apr
  { month: "মে", expenses: 209, income: 130 },   // May
  { month: "জুন", expenses: 214, income: 140 },  // Jun
];

const chartConfig = {
  expenses: {
    label: "ব্যয়", // Expenses
    color: "hsl(var(--destructive))",
  },
  income: {
    label: "আয়", // Income
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ExpensesBarChart() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">মাসিক চিত্র</CardTitle>
        <CardDescription>আয় বনাম ব্যয় - গত ৬ মাস</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)} // Keep if abbreviation is fine, otherwise use full names from data
            />
            <YAxis />
            <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} name={chartConfig.income.label} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} name={chartConfig.expenses.label} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
