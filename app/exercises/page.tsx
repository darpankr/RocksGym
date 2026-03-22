import { createClient } from "@/lib/supabase/server"
import { ExerciseLibrary } from "@/components/exercise-library"

export const metadata = {
  title: "Exercise Library | IronForge Gym",
  description: "Browse our comprehensive exercise database with detailed instructions and muscle group filters.",
}

export default async function ExercisesPage() {
  const supabase = await createClient()
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .order("name")

  return (
    <main className="min-h-screen bg-background">
      <ExerciseLibrary exercises={exercises || []} />
    </main>
  )
}
