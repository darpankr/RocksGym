import { createClient } from "@/lib/supabase/server"
import { TrainerProfiles } from "@/components/trainer-profiles"

export const metadata = {
  title: "Our Trainers | IronForge Gym",
  description: "Meet our expert trainers dedicated to helping you achieve your fitness goals.",
}

export default async function TrainersPage() {
  const supabase = await createClient()
  const { data: trainers } = await supabase
    .from("trainers")
    .select("*")
    .order("experience_years", { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <TrainerProfiles trainers={trainers || []} />
    </main>
  )
}
