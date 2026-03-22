import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Dashboard } from "@/components/dashboard"

export const metadata = {
  title: "Tracker | IronForge Gym",
  description: "Track your workouts, view progress, and manage your fitness journey.",
}

export default async function TrackerPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // First check if user has active membership
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, membership:memberships(*)")
    .eq("id", user.id)
    .single()

  // Redirect to activate page if no active membership
  if (!profile?.membership || profile.membership.status !== "active") {
    redirect("/activate")
  }

  // Check if membership is expired
  if (profile.membership.expiry_date) {
    const expiryDate = new Date(profile.membership.expiry_date)
    if (expiryDate < new Date()) {
      // Update membership status to expired
      await supabase
        .from("memberships")
        .update({ status: "expired" })
        .eq("id", profile.membership.id)
      redirect("/activate")
    }
  }

  const [workoutLogsResult, exercisesResult] = await Promise.all([
    supabase
      .from("workout_logs")
      .select(`
        *,
        exercise_logs (
          *,
          exercise:exercises (name, muscle_group)
        )
      `)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(10),
    supabase.from("exercises").select("*").order("name"),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Dashboard 
        user={user}
        profile={profileResult.data}
        workoutLogs={workoutLogsResult.data || []}
        exercises={exercisesResult.data || []}
      />
    </main>
  )
}
