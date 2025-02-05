"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type StatusName = 'tersedia' | 'dipinjam' | 'rusak';

const chartConfig: Record<StatusName, { label: string; color: string }> = {
  tersedia: {
    label: "Tersedia",
    color: "hsl(var(--chart-2))",
  },
  dipinjam: {
    label: "Dipinjam",
    color: "hsl(var(--chart-4))",
  },
  rusak: {
    label: "Rusak",
    color: "hsl(var(--chart-1))",
  },
};

export function Component({ data }: { data: Array<{ name: string, value: number }> }) {
  const pieData = data.map(item => {
    const key = item.name.toLowerCase() as StatusName;
    return {
      ...item,
      fill: chartConfig[key].color,
    };
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl">Status Barang</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-md">
        <div className="flex items-center mt-4 text-md border p-2 rounded-lg">
          <ul className="flex space-x-4">
            {pieData.map((item) => (
              <li key={item.name} className="flex items-center">
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    backgroundColor: item.fill,
                    marginRight: "8px",
                  }}
                ></span>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}
