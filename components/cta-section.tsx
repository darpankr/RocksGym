import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-primary/10 border border-primary/20 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative z-10 px-6 py-16 sm:px-16 sm:py-24 text-center">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ready to Start Your
              <br />
              <span className="text-primary">Transformation?</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of members who have already transformed their lives. 
              Start your 7-day free trial today and experience the IronForge difference.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View Pricing
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
