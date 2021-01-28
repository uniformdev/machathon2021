import { Home } from '@components/Home';
import { GetStaticProps } from 'next';
import { getStaticProps as baseStaticProps } from './[[...slug]]';

export default Home;

export const getStaticProps: GetStaticProps = (context) => {
  context.params = { slug: ['talks'] };
  return baseStaticProps(context);
};
