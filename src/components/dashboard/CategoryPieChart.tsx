
"use client"

import { Pie, PieChart, Legend, Tooltip as RechartsTooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

// Ensure category names are translated or come from a translated source
const chartData = [
  { category: "খাবার", amount: 275, fill: "var(--color-food)" },
  { category: "পরিবহন", amount: 200, fill: "var(--color-transport)" },
  { category: "আবাসন", amount: 187, fill: "var(--color-housing)" },
  { category: "কেনাকাটা", amount: 173, fill: "var(--color-shopping)" },
  { category: "অন্যান্য", amount: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  amount: {
    label: "পরিমাণ", // Amount
  },
  food: {
    label: "খাবার", // Food
    color: "hsl(var(--chart-1))",
  },
  transport: {
    label: "পরিবহন", // Transport
    color: "hsl(var(--chart-2))",
  },
  housing: {
    label: "আবাসন", // Housing
    color: "hsl(var(--chart-3))",
  },
  shopping: {
    label: "কেনাকাটা", // Shopping
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "অন্যান্য", // Other
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function CategoryPieChart() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">ব্যয়ের বিভাগসমূহ</CardTitle>
        <CardDescription>এই মাসে বিভাগ অনুযায়ী ব্যয়ের বিভাজন</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px] w-full">
            <PieChart accessibilityLayer>
              <RechartsTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category" // This will use the translated category names from chartData
                innerRadius={60}
                strokeWidth={5}
              />
              <Legend />
            </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
