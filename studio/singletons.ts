// Central list of singleton document types — types that should only ever have
// one instance (Hero, About Me, Site Settings…). Used by structure.ts to pin
// them in the sidebar, and by sanity.config.ts to stop anyone from creating a
// second one or deleting the only one.
export const SINGLETON_TYPES: {id: string; title: string}[] = [
  {id: 'siteSettings', title: 'Site Settings'},
  {id: 'hero', title: 'Hero Section'},
  {id: 'socialProof', title: 'Social Proof Stats'},
  {id: 'aboutMe', title: 'About Me Section'},
  {id: 'mapSection', title: 'Fishing Spots Map'},
  {id: 'shopSettings', title: 'Shop Settings'},
]

export const singletonTypeNames = new Set(SINGLETON_TYPES.map((s) => s.id))
