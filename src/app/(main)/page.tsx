import HeroSection from '@/components/home/hero-section'
import CategorySection from '@/components/home/category-section'
import FeaturedListings from '@/components/home/featured-listings'
import AboutSection from '@/components/home/about-section'
import TestimonialSection from '@/components/home/testimonial-section'
import BecomeHostSection from '@/components/home/become-host-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedListings />
      <AboutSection />
      <TestimonialSection />
      <BecomeHostSection />
    </>
  )
}