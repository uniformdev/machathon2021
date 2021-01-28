import React from 'react';
import ContentLoader from 'react-content-loader';
import { useAlgolia } from '@lib/algolia/useAlgolia';
import { buildIntentTagFilters } from '@lib/algolia/buildIntentTagFilters';
import { useUniformTracker } from '@uniformdev/optimize-tracker-react';
import { IndexedProduct } from '@lib/algolia/IndexedProduct';
import { getMerchImage } from './MerchImage';
import Link from 'next/link';
import { getResizedImageUrl } from '@lib/imageHelper';
import { Hit, SearchResponse } from '@algolia/client-search';
import { Entry } from 'contentful';
import { MerchListFields } from '@lib/contentful';
import { useHasIntentScores } from '@lib/hooks/tracker';

interface MerchListProps extends Entry<MerchListFields> {
  merchList: SearchResponse<any>;
}

export const MerchList: React.FC<MerchListProps> = (props) => {
  const { productCount, title, personalizedTitle } = props.fields;
  const hasIntentScores = useHasIntentScores();

  return (
    <section className="bg-white border-b py-8">
      <div className="container mx-auto flex flex-wrap pt-4 pb-12">
        <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          {hasIntentScores ? personalizedTitle : title}
        </h2>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6 mx-auto">
          {hasIntentScores ? (
            <PersonalizedList {...props} />
          ) : (
            <ListProductHits
              loading={false}
              productCount={productCount}
              hits={props.merchList.hits}
            />
          )}
        </div>
      </div>
    </section>
  );
};

const ListProductHits = ({
  hits,
  loading,
  productCount,
}: {
  hits?: Hit<any>[];
  loading: boolean;
  productCount: number;
}) => (
  <>
    {hits ? (
      hits.map((product, index) => (
        <MerchListItem key={index} {...product} isLoading={loading} />
      ))
    ) : (
      <EmptyMerchList productCount={productCount} />
    )}
  </>
);

const PersonalizedList: React.FC<MerchListProps> = ({ merchList, fields }) => {
  const { productType, productCount } = fields;
  const tracker = useUniformTracker();

  const { loading, results: products } = useAlgolia<IndexedProduct>({
    index: 'products',
    initialResults: merchList ?? {
      hits: [],
      nbHits: 0,
    },
    search: async (index) =>
      await index.search('', {
        sumOrFiltersScores: true,
        getRankingInfo: true,
        hitsPerPage: productCount,
        // 31: UniformConf Merch
        filters: `categories:${productType ?? '31'}`,
        facetFilters: [
          buildIntentTagFilters({
            visitorScore: tracker.intentScores,
          }),
        ],
      }),
    dependencies: [tracker.intentScores],
  });
  return (
    <ListProductHits
      hits={products.hits}
      loading={loading}
      productCount={productCount}
    />
  );
};

const EmptyMerchList: React.FC<any> = ({ productCount }) => {
  return Array.apply(null, Array(productCount)).map((item, index) => (
    <MerchListItem key={index} isLoading={true} />
  ));
};

const MerchItemLoader = (props) => (
  <ContentLoader
    speed={2}
    width={340}
    height={294}
    viewBox="0 0 340 296"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
    style={{ width: '100%' }}
  >
    <rect x="20" y="20" rx="3" ry="3" width="300" height="200" />
    <rect x="20" y="230" rx="3" ry="3" width="300" height="15" />
    <rect x="20" y="260" rx="3" ry="3" width="50" height="15" />
  </ContentLoader>
);

export const MerchListItem: React.FC<
  Partial<IndexedProduct> & { isLoading: boolean }
> = ({ name, images, price, isLoading, productId, categories }) => {
  const { intentScores } = useUniformTracker();
  const image = getMerchImage(images, intentScores);

  return (
    <div
      className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden transition-shadow hover:shadow-xl focus:shadow-xl"
      style={{ minHeight: '296px' }}
    >
      {isLoading ? (
        <MerchItemLoader />
      ) : (
        <Link href={`/shop/${productId}`}>
          <a className="block">
            <div className="flex flex-col items-center relative">
              <img
                loading="lazy"
                src={getResizedImageUrl(image, 350)}
                alt={`Picture of ${name}`}
                className="h-56 object-scale-down"
                width="350"
                height="230"
              />
              <div className="px-5 py-3 w-full">
                <h3 className="text-gray-700">{name}</h3>
                <span className="text-gray-500 mt-2">${price}</span>
              </div>
            </div>{' '}
          </a>
        </Link>
      )}
    </div>
  );
};
