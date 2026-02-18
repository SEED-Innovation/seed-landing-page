import Hero from '@/components/landing/Hero';
import App from '@/components/landing/App';
import Courts from '@/components/landing/Courts';
import Techs from '@/components/landing/Techs';
import TagSlider from '@/components/landing/TagSlider';
import Partners from '@/components/landing/Partners';


export default function LandingPage() {
  return (
    <div className="relative w-full">
      <Hero />
      <App />
      <Techs/>
      <Courts/>
      <TagSlider/>
      <Partners/>
    </div>
  );
}