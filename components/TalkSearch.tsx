import { useState } from 'react';
import { useUniformTracker } from '@uniformdev/optimize-tracker-react';
import { useAlgolia } from '@lib/algolia/useAlgolia';
import { IndexedProduct } from '@lib/algolia/IndexedProduct';
import { buildIntentTagFilters } from '@lib/algolia/buildIntentTagFilters';
import { IndexedTalk } from '@lib/algolia/IndexedTalk';
import { TalkListItem } from './TalkListItem';

export const TalkSearch: React.FC<any> = ({ fields, talkSearch }) => {
  const { title, itemsPerPage } = fields;

  const [keyword, setKeyword] = useState('');

  const tracker = useUniformTracker();

  const { loading, results: talks } = useAlgolia<IndexedTalk>({
    index: 'talks',
    initialResults: talkSearch ?? {
      hits: [],
      nbHits: 0,
    },
    search: async (index) => {
      return await index.search(keyword, {
        sumOrFiltersScores: true,
        getRankingInfo: true,
        hitsPerPage: itemsPerPage ?? 20,
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

          {/* <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3> */}
          <span className="mt-3 text-sm text-gray-500">
            {talks.nbHits} Sessions
          </span>

          <div className="flex flex-wrap -mx-6">
            {talks.hits &&
              talks.hits.map((session, index) => {
                return <TalkListItem key={index} {...session} buttonText="" />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCard: React.FC<IndexedProduct> = ({
  name,
  price,
  images,
}) => {
  const image = images?.standard;

  return (
    <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
      <div
        className="flex items-end justify-end h-56 w-full bg-cover"
        style={{
          backgroundImage: `url('${image}')`,
        }}
      ></div>
      <div className="px-5 py-3">
        <h3 className="text-gray-700 uppercase">{name}</h3>
        <span className="text-gray-500 mt-2">${price}</span>
      </div>
    </div>
  );
};
