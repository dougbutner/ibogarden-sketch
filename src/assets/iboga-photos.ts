import freshCutRoot from "./Tabernanthe-Iboga-Photo/Fresh Cut Iboga Root.jpeg";
import ibogaByTrooper from "./Tabernanthe-Iboga-Photo/Iboga by trooper car.jpeg";
import ibogaInTruck from "./Tabernanthe-Iboga-Photo/Iboga in back of truck for investment information.jpeg";
import ibogaPlantLush from "./Tabernanthe-Iboga-Photo/Iboga plant lush.jpeg";
import matureIboga from "./Tabernanthe-Iboga-Photo/Mature Iboga plant.jpeg";
import ibogaShaman from "./Tabernanthe-Iboga-Photo/Old Man Wise Iboga Shaman.jpeg";
import scrapingRootBark from "./Tabernanthe-Iboga-Photo/Scraping Root Bark.jpeg";
import sustainablePlanting from "./Tabernanthe-Iboga-Photo/Sustainable Planting of Iboga.jpeg";
import ibogaFieldsWindow from "./Tabernanthe-Iboga-Photo/View of iboga fields out window.jpeg";
import babyIboga from "./Tabernanthe-Iboga-Photo/baby iboga plants.jpeg";
import beautifulIboga from "./Tabernanthe-Iboga-Photo/beautiful picture of Iboga Plant.jpeg";
import fruitingIbogaCloseup from "./Tabernanthe-Iboga-Photo/Fruiting Iboga Closeup.jpg";
import ibogaShrub from "./Tabernanthe-Iboga-Photo/Ibog SHRUb.jpg";
import ibogaInHand from "./Tabernanthe-Iboga-Photo/Iboga in hand.jpg";
import largeIbogaShrub from "./Tabernanthe-Iboga-Photo/Large Iboga Shrub.jpg";
import matureIbogaPlants from "./Tabernanthe-Iboga-Photo/MAture Iboga Plants.jpg";
import freshRoot from "./Tabernanthe-Iboga-Photo/fresh root.jpg";
import plantingIboga from "./Tabernanthe-Iboga-Photo/planting iboga.jpg";
import shavingIbogaRoot from "./Tabernanthe-Iboga-Photo/shaving iboga root.jpg";

export const IBOGA_PHOTOS = [
  freshCutRoot,
  ibogaByTrooper,
  ibogaInTruck,
  ibogaPlantLush,
  matureIboga,
  ibogaShaman,
  scrapingRootBark,
  sustainablePlanting,
  ibogaFieldsWindow,
  babyIboga,
  beautifulIboga,
  fruitingIbogaCloseup,
  ibogaShrub,
  ibogaInHand,
  largeIbogaShrub,
  matureIbogaPlants,
  freshRoot,
  plantingIboga,
  shavingIbogaRoot,
] as const;

export const PLAYLIST_COVER_PHOTOS: Record<string, string> = {
  "healing-stories": ibogaInHand,
  "about-iboga": matureIbogaPlants,
  "iboga-facilitators": ibogaShaman,
  "video-journeys": plantingIboga,
};

export function randomIbogaPhoto(): string {
  return IBOGA_PHOTOS[Math.floor(Math.random() * IBOGA_PHOTOS.length)]!;
}
