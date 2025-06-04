
"use client"

import { Pie, PieChart, Legend, Tooltip as RechartsTooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartData = [
  { category: "Food", amount: 275, fill: "var(--color-food)" },
  { category: "Transport", amount: 200, fill: "var(--color-transport)" },
  { category: "Housing", amount: 187, fill: "var(--color-housing)" },
  { category: "Shopping", amount: 173, fill: "var(--color-shopping)" },
  { category: "Other", amount: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  amount: {
    label: "Amount",
  },
  food: {
    label: "Food",
    color: "hsl(var(--chart-1))",
  },
  transport: {
    label: "Transport",
    color: "hsl(var(--chart-2))",
  },
  housing: {
    label: "Housing",
    color: "hsl(var(--chart-3))",
  },
  shopping: {
    label: "Shopping",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function CategoryPieChart() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Expense Categories</CardTitle>
        <CardDescription>Breakdown of expenses by category this month</CardDescription>
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
                nameKey="category"
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
