  
import algoliasearch, { SearchIndex } from "algoliasearch/lite";

export const getAlgoliaIndex = (name: string): SearchIndex => {
    const searchClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
    );
    
    const index = searchClient.initIndex(name);
  
    return index;
  }