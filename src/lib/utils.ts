
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const eventTypes = [
  {
    type: 'art',
    title: 'Kalakriti Art Competition',
    description: 'Express your creativity through painting, sketching, and digital art in our premier visual arts competition.',
    image: '/images/art-event.jpg'
  },
  {
    type: 'photography',
    title: 'Kalakriti Photography Contest',
    description: 'Capture life through your lens with stunning portraits, landscapes, and creative photography.',
    image: '/images/photography-event.jpg'
  },
  {
    type: 'mehndi',
    title: 'Kalakriti Mehndi Championship',
    description: 'Showcase intricate mehndi designs blending traditional patterns with contemporary artistry.',
    image: '/images/mehndi-event.jpg'
  },
  {
    type: 'rangoli',
    title: 'Kalakriti Rangoli Festival',
    description: 'Create vibrant floor art celebrating India\'s colorful rangoli tradition with modern innovation.',
    image: '/images/rangoli-event.jpg'
  },
  {
    type: 'dance',
    title: 'Kalakriti Dance Competition',
    description: 'Express rhythm and grace through classical, folk, and contemporary dance performances.',
    image: '/images/dance-event.jpg'
  },
  {
    type: 'singing',
    title: 'Kalakriti Singing Contest',
    description: 'Let your voice shine across classical, Bollywood, and contemporary musical genres.',
    image: '/images/singing-event.jpg'
  }
];

export const getEventDetails = (eventType: string) => {
  return eventTypes.find(event => event.type === eventType);
};
