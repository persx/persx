"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

// Sample data - in production this would come from your analytics
const chartData = [
  { month: "January", personalized: 186, default: 80 },
  { month: "February", personalized: 305, default: 200 },
  { month: "March", personalized: 237, default: 120 },
  { month: "April", personalized: 273, default: 190 },
  { month: "May", personalized: 209, default: 130 },
  { month: "June", personalized: 314, default: 140 },
]

const chartConfig = {
  personalized: {
    label: "Personalized",
    color: "hsl(var(--chart-1))",
  },
  default: {
    label: "Default",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function PersonalizationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Delivery</CardTitle>
        <CardDescription>
          Personalized vs default content served over time
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={4}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="personalized"
              type="natural"
              fill="var(--color-personalized)"
              fillOpacity={0.4}
              stroke="var(--color-personalized)"
              stackId="a"
            />
            <Area
              dataKey="default"
              type="natural"
              fill="var(--color-default)"
              fillOpacity={0.4}
              stroke="var(--color-default)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
