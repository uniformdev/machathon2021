import { SearchResponse } from "@algolia/client-search";
import { SearchIndex } from "algoliasearch/lite";
import { useEffect, useState } from "react";
import { getAlgoliaIndex } from "./getAlgoliaIndex";

type SearchResponseSubset<T> = Pick<
  SearchResponse<T>,
  "hits" | "facets" | "nbHits"
>;

export interface UseAlgoliaOptions<TResult> {
  index: string;
  search: (index: SearchIndex) => Promise<SearchResponseSubset<TResult>>;
  initialResults: SearchResponseSubset<TResult>;
  dependencies?: any[];
}

export interface UseAlgoliaResult<TResult> {
  loading: boolean;
  results: SearchResponseSubset<TResult>;
}

export const useAlgolia = <TResult>({
  index,
  search,
  initialResults,
  dependencies = [],
}: UseAlgoliaOptions<TResult>): UseAlgoliaResult<TResult> => {
  const [results, setResults] = useState(initialResults);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function runEffect() {
      setLoading(true);
      try {
        const indexRef = getAlgoliaIndex(index);

        setResults(await search(indexRef));
      } finally {
        setLoading(false);
      }
    }

    runEffect();
  }, [index, ...dependencies]);

  return {
    loading,
    results,
  };
};
