import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Import event images
import artHero from '@/assets/art-hero.jpg';
import photographyHero from '@/assets/photography-hero.jpg';
import mehndiHero from '@/assets/mehndi-hero.jpg';
import rangoliHero from '@/assets/rangoli-hero.jpg';
import danceHero from '@/assets/dance-hero.jpg';
import singingHero from '@/assets/singing-hero.jpg';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const eventTypes = [
  {
    type: 'art',
    title: 'Kalakriti Art Competition',
    description: 'Express your creativity through painting, sketching, and digital art in our premier visual arts competition.',
    image: artHero
  },
  {
    type: 'photography',
    title: 'Kalakriti Photography Contest',
    description: 'Capture life through your lens with stunning portraits, landscapes, and creative photography.',
    image: photographyHero
  },
  {
    type: 'mehndi',
    title: 'Kalakriti Mehndi Championship',
    description: 'Showcase intricate mehndi designs blending traditional patterns with contemporary artistry.',
    image: mehndiHero
  },
  {
    type: 'rangoli',
    title: 'Kalakriti Rangoli Festival',
    description: 'Create vibrant floor art celebrating India\'s colorful rangoli tradition with modern innovation.',
    image: rangoliHero
  },
  {
    type: 'dance',
    title: 'Kalakriti Dance Competition',
    description: 'Express rhythm and grace through classical, folk, and contemporary dance performances.',
    image: danceHero
  },
  {
    type: 'singing',
    title: 'Kalakriti Singing Contest',
    description: 'Let your voice shine across classical, Bollywood, and contemporary musical genres.',
    image: singingHero
  }
];

export const getEventDetails = (eventType: string) => {
  return eventTypes.find(event => event.type === eventType);
};
