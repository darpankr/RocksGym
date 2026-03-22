"use client"

import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface WorkoutLog {
  id: string
  name: string
  duration_minutes: number | null
  completed_at: string
  exercise_logs?: {
    sets_completed: number
    exercise: {
      muscle_group: string
    }
  }[]
}

interface ProgressChartsProps {
  workoutLogs: WorkoutLog[]
}

const chartConfig = {
  workouts: {
    label: "Workouts",
    color: "var(--chart-1)",
  },
  duration: {
    label: "Duration",
    color: "var(--chart-2)",
  },
}

export function ProgressCharts({ workoutLogs }: ProgressChartsProps) {
  const weeklyData = useMemo(() => {
    const weeks: Record<string, { workouts: number; duration: number }> = {}
    
    workoutLogs.forEach(log => {
      const date = new Date(log.completed_at)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { workouts: 0, duration: 0 }
      }
      weeks[weekKey].workouts++
      weeks[weekKey].duration += log.duration_minutes || 0
    })

    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-4)
      .map(([week, data]) => ({
        week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        workouts: data.workouts,
        duration: data.duration,
      }))
  }, [workoutLogs])

  const muscleGroupData = useMemo(() => {
    const groups: Record<string, number> = {}
    
    workoutLogs.forEach(log => {
      log.exercise_logs?.forEach(exerciseLog => {
        const group = exerciseLog.exercise?.muscle_group || 'Other'
        groups[group] = (groups[group] || 0) + exerciseLog.sets_completed
      })
    })

    return Object.entries(groups)
      .map(([name, sets]) => ({ name, sets }))
      .sort((a, b) => b.sets - a.sets)
      .slice(0, 5)
  }, [workoutLogs])

  if (workoutLogs.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
          <CardDescription>Your training analytics</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground text-center">
            Start logging workouts to see your progress
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Progress Overview
        </CardTitle>
        <CardDescription>Weekly workout frequency</CardDescription>
      </CardHeader>
      <CardContent>
        {weeklyData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-48">
            <BarChart data={weeklyData}>
              <XAxis 
                dataKey="week" 
                tickLine={false} 
                axisLine={false}
                fontSize={12}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="workouts" 
                fill="var(--chart-1)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Not enough data for weekly chart
          </p>
        )}

        {muscleGroupData.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium mb-3">Sets by Muscle Group</h4>
            <div className="space-y-2">
              {muscleGroupData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-20 truncate">
                    {item.name}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ 
                        width: `${(item.sets / Math.max(...muscleGroupData.map(d => d.sets))) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">
                    {item.sets}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
