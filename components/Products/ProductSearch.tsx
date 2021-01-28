import { useState } from 'react';
import { useUniformTracker } from '@uniformdev/optimize-tracker-react';
import { useAlgolia } from '@lib/algolia/useAlgolia';
import { IndexedProduct } from '@lib/algolia/IndexedProduct';
import { buildIntentTagFilters } from '@lib/algolia/buildIntentTagFilters';
import { MerchListItem } from '@components/MerchList';

export const ProductSearch: React.FC<any> = ({ fields, products }) => {
  const { title, productsPerPage, categories } = fields;

  const [keyword, setKeyword] = useState('');

  const tracker = useUniformTracker();

  const { loading, results: liveProducts } = useAlgolia<IndexedProduct>({
    index: 'products',
    initialResults: products ?? {
      hits: [],
      nbHits: 0,
    },
    search: async (index) => {
      const categoriesParsed = (categories as string)
        .split(',')
        .map((cat) => `categories:${cat}`)
        .join(' OR ');

      return await index.search(keyword, {
        sumOrFiltersScores: true,
        getRankingInfo: true,
        hitsPerPage: productsPerPage,
        filters: categoriesParsed,
        facetFilters: [
          buildIntentTagFilters({
            visitorScore: tracker.intentScores,
          }),
        ],
      });
    },
    dependencies: [tracker.intentScores, keyword],
  });

  return (
    <div className="bg-white">
      <div className="py-8">
        <div className="container mx-auto px-6">
          <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
            {title}
          </h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
          </div>

          <div className="relative mt-6 max-w-lg mx-auto">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
            <label className="sr-only" htmlFor="search">Keyword search</label>
            <input
              id="search"
              type="text"
              value={keyword}
              onChange={(v) => setKeyword(v.currentTarget.value)}
              placeholder="Keyword search"
              className="w-full border rounded-md pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:shadow-outline text-gray-600"
            />
          </div>
          {/* use this to add test color choice attributes to the tracker <Colorizr /> */}
          {/* <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3> */}
          <span className="mt-3 text-sm text-gray-500">
            {liveProducts.nbHits} Products
          </span>
          {/* Product search results start */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            {liveProducts.hits &&
              liveProducts.hits.map((product, index) => {
                return <MerchListItem key={index} {...product} isLoading={false} />;
              })}
          </div>
          {/* Product search results end */}
        </div>
      </div>
    </div>
  );
};
