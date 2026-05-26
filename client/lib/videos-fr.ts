import { VIDEOS } from "./videos";
import type { FrVideo } from "@/components/sections/CategorySectionFr";

export const FR_VIDEOS: Record<string, FrVideo[]> = {
  cuisine: [
    { id: 1,  title: "Saveurs du Monde",        image: "/COOKING/i1.jpg",  video: VIDEOS[1],  category: "Cuisine · Voyage" },
    { id: 2,  title: "Le Grand Chef",            image: "/COOKING/i2.jpg",  video: VIDEOS[2],  category: "Compétition" },
    { id: 3,  title: "Recettes Secrètes",        image: "/COOKING/i3.jpg",  video: VIDEOS[3],  category: "Gastronomie" },
    { id: 4,  title: "Festin Sauvage",           image: "/COOKING/i4.jpg",  video: VIDEOS[4],  category: "Aventure" },
    { id: 11, title: "Tendances du Moment",      image: "/COOKING/i11.jpg", video: VIDEOS[11], category: "Cuisine" },
    { id: 12, title: "Cuisine Fusion",           image: "/COOKING/i12.jpg", video: VIDEOS[12], category: "Fusion" },
  ],
  patisserie: [
    { id: 5,  title: "L'Art de la Pâtisserie",  image: "/COOKING/i5.jpg",  video: VIDEOS[5],  category: "Pâtisserie" },
    { id: 13, title: "Douceurs de Paris",        image: "/COOKING/i13.jpg", video: VIDEOS[13], category: "Pâtisserie" },
    { id: 22, title: "Macarons & Merveilles",    image: "/COOKING/i22.jpg", video: VIDEOS[22], category: "Desserts" },
    { id: 26, title: "Gâteaux d'Exception",      image: "/COOKING/i26.jpg", video: VIDEOS[26], category: "Pâtisserie Fine" },
    { id: 30, title: "Chocolat & Passion",       image: "/COOKING/i30.jpg", video: VIDEOS[30], category: "Chocolaterie" },
  ],
  gastronomie: [
    { id: 6,  title: "Épices & Arômes",          image: "/COOKING/i6.jpg",  video: VIDEOS[6],  category: "Gastronomie" },
    { id: 7,  title: "Chef en Ville",            image: "/COOKING/i7.jpg",  video: VIDEOS[7],  category: "Restaurant" },
    { id: 17, title: "Tables Étoilées",          image: "/COOKING/i17.jpg", video: VIDEOS[17], category: "Haute Cuisine" },
    { id: 23, title: "Gastronomie Française",    image: "/COOKING/i23.jpg", video: VIDEOS[23], category: "Gastronomie" },
    { id: 31, title: "Accords Mets & Vins",      image: "/COOKING/i31.jpg", video: VIDEOS[31], category: "Sommellerie" },
  ],
  barbecue: [
    { id: 8,  title: "Grillades & Flammes",      image: "/COOKING/i8.jpg",  video: VIDEOS[8],  category: "Barbecue" },
    { id: 14, title: "Maître du Grill",          image: "/COOKING/i14.jpg", video: VIDEOS[14], category: "Barbecue" },
    { id: 24, title: "Fumé & Grillé",            image: "/COOKING/i24.jpg", video: VIDEOS[24], category: "Grillade" },
    { id: 32, title: "Viandes du Monde",         image: "/COOKING/i32.jpg", video: VIDEOS[32], category: "Viande" },
    { id: 33, title: "Brochettes Royales",       image: "/COOKING/i33.jpg", video: VIDEOS[33], category: "Barbecue" },
  ],
  vegetarien: [
    { id: 9,  title: "Jardins Gourmands",        image: "/COOKING/i9.jpg",  video: VIDEOS[9],  category: "Végétarien" },
    { id: 25, title: "Légumes en Fête",          image: "/COOKING/i25.jpg", video: VIDEOS[25], category: "Végétarien" },
    { id: 34, title: "Cuisine Verte",            image: "/COOKING/i34.jpg", video: VIDEOS[34], category: "Vegan" },
    { id: 35, title: "Salades Créatives",        image: "/COOKING/i35.jpg", video: VIDEOS[35], category: "Salade" },
    { id: 36, title: "Smoothies & Détox",        image: "/COOKING/i36.jpg", video: VIDEOS[36], category: "Santé" },
  ],
  streetfood: [
    { id: 10, title: "Street Food du Monde",     image: "/COOKING/i10.jpg", video: VIDEOS[10], category: "Street Food" },
    { id: 27, title: "Tacos & Wraps",            image: "/COOKING/i27.jpg", video: VIDEOS[27], category: "Street Food" },
    { id: 37, title: "Burgers Gourmet",          image: "/COOKING/i37.jpg", video: VIDEOS[37], category: "Fast Gourmet" },
    { id: 38, title: "Snacks du Monde",          image: "/COOKING/i38.jpg", video: VIDEOS[38], category: "Snack" },
    { id: 39, title: "Food Trucks",              image: "/COOKING/i39.jpg", video: VIDEOS[39], category: "Street Food" },
  ],
  voyage: [
    { id: 15, title: "Saveurs d'Asie",           image: "/COOKING/i15.jpg", video: VIDEOS[15], category: "Voyage · Asie" },
    { id: 16, title: "Cuisine Africaine",        image: "/COOKING/i16.jpg", video: VIDEOS[16], category: "Voyage · Afrique" },
    { id: 28, title: "Épices d'Orient",          image: "/COOKING/i28.jpg", video: VIDEOS[28], category: "Voyage · Orient" },
    { id: 40, title: "Saveurs d'Amérique",       image: "/COOKING/i40.jpg", video: VIDEOS[40], category: "Voyage · Amériques" },
    { id: 41, title: "Cuisine Méditerranéenne",  image: "/COOKING/i41.jpg", video: VIDEOS[41], category: "Voyage · Méditerranée" },
  ],
};
