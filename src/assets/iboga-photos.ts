import freshCutRoot from "./Tabernanthe-Iboga-Photo/Fresh Cut Iboga Root.jpeg";
import ibogaByTrooper from "./Tabernanthe-Iboga-Photo/Iboga by trooper car.jpeg";
import ibogaInTruck from "./Tabernanthe-Iboga-Photo/Iboga in back of truck for investment information.jpeg";
import ibogaInfinity from "./Tabernanthe-Iboga-Photo/Iboga infinity.jpeg";
import ibogaIsCalling from "./Tabernanthe-Iboga-Photo/Iboga is calling.jpeg";
import ibogaPlantLush from "./Tabernanthe-Iboga-Photo/Iboga plant lush.jpeg";
import matureIboga from "./Tabernanthe-Iboga-Photo/Mature Iboga plant.jpeg";
import ibogaShaman from "./Tabernanthe-Iboga-Photo/Old Man Wise Iboga Shaman.jpeg";
import scrapingRootBark from "./Tabernanthe-Iboga-Photo/Scraping Root Bark.jpeg";
import sustainablePlanting from "./Tabernanthe-Iboga-Photo/Sustainable Planting of Iboga.jpeg";
import ibogaFieldsWindow from "./Tabernanthe-Iboga-Photo/View of iboga fields out window.jpeg";
import babyIboga from "./Tabernanthe-Iboga-Photo/baby iboga plants.jpeg";
import beautifulIboga from "./Tabernanthe-Iboga-Photo/beautiful picture of Iboga Plant.jpeg";

export const IBOGA_PHOTOS = [
  freshCutRoot,
  ibogaByTrooper,
  ibogaInTruck,
  ibogaInfinity,
  ibogaIsCalling,
  ibogaPlantLush,
  matureIboga,
  ibogaShaman,
  scrapingRootBark,
  sustainablePlanting,
  ibogaFieldsWindow,
  babyIboga,
  beautifulIboga,
] as const;

export function randomIbogaPhoto(): string {
  return IBOGA_PHOTOS[Math.floor(Math.random() * IBOGA_PHOTOS.length)]!;
}
