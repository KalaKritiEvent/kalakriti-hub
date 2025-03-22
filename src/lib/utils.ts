
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function generateContestantId(): string {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `KH${timestamp}${random}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getEventDetails(eventType: string) {
  const events = {
    art: {
      title: "Kalakriti Art Event",
      description: "Showcase your artistic skills and creativity through various mediums including paintings, sketches, digital art, and more.",
      fullDescription: "The Kalakriti Art Event invites artists of all levels to express their creativity through various mediums. Whether you work with oils, acrylics, watercolors, or digital tools, this is your opportunity to showcase your unique artistic vision. Participants can submit multiple artworks and compete for recognition in different categories.",
      image: "/images/event-art.jpg",
      pricing: [
        { artworks: 1, price: 299 },
        { artworks: 2, price: 499 },
        { artworks: 3, price: 699 }
      ],
      guidelines: [
        "Artwork must be original and created within the last 12 months",
        "Digital submissions should be high-resolution JPEG/PNG files",
        "Physical artwork photos should be well-lit and clear",
        "Each artwork must include a title and brief description",
        "Content should be appropriate for general audiences"
      ]
    },
    photography: {
      title: "Kalakriti Photography Event",
      description: "Capture moments, tell stories, and showcase your photography skills across various categories and themes.",
      fullDescription: "The Kalakriti Photography Event celebrates the art of visual storytelling through the lens. Photographers of all skill levels can participate by submitting their best shots in categories including Portrait, Landscape, Street, Wildlife, and Conceptual. Our panel of experts will evaluate entries based on composition, lighting, subject matter, and storytelling.",
      image: "/images/event-photography.jpg",
      pricing: [
        { artworks: 1, price: 249 },
        { artworks: 2, price: 399 },
        { artworks: 3, price: 549 }
      ],
      guidelines: [
        "Photos must be taken within the last 12 months",
        "Basic editing is allowed, but heavily manipulated images should be submitted in the Digital Art category",
        "Minimum resolution of 3000px on the longest side",
        "Include camera and lens information if available",
        "Model releases may be required for recognizable people"
      ]
    },
    mehndi: {
      title: "Kalakriti Mehndi Event",
      description: "Demonstrate your mehndi application skills with intricate designs that blend traditional and contemporary styles.",
      fullDescription: "The Kalakriti Mehndi Event showcases the ancient art of henna application. Participants will demonstrate their skill in creating intricate patterns that may draw from traditional motifs or incorporate innovative designs. This competition celebrates the rich cultural heritage of mehndi while encouraging creative expression and technical excellence.",
      image: "/images/event-mehndi.jpg",
      pricing: [
        { artworks: 1, price: 249 },
        { artworks: 2, price: 399 },
        { artworks: 3, price: 549 }
      ],
      guidelines: [
        "Submit clear photographs of completed mehndi designs",
        "Include both close-up and full design images",
        "Natural henna must be used (no black henna or harmful chemicals)",
        "Provide information about the inspiration behind the design",
        "Self-application and application on models are both acceptable"
      ]
    },
    rangoli: {
      title: "Kalakriti Rangoli Event",
      description: "Create vibrant and intricate rangoli designs using traditional or innovative techniques and materials.",
      fullDescription: "The Kalakriti Rangoli Event celebrates the traditional Indian art form of creating colorful designs on the floor. Participants will showcase their skill in making intricate patterns using materials like colored powders, flower petals, rice, or other innovative materials. This competition honors the cultural significance of rangoli while encouraging creativity and precision.",
      image: "/images/event-rangoli.jpg",
      pricing: [
        { artworks: 1, price: 249 },
        { artworks: 2, price: 399 },
        { artworks: 3, price: 549 }
      ],
      guidelines: [
        "Submit photographs showing the complete rangoli design",
        "Include progress photos if possible",
        "Specify materials used in the creation",
        "Provide the approximate dimensions of the design",
        "Traditional and contemporary designs are both welcome"
      ]
    },
    dance: {
      title: "Kalakriti Dance Event",
      description: "Express yourself through movement and showcase your dance talents across various styles from classical to contemporary.",
      fullDescription: "The Kalakriti Dance Event invites dancers to express themselves through movement and rhythm. Participants can showcase their talents in various styles including Classical Indian, Folk, Contemporary, Hip Hop, and Fusion. Solo, duo, and group performances are welcome. Our judges will evaluate technique, expression, choreography, and overall presentation.",
      image: "/images/event-dance.jpg",
      pricing: [
        { artworks: 1, price: 349 },
        { artworks: 2, price: 599 },
        { artworks: 3, price: 799 }
      ],
      guidelines: [
        "Submit a video recording of your performance (2-5 minutes)",
        "Ensure good lighting and clear visibility of movements",
        "Music should be clearly audible",
        "Provide information about the dance style and concept",
        "Appropriate costumes enhancing the performance are recommended"
      ]
    },
    singing: {
      title: "Kalakriti Singing Event",
      description: "Showcase your vocal talent across different genres and styles in this premier singing competition.",
      fullDescription: "The Kalakriti Singing Event welcomes vocalists of all genres to showcase their musical talent. Whether you specialize in Classical, Bollywood, Western, Folk, or any other style, this competition provides a platform to demonstrate your vocal prowess. Participants will be judged on technical skill, tonal quality, expression, and overall performance.",
      image: "/images/event-singing.jpg",
      pricing: [
        { artworks: 1, price: 299 },
        { artworks: 2, price: 499 },
        { artworks: 3, price: 699 }
      ],
      guidelines: [
        "Submit an audio or video recording of your performance (2-4 minutes)",
        "Cover songs and original compositions are both acceptable",
        "Ensure clear audio quality with minimal background noise",
        "Basic accompaniment is allowed but focus should be on vocals",
        "Provide information about the song selection and language"
      ]
    }
  };

  return events[eventType as keyof typeof events];
}

export const eventTypes = [
  { 
    type: "art", 
    title: "Kalakriti Art Event",
    description: "Showcase your artistic skills and creativity through various mediums including paintings, sketches, digital art, and more.",
    image: "/images/event-art.jpg" 
  },
  { 
    type: "photography", 
    title: "Kalakriti Photography Event",
    description: "Capture moments, tell stories, and showcase your photography skills across various categories and themes.",
    image: "/images/event-photography.jpg" 
  },
  { 
    type: "mehndi", 
    title: "Kalakriti Mehndi Event",
    description: "Demonstrate your mehndi application skills with intricate designs that blend traditional and contemporary styles.",
    image: "/images/event-mehndi.jpg" 
  },
  { 
    type: "rangoli", 
    title: "Kalakriti Rangoli Event",
    description: "Create vibrant and intricate rangoli designs using traditional or innovative techniques and materials.",
    image: "/images/event-rangoli.jpg" 
  },
  { 
    type: "dance", 
    title: "Kalakriti Dance Event",
    description: "Express yourself through movement and showcase your dance talents across various styles from classical to contemporary.",
    image: "/images/event-dance.jpg" 
  },
  { 
    type: "singing", 
    title: "Kalakriti Singing Event",
    description: "Showcase your vocal talent across different genres and styles in this premier singing competition.",
    image: "/images/event-singing.jpg" 
  }
];
