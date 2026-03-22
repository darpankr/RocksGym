"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, CreditCard, Dumbbell, Activity, Plus, Trash2, RefreshCw } from "lucide-react"

type Profile = {
  id: string
  full_name: string | null
  is_admin: boolean
  created_at: string
  membership_id: string | null
  membership?: Membership | null
}

type Membership = {
  id: string
  code: string
  user_id: string | null
  plan_name: string
  status: string
  created_at: string
  activated_at: string | null
  expiry_date: string | null
}

type WorkoutLog = {
  id: string
  user_id: string
  name: string
  duration_minutes: number | null
  completed_at: string
  profile?: { full_name: string | null }
}

export function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newMembership, setNewMembership] = useState({
    plan_name: "Basic",
    duration_days: 30
  })
  
  const supabase = createClient()
  
  useEffect(() => {
    fetchAllData()
  }, [])
  
  async function fetchAllData() {
    setLoading(true)
    
    // Fetch all profiles
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*, membership:memberships(*)")
      .order("created_at", { ascending: false })
    
    // Fetch all memberships
    const { data: membershipsData } = await supabase
      .from("memberships")
      .select("*")
      .order("created_at", { ascending: false })
    
    // Fetch all workout logs with user info
    const { data: workoutsData } = await supabase
      .from("workout_logs")
      .select("*, profile:profiles(full_name)")
      .order("completed_at", { ascending: false })
      .limit(50)
    
    setProfiles(profilesData || [])
    setMemberships(membershipsData || [])
    setWorkoutLogs(workoutsData || [])
    setLoading(false)
  }
  
  function generateMembershipCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = "IF-"
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }
  
  async function createMembership() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const code = generateMembershipCode()
    
    const { error } = await supabase.from("memberships").insert({
      code,
      plan_name: newMembership.plan_name,
      status: "unused",
      created_by: user.id
    })
    
    if (!error) {
      setCreateDialogOpen(false)
      fetchAllData()
    }
  }
  
  async function deleteMembership(id: string) {
    await supabase.from("memberships").delete().eq("id", id)
    fetchAllData()
  }
  
  async function toggleAdmin(userId: string, currentStatus: boolean) {
    await supabase
      .from("profiles")
      .update({ is_admin: !currentStatus })
      .eq("id", userId)
    fetchAllData()
  }
  
  const stats = {
    totalUsers: profiles.length,
    activeMembers: memberships.filter(m => m.status === "active").length,
    totalWorkouts: workoutLogs.length,
    unusedCodes: memberships.filter(m => m.status === "unused").length
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case "active": return "default"
      case "unused": return "secondary"
      case "expired": return "destructive"
      case "cancelled": return "outline"
      default: return "secondary"
    }
  }
  
  function formatDate(date: string | null) {
    if (!date) return "-"
    return new Date(date).toLocaleDateString()
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage users, memberships, and monitor activity</p>
          </div>
          <Button onClick={fetchAllData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMembers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unused Codes</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unusedCodes}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="memberships" className="space-y-6">
          <TabsList>
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="workouts">Workout Logs</TabsTrigger>
          </TabsList>
          
          {/* Memberships Tab */}
          <TabsContent value="memberships">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Membership Codes</CardTitle>
                    <CardDescription>Generate and manage membership codes</CardDescription>
                  </div>
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Generate Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Membership Code</DialogTitle>
                        <DialogDescription>
                          Create a new membership code that users can activate
                        </DialogDescription>
                      </DialogHeader>
                      <FieldGroup>
                        <Field>
                          <FieldLabel>Plan Type</FieldLabel>
                          <Select
                            value={newMembership.plan_name}
                            onValueChange={(value) => setNewMembership(prev => ({ ...prev, plan_name: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic">Basic (1 Month)</SelectItem>
                              <SelectItem value="Standard">Standard (3 Months)</SelectItem>
                              <SelectItem value="Premium">Premium (6 Months)</SelectItem>
                              <SelectItem value="Annual">Annual (12 Months)</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Button onClick={createMembership} className="w-full">
                          Generate Code
                        </Button>
                      </FieldGroup>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Activated</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberships.map((membership) => (
                      <TableRow key={membership.id}>
                        <TableCell className="font-mono font-medium">{membership.code}</TableCell>
                        <TableCell>{membership.plan_name}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(membership.status)}>
                            {membership.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {membership.user_id 
                            ? profiles.find(p => p.id === membership.user_id)?.full_name || "Unknown"
                            : "-"}
                        </TableCell>
                        <TableCell>{formatDate(membership.activated_at)}</TableCell>
                        <TableCell>{formatDate(membership.expiry_date)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMembership(membership.id)}
                            disabled={membership.status === "active"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {memberships.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No membership codes yet. Generate one to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Membership</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          {profile.full_name || "Unnamed User"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={profile.is_admin ? "default" : "secondary"}>
                            {profile.is_admin ? "Admin" : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {profile.membership ? (
                            <Badge variant={getStatusColor(profile.membership.status)}>
                              {profile.membership.plan_name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">No membership</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(profile.created_at)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAdmin(profile.id, profile.is_admin)}
                          >
                            {profile.is_admin ? "Remove Admin" : "Make Admin"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Workouts Tab */}
          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
                <CardDescription>All workout logs from members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Workout</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workoutLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.profile?.full_name || "Unknown"}
                        </TableCell>
                        <TableCell>{log.name}</TableCell>
                        <TableCell>
                          {log.duration_minutes ? `${log.duration_minutes} min` : "-"}
                        </TableCell>
                        <TableCell>{formatDate(log.completed_at)}</TableCell>
                      </TableRow>
                    ))}
                    {workoutLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No workout logs yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
