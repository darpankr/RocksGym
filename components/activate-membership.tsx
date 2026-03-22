"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { CreditCard, CheckCircle, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"

type Membership = {
  id: string
  code: string
  plan_name: string
  status: string
  activated_at: string | null
  expiry_date: string | null
}

type Props = {
  hasActiveMembership: boolean
  currentMembership: Membership | null
}

const PLAN_DURATIONS: Record<string, number> = {
  "Basic": 30,
  "Standard": 90,
  "Premium": 180,
  "Annual": 365
}

export function ActivateMembership({ hasActiveMembership, currentMembership }: Props) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()
  
  async function handleActivate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formattedCode = code.trim().toUpperCase()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("You must be logged in to activate a membership")
      setLoading(false)
      return
    }
    
    // Find the membership code
    const { data: membership, error: fetchError } = await supabase
      .from("memberships")
      .select("*")
      .eq("code", formattedCode)
      .single()
    
    if (fetchError || !membership) {
      setError("Invalid membership code. Please check and try again.")
      setLoading(false)
      return
    }
    
    if (membership.status !== "unused") {
      setError("This membership code has already been used or expired.")
      setLoading(false)
      return
    }
    
    // Calculate expiry date
    const durationDays = PLAN_DURATIONS[membership.plan_name] || 30
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + durationDays)
    
    // Activate the membership
    const { error: updateError } = await supabase
      .from("memberships")
      .update({
        user_id: user.id,
        status: "active",
        activated_at: new Date().toISOString(),
        expiry_date: expiryDate.toISOString()
      })
      .eq("id", membership.id)
    
    if (updateError) {
      setError("Failed to activate membership. Please try again.")
      setLoading(false)
      return
    }
    
    // Link membership to profile
    await supabase
      .from("profiles")
      .update({ membership_id: membership.id })
      .eq("id", user.id)
    
    setSuccess(true)
    setLoading(false)
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push("/tracker")
      router.refresh()
    }, 2000)
  }
  
  function formatDate(date: string | null) {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }
  
  function getDaysRemaining(expiryDate: string | null) {
    if (!expiryDate) return 0
    const expiry = new Date(expiryDate)
    const now = new Date()
    const diff = expiry.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Membership Activation</CardTitle>
          <CardDescription>
            {hasActiveMembership 
              ? "Your current membership status"
              : "Enter your membership code to unlock all features"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasActiveMembership && currentMembership ? (
            <div className="space-y-6">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Active Membership</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <Badge>{currentMembership.plan_name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Code</span>
                    <span className="font-mono text-sm">{currentMembership.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activated</span>
                    <span>{formatDate(currentMembership.activated_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires</span>
                    <span>{formatDate(currentMembership.expiry_date)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-muted-foreground">Days Remaining</span>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {getDaysRemaining(currentMembership.expiry_date)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Link href="/tracker">
                  <Button className="w-full">Go to Tracker</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">Back to Home</Button>
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Membership Activated!
              </h3>
              <p className="text-muted-foreground">
                Redirecting you to the tracker...
              </p>
            </div>
          ) : (
            <form onSubmit={handleActivate} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <FieldGroup>
                <Field>
                  <FieldLabel>Membership Code</FieldLabel>
                  <Input
                    type="text"
                    placeholder="IF-XXXXXXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-center text-lg tracking-wider"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the code provided by your gym administrator
                  </p>
                </Field>
              </FieldGroup>
              
              <Button type="submit" className="w-full" disabled={loading || !code.trim()}>
                {loading ? "Activating..." : "Activate Membership"}
              </Button>
              
              <div className="text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Back to Home
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
