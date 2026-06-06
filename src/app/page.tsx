import { SiteHeader } from '@/features/landing/components/site-header'
import { Hero } from '@/features/landing/components/hero'
import { ProblemSection } from '@/features/landing/components/problem-section'
import { HowItWorks } from '@/features/landing/components/how-it-works'
import { FeaturesSection } from '@/features/landing/components/features-section'
import { AudienceSection } from '@/features/landing/components/audience-section'
import { FinalCta } from '@/features/landing/components/final-cta'
import { SiteFooter } from '@/features/landing/components/site-footer'

export default function Home(): React.JSX.Element {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <FeaturesSection />
        <AudienceSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
