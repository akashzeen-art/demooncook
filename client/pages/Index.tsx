import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { HeroSection } from "@/components/sections/HeroSection";
import { CategorySectionFr } from "@/components/sections/CategorySectionFr";
import { FR_VIDEOS } from "@/lib/videos-fr";

export default function Index() {
  const [isLoading, setIsLoading] = useState(!sessionStorage.getItem("preloaderShown"));

  if (isLoading) {
    return (
      <LoadingSpinner
        onComplete={() => {
          sessionStorage.setItem("preloaderShown", "1");
          setIsLoading(false);
        }}
      />
    );
  }

  return (
    <div className="bg-black text-foreground">
      <Navbar />
      <HeroSection />

      <div id="cuisine">
        <CategorySectionFr title="Cuisine"       emoji="🍳" videos={FR_VIDEOS.cuisine}     accentColor="bg-red-500"     accentHex="#ef4444" dark={true}  />
      </div>
      <div id="patisserie">
        <CategorySectionFr title="Pâtisserie"    emoji="🍰" videos={FR_VIDEOS.patisserie}  accentColor="bg-pink-500"    accentHex="#ec4899" dark={false} />
      </div>
      <div id="gastronomie">
        <CategorySectionFr title="Gastronomie"   emoji="🍽️" videos={FR_VIDEOS.gastronomie} accentColor="bg-yellow-500"  accentHex="#eab308" dark={true}  />
      </div>
      <div id="barbecue">
        <CategorySectionFr title="Barbecue"      emoji="🔥" videos={FR_VIDEOS.barbecue}    accentColor="bg-orange-500"  accentHex="#f97316" dark={false} />
      </div>
      <div id="vegetarien">
        <CategorySectionFr title="Végétarien"    emoji="🥗" videos={FR_VIDEOS.vegetarien}  accentColor="bg-green-500"   accentHex="#22c55e" dark={true}  />
      </div>
      <div id="streetfood">
        <CategorySectionFr title="Street Food"   emoji="🌮" videos={FR_VIDEOS.streetfood}  accentColor="bg-amber-500"   accentHex="#f59e0b" dark={false} />
      </div>
      <div id="voyage">
        <CategorySectionFr title="Voyage & Saveurs" emoji="✈️" videos={FR_VIDEOS.voyage}   accentColor="bg-blue-500"    accentHex="#3b82f6" dark={true}  />
      </div>

      <Footer />
    </div>
  );
}
