import { createClient, Entry } from 'contentful';
import { PageFields, TalkFields } from './contentful';

if (!process.env.CONTENTFUL_SPACE_ID) {
  throw new Error('CONTENTFUL_SPACE_ID env not set.');
}

if (!process.env.CONTENTFUL_CDA_ACCESS_TOKEN) {
  throw new Error('CONTENTFUL_CDA_ACCESS_TOKEN env not set.');
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_CDA_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT ? process.env.CONTENTFUL_ENVIRONMENT : 'master',
});

const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_CPA_ACCESS_TOKEN,
  host: 'preview.contentful.com',
  environment: process.env.CONTENTFUL_ENVIRONMENT ? process.env.CONTENTFUL_ENVIRONMENT : 'master',
});

const getClient = (preview) => (preview ? previewClient : client);

const parsePage = (entry?: Entry<any>) => {
  if (!entry) {
    return null;
  }

  const { fields } = entry;

  return {
    id: entry.sys.id,
    ...fields,
  };
};

export const getPageBySlug = async (preview: boolean, slug: string): Promise<PageFields | undefined> => {
  const entries = await getClient(preview).getEntries({
    content_type: 'page',
    'fields.slug': slug,
    include: 2,
  });

  const [first] = entries.items;
  return parsePage(first);
};

export const getTalkBySlug = async (preview: boolean, slug: string): Promise<Entry<TalkFields> | undefined> => {
  const entries = await getClient(preview).getEntries({
    content_type: 'talk',
    'fields.slug': slug,
    include: 2,
  });

  const [first] = entries.items;
  return first;
};

export const getEntriesByContentType = async <T>(preview: boolean, type: string): Promise<Entry<T>[]> => {
  const entries = await getClient(preview).getEntries({
    content_type: type,
  });

  return entries.items as Entry<T>[];
};

export const getTalks = async (preview: boolean): Promise<Entry<TalkFields>[]> => {
  return await getEntriesByContentType(preview, 'talk');
};