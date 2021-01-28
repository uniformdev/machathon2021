import { getTickets } from '@lib/bigcommerce/api/tickets';
import { fetchSingleProduct } from '@lib/bigcommerce/api/products';
import { GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { PageFields } from '@lib/contentful';
import { getTalkBySlug } from '@lib/api';
import { getAlgoliaIndex } from '@lib/algolia/getAlgoliaIndex';
import { buildIntentTagFilters } from '@lib/algolia/buildIntentTagFilters';
import { Entry } from 'contentful';

export interface ComponentDataProviderOptions {
  page: PageFields;
  componentData: Entry<any>;
  isPreview: boolean;
  ssgContext: GetStaticPropsContext<ParsedUrlQuery>;
}

export type ComponentDataProvider<TResult extends Object> = (
  options: ComponentDataProviderOptions
) => Promise<TResult>;

const componentDataProviders: Record<string, ComponentDataProvider<Object>> = {
  ticketsComponent: ({ isPreview }) => getTickets(isPreview),
  talkDetail: async ({ isPreview, ssgContext }) => {
    return getTalkBySlug(isPreview, ssgContext.params.id as string) ?? null;
  },
  // productDetail: (preview, { productId }) => {
  //   return fetchSingleProduct(productId);
  // },
  productDetail: ({ ssgContext }) => fetchSingleProduct(ssgContext.params.id),
  productSearch: async ({ componentData }) => {
    const categoriesParsed = (componentData.fields.categories as string)
      .split(',')
      .map((cat) => `categories:${cat}`)
      .join(' OR ');

    return await getAlgoliaIndex('products').search('', {
      sumOrFiltersScores: true,
      getRankingInfo: true,
      hitsPerPage: componentData.fields.productsPerPage,
      filters: categoriesParsed,
    });
  },
  merchList: async ({ componentData }) => {
    return await getAlgoliaIndex('products').search('', {
      sumOrFiltersScores: true,
      getRankingInfo: true,
      hitsPerPage: componentData.fields.productCount,
      // 31: UniformConf Merch
      filters: `categories:${componentData.fields.productType ?? '31'}`,
    });
  },
  talkSearch: async ({ componentData }) => {
    return await getAlgoliaIndex('talks').search('', {
      sumOrFiltersScores: true,
      getRankingInfo: true,
      hitsPerPage: componentData?.fields?.itemsPerPage ?? 20,
    });
  },
  talksList: async ({ componentData }) => {
    const tags = Object.keys(componentData.fields.categoryFilter?.intents ?? {})
      .map((intent) => `intentTag:${intent}`)
      .join(' AND ');

    return await getAlgoliaIndex('talks').search('', {
      sumOrFiltersScores: true,
      getRankingInfo: true,
      hitsPerPage: componentData.fields.count,
      filters: tags,
    });
  },
};

export default componentDataProviders;
