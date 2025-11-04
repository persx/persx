"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", eCommerce: 222, Healthcare: 150, Financial: 180, Education: 120, B2B: 140 },
  { month: "February", eCommerce: 197, Healthcare: 180, Financial: 220, Education: 140, B2B: 160 },
  { month: "March", eCommerce: 187, Healthcare: 120, Financial: 200, Education: 130, B2B: 150 },
  { month: "April", eCommerce: 239, Healthcare: 240, Financial: 260, Education: 180, B2B: 190 },
  { month: "May", eCommerce: 209, Healthcare: 140, Financial: 190, Education: 150, B2B: 170 },
  { month: "June", eCommerce: 244, Healthcare: 220, Financial: 280, Education: 200, B2B: 210 },
]

const chartConfig = {
  eCommerce: {
    label: "eCommerce 🛒",
    color: "hsl(var(--chart-1))",
  },
  Healthcare: {
    label: "Healthcare 🏥",
    color: "hsl(var(--chart-2))",
  },
  Financial: {
    label: "Financial 💳",
    color: "hsl(var(--chart-3))",
  },
  Education: {
    label: "Education 🎓",
    color: "hsl(var(--chart-4))",
  },
  B2B: {
    label: "B2B/SaaS 💼",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function IndustryPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Engagement</CardTitle>
        <CardDescription>
          Personalized content interactions by industry vertical
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="filleCommerce" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-eCommerce)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-eCommerce)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillHealthcare" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Healthcare)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Healthcare)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFinancial" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Financial)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Financial)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="eCommerce"
              type="natural"
              fill="url(#filleCommerce)"
              fillOpacity={0.4}
              stroke="var(--color-eCommerce)"
            />
            <Area
              dataKey="Healthcare"
              type="natural"
              fill="url(#fillHealthcare)"
              fillOpacity={0.4}
              stroke="var(--color-Healthcare)"
            />
            <Area
              dataKey="Financial"
              type="natural"
              fill="url(#fillFinancial)"
              fillOpacity={0.4}
              stroke="var(--color-Financial)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
