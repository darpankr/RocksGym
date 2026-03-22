"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Dumbbell, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Exercise {
  id: string
  name: string
  description: string
  muscle_group: string
  equipment: string
  difficulty: string
  instructions: string[]
}

const muscleGroups = ["All", "Legs", "Chest", "Back", "Shoulders", "Arms", "Core"]
const difficulties = ["All", "beginner", "intermediate", "advanced"]

export function ExerciseLibrary({ exercises }: { exercises: Exercise[] }) {
  const [search, setSearch] = useState("")
  const [muscleFilter, setMuscleFilter] = useState("All")
  const [difficultyFilter, setDifficultyFilter] = useState("All")

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(search.toLowerCase())
    const matchesMuscle = muscleFilter === "All" || exercise.muscle_group === muscleFilter
    const matchesDifficulty = difficultyFilter === "All" || exercise.difficulty === difficultyFilter
    return matchesSearch && matchesMuscle && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-balance">Exercise Library</h1>
        <p className="text-muted-foreground mt-2 text-pretty">
          Browse our comprehensive database of exercises with detailed instructions
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select value={muscleFilter} onValueChange={setMuscleFilter}>
            <SelectTrigger className="w-[140px] bg-card border-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Muscle" />
            </SelectTrigger>
            <SelectContent>
              {muscleGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[140px] bg-card border-border">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff} value={diff}>
                  {diff === "All" ? "All Levels" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredExercises.length === 0 ? (
        <div className="text-center py-16">
          <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No exercises found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <Dialog key={exercise.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:border-primary/50 transition-colors bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">{exercise.name}</CardTitle>
                      <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {exercise.description}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{exercise.muscle_group}</Badge>
                      <Badge variant="outline">{exercise.equipment}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">{exercise.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{exercise.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{exercise.muscle_group}</Badge>
                    <Badge variant="outline">{exercise.equipment}</Badge>
                    <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  {exercise.instructions && exercise.instructions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Instructions</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        {exercise.instructions.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  )
}
