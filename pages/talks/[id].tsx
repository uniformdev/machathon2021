import { GetStaticPaths, GetStaticProps } from 'next';
import { Home, PageProps } from '../../components/Home';
import getConfig from 'next/config';
import { getTalks } from '@lib/api';
import { mapPageAndComponentData } from '@lib/mapPageAndComponentData';

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const data = await mapPageAndComponentData("/talks/talk", context);

  return data;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { publicRuntimeConfig } = getConfig();
  const isPreview = publicRuntimeConfig.preview;
  const talks = await getTalks(isPreview);

  return {
    paths: talks.map((talk) => `/talks/${talk.fields.slug}`),
    fallback: false,
  };
};

export default Home;
