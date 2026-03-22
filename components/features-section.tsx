import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Users, Calendar, TrendingUp, Target, Zap } from "lucide-react"

const features = [
  {
    icon: Dumbbell,
    title: "Exercise Library",
    description: "Access 500+ exercises with detailed instructions, video demos, and muscle targeting information."
  },
  {
    icon: Calendar,
    title: "Workout Plans",
    description: "Choose from pre-built programs or create custom routines tailored to your specific goals."
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visualize your journey with detailed charts, personal records, and achievement milestones."
  },
  {
    icon: Users,
    title: "Expert Trainers",
    description: "Work with certified professionals who provide personalized guidance and motivation."
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set and track specific fitness goals with smart recommendations and progress insights."
  },
  {
    icon: Zap,
    title: "AI Coaching",
    description: "Get real-time form feedback and intelligent workout adjustments based on your performance."
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Everything You Need to{" "}
            <span className="text-primary">Succeed</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform combines cutting-edge technology with proven training 
            methodologies to deliver results that last.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-border hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
