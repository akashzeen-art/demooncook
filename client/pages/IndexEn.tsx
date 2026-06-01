import { useState } from "react";
import { NavbarEn } from "@/components/en/NavbarEn";
import { FooterEn } from "@/components/en/FooterEn";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { HeroSectionEn } from "@/components/en/sections/HeroSectionEn";
import { CategorySection } from "@/components/en/sections/CategorySection";
import { EN_VIDEOS } from "@/lib/videos-en";

export default function IndexEn() {
  const [isLoading] = useState(false);
  sessionStorage.setItem("lang", "en");

  if (isLoading) {
    return <LoadingSpinner onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="bg-black text-foreground">
      <NavbarEn />
      <HeroSectionEn />

      <div id="african">
        <CategorySection title="African"     emoji="🌍" videos={EN_VIDEOS.african}     accentColor="bg-orange-500" accentHex="#f97316" dark={true}  />
      </div>
      <div id="asian">
        <CategorySection title="Asian"       emoji="🍜" videos={EN_VIDEOS.asian}       accentColor="bg-red-500"    accentHex="#ef4444" dark={false} />
      </div>
      <div id="continental">
        <CategorySection title="Continental" emoji="🍕" videos={EN_VIDEOS.continental} accentColor="bg-yellow-500" accentHex="#eab308" dark={true}  />
      </div>
      <div id="desserts">
        <CategorySection title="Desserts"    emoji="🍰" videos={EN_VIDEOS.desserts}    accentColor="bg-pink-500"   accentHex="#ec4899" dark={false} />
      </div>
      <div id="mexican">
        <CategorySection title="Mexican"     emoji="🌮" videos={EN_VIDEOS.mexican}     accentColor="bg-green-500"  accentHex="#22c55e" dark={true}  />
      </div>
      <div id="middle-east">
        <CategorySection title="Middle East" emoji="🥙" videos={EN_VIDEOS.middle_east} accentColor="bg-amber-500"  accentHex="#f59e0b" dark={false} />
      </div>
      <div id="salads">
        <CategorySection title="Salads"      emoji="🥗" videos={EN_VIDEOS.salads}      accentColor="bg-emerald-500" accentHex="#10b981" dark={true} />
      </div>

      <FooterEn />
    </div>
  );
}
