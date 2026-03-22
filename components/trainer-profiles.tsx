"use client"

import Link from "next/link"
import { ArrowLeft, Award, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Trainer {
  id: string
  name: string
  specialty: string
  bio: string
  image_url: string | null
  experience_years: number
  certifications: string[]
}

export function TrainerProfiles({ trainers }: { trainers: Trainer[] }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-balance">Our Expert Trainers</h1>
        <p className="text-muted-foreground mt-2 text-pretty max-w-2xl">
          Our certified fitness professionals are here to guide you on your journey to better health and performance.
        </p>
      </div>

      {trainers.length === 0 ? (
        <div className="text-center py-16">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No trainers available</h3>
          <p className="text-muted-foreground">Check back soon for our trainer profiles</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="overflow-hidden bg-card">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold mb-1">{trainer.name}</h3>
                    <p className="text-primary font-medium mb-2">{trainer.specialty}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {trainer.experience_years} years
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {trainer.certifications?.length || 0} certifications
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {trainer.bio}
                    </p>
                    {trainer.certifications && trainer.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {trainer.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Book a Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
