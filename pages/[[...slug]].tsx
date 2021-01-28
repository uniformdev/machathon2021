import { GetStaticPaths, GetStaticProps } from 'next';
import { Home, PageProps } from '../components/Home';
import { mapPageAndComponentData } from '@lib/mapPageAndComponentData';

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  let slug = context.params?.slug
    ? `/${(context.params.slug as string[]).join('/')}`
    : '/';

  if (slug === '/index') {
    slug = '/';
  }

  return await mapPageAndComponentData(slug, context);
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      '/',
      '/developers',
      '/marketers',
      '/registration',
      '/shop',
      '/cart',
    ],
    fallback: false,
  };
};

export default Home;
