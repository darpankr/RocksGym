"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Exercise {
  id: string
  name: string
  muscle_group: string
}

interface ExerciseEntry {
  exerciseId: string
  sets: number
  reps: string
  weight: string
}

interface LogWorkoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercises: Exercise[]
  userId: string
  onWorkoutLogged: (workout: any) => void
}

export function LogWorkoutDialog({ 
  open, 
  onOpenChange, 
  exercises, 
  userId,
  onWorkoutLogged 
}: LogWorkoutDialogProps) {
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [duration, setDuration] = useState("")
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([
    { exerciseId: "", sets: 3, reps: "10", weight: "" }
  ])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const addExercise = () => {
    setExerciseEntries([
      ...exerciseEntries,
      { exerciseId: "", sets: 3, reps: "10", weight: "" }
    ])
  }

  const removeExercise = (index: number) => {
    setExerciseEntries(exerciseEntries.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof ExerciseEntry, value: string | number) => {
    const updated = [...exerciseEntries]
    updated[index] = { ...updated[index], [field]: value }
    setExerciseEntries(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)

    const { data: workoutLog, error: workoutError } = await supabase
      .from("workout_logs")
      .insert({
        user_id: userId,
        name: name.trim(),
        notes: notes.trim() || null,
        duration_minutes: duration ? parseInt(duration) : null,
      })
      .select()
      .single()

    if (workoutError || !workoutLog) {
      setLoading(false)
      return
    }

    const validEntries = exerciseEntries.filter(e => e.exerciseId)
    if (validEntries.length > 0) {
      const exerciseLogs = validEntries.map(entry => ({
        workout_log_id: workoutLog.id,
        exercise_id: entry.exerciseId,
        sets_completed: entry.sets,
        reps_per_set: Array(entry.sets).fill(parseInt(entry.reps) || 10),
        weight_per_set: entry.weight 
          ? Array(entry.sets).fill(parseFloat(entry.weight))
          : null,
      }))

      await supabase.from("exercise_logs").insert(exerciseLogs)
    }

    const { data: fullLog } = await supabase
      .from("workout_logs")
      .select(`
        *,
        exercise_logs (
          *,
          exercise:exercises (name, muscle_group)
        )
      `)
      .eq("id", workoutLog.id)
      .single()

    onWorkoutLogged(fullLog || workoutLog)
    
    setName("")
    setNotes("")
    setDuration("")
    setExerciseEntries([{ exerciseId: "", sets: 3, reps: "10", weight: "" }])
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input
              id="workout-name"
              placeholder="e.g., Push Day, Leg Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Exercises</Label>
              <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {exerciseEntries.map((entry, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={entry.exerciseId}
                    onValueChange={(value) => updateExercise(index, "exerciseId", value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises.map((ex) => (
                        <SelectItem key={ex.id} value={ex.id}>
                          {ex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {exerciseEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Sets</Label>
                    <Input
                      type="number"
                      value={entry.sets}
                      onChange={(e) => updateExercise(index, "sets", parseInt(e.target.value) || 0)}
                      min={1}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Reps</Label>
                    <Input
                      type="text"
                      placeholder="10"
                      value={entry.reps}
                      onChange={(e) => updateExercise(index, "reps", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Weight (lbs)</Label>
                    <Input
                      type="number"
                      placeholder="135"
                      value={entry.weight}
                      onChange={(e) => updateExercise(index, "weight", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did the workout feel?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Workout"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
