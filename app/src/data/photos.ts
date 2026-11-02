import type { ImageSource } from 'expo-image';

// Photos from Wikimedia Commons (credits: docs/design/assets/photos/CREDITS.md). Only the places and
// municipalities listed here have a picture in the app for now; everything else shows a coloured tile.
export const placePhotos: Record<string, ImageSource> = {
  'ura-e-gurit': require('../../assets/photos/ura-e-gurit.jpg'),
  'ujevarat-e-mirushes': require('../../assets/photos/ujevarat-e-mirushes.jpg'),
  gjeravica: require('../../assets/photos/gjeravica.jpg'),
  'gryka-e-rugoves': require('../../assets/photos/gryka-e-rugoves.jpg'),
  'kalaja-e-novo-berdes': require('../../assets/photos/kalaja-e-novo-berdes.jpg'),
  'shpella-e-gadimes': require('../../assets/photos/shpella-e-gadimes.jpg'),
  'xhamia-e-sinan-pashes': require('../../assets/photos/xhamia-e-sinan-pashes.jpg'),
  'kompleksi-i-lidhjes-se-prizrenit': require('../../assets/photos/kompleksi-i-lidhjes-se-prizrenit.jpg'),
  'liqeni-i-zemres': require('../../assets/photos/liqeni-i-zemres.jpg'),
};

export const municipalityPhotos: Record<string, ImageSource> = {
  prizren: require('../../assets/photos/m-prizren.jpg'),
  prishtine: require('../../assets/photos/m-prishtine.jpg'),
  peje: require('../../assets/photos/m-peje.jpg'),
  gjakove: require('../../assets/photos/m-gjakove.jpg'),
  dragash: require('../../assets/photos/m-dragash.jpg'),
};
