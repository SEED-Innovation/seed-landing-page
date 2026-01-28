import Hero from '@/components/landing/Hero';
import App from '@/components/landing/App';
import Courts from '@/components/landing/Courts';
import Techs from '@/components/landing/Techs';
import TagSlider from '@/components/landing/TagSlider';
// Import other sections as you build them
// import DiscoverCourts from '@/components/landing/DiscoverCourts';
// import Features from '@/components/landing/Features';

export default function LandingPage() {
  return (
    <div className="relative w-full">
      {/* We wrap everything in a flex column. 
          The Hero is first, followed by the floating info bar 
          (which is positioned relatively inside the Hero component).
      */}
      <Hero />

      <section className="relative z-20 bg-white">
        {/* This is the "All Courts in Your Pocket" section.
            The negative margin or padding ensures it sits nicely 
            below the Hero's floating black bar.
        */}
        <App />

        {/* Add your upcoming sections here in order:
            <DiscoverCourts />
            <Features /> 
        */}
        <Techs/>
        <Courts/>
        <TagSlider/>
      </section>

      {/* Footer is usually in layout.tsx, but can be added here if it's page-specific */}
    </div>
  );
}