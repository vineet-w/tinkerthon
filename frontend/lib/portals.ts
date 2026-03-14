export interface Portal {
  title: string
  sectionId: string
  subtitle: string
  quote: string
  image: string
}

export const PORTALS: Portal[] = [
  {
    title: "Entry Portal",
    sectionId: "hero",
    subtitle: "RETURN TO ORIGIN",
    quote: "Wake up, Neo. The Matrix has you.",
    image: "/assets/portals/Entry_Portal.png",
  },
  {
    title: "The Architect",
    sectionId: "about",
    subtitle: "SYSTEM INTEL",
    quote: "There are levels of survival we are prepared to accept.",
    image: "/assets/portals/The_Architect.png",
  },
  {
    title: "The Construct",
    sectionId: "domains",
    subtitle: "EXPLORE DOMAINS",
    quote: "You have to let it all go, Neo. Fear, doubt, and disbelief.",
    image: "/assets/portals/The_Construct.png",
  },
  {
    title: "The Descent",
    sectionId: "timeline",
    subtitle: "EVENT TIMELINE",
    quote: "Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.",
    image: "/assets/portals/The_Descent.png",
  },
  {
    title: "The Allies",
    sectionId: "sponsors",
    subtitle: "OUR SPONSORS",
    quote: "I can only show you the door. You\u2019re the one that has to walk through it.",
    image: "/assets/portals/The_Allies.png",
  },
  {
    title: "The Exit",
    sectionId: "registration",
    subtitle: "REGISTER NOW",
    quote: "There is a difference between knowing the path and walking the path.",
    image: "/assets/portals/The_Exit.png",
  },
]