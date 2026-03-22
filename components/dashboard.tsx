"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { 
  Dumbbell, Plus, Calendar, Clock, TrendingUp, 
  LogOut, Home, ChevronRight, Trash2, Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogWorkoutDialog } from "@/components/log-workout-dialog"
import { ProgressCharts } from "@/components/progress-charts"

interface Exercise {
  id: string
  name: string
  muscle_group: string
  equipment: string
  difficulty: string
}

interface ExerciseLog {
  id: string
  exercise_id: string
  sets_completed: number
  reps_per_set: number[]
  weight_per_set: number[]
  exercise: {
    name: string
    muscle_group: string
  }
}

interface WorkoutLog {
  id: string
  name: string
  notes: string | null
  duration_minutes: number | null
  completed_at: string
  exercise_logs: ExerciseLog[]
}

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

interface DashboardProps {
  user: User
  profile: Profile | null
  workoutLogs: WorkoutLog[]
  exercises: Exercise[]
}

export function Dashboard({ user, profile, workoutLogs, exercises }: DashboardProps) {
  const [logs, setLogs] = useState(workoutLogs)
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleWorkoutLogged = (newLog: WorkoutLog) => {
    setLogs([newLog, ...logs])
    setDialogOpen(false)
  }

  const handleDeleteWorkout = async (workoutId: string) => {
    const { error } = await supabase
      .from("workout_logs")
      .delete()
      .eq("id", workoutId)

    if (!error) {
      setLogs(logs.filter(log => log.id !== workoutId))
    }
  }

  const totalWorkouts = logs.length
  const totalMinutes = logs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0)
  const thisWeekWorkouts = logs.filter(log => {
    const logDate = new Date(log.completed_at)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return logDate >= weekAgo
  }).length

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Athlete"

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold hidden sm:inline">IronForge</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {displayName}
            </span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and log your workouts
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Log Workout
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Workouts</p>
                  <p className="text-2xl font-bold">{totalWorkouts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Minutes</p>
                  <p className="text-2xl font-bold">{totalMinutes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{thisWeekWorkouts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Workouts
              </CardTitle>
              <CardDescription>Your latest training sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-8">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No workouts logged yet</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => setDialogOpen(true)}
                  >
                    Log your first workout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.slice(0, 5).map((log) => (
                    <div 
                      key={log.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Dumbbell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{log.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.completed_at).toLocaleDateString()}
                            {log.duration_minutes && ` • ${log.duration_minutes} min`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.exercise_logs?.length > 0 && (
                          <Badge variant="secondary">
                            {log.exercise_logs.length} exercises
                          </Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => handleDeleteWorkout(log.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <ProgressCharts workoutLogs={logs} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/exercises">
            <Card className="bg-card hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Exercise Library</p>
                    <p className="text-sm text-muted-foreground">Browse all exercises</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/trainers">
            <Card className="bg-card hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Home className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Our Trainers</p>
                    <p className="text-sm text-muted-foreground">Meet the team</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <LogWorkoutDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exercises={exercises}
        userId={user.id}
        onWorkoutLogged={handleWorkoutLogged}
      />
    </div>
  )
}
