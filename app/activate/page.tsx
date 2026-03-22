import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ActivateMembership } from "@/components/activate-membership"

export default async function ActivatePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  // Check if user already has active membership
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, membership:memberships(*)")
    .eq("id", user.id)
    .single()
  
  const hasActiveMembership = profile?.membership?.status === "active"
  
  return (
    <ActivateMembership 
      hasActiveMembership={hasActiveMembership}
      currentMembership={profile?.membership}
    />
  )
}
