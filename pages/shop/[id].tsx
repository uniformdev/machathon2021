import { GetStaticPaths, GetStaticProps } from 'next';
import { ProductDetailPage } from '@components/Products/ProductDetailPage';
import { mapPageAndComponentData } from '@lib/mapPageAndComponentData';

export const getStaticProps: GetStaticProps<any> = async (context) => {    
  return await mapPageAndComponentData(`/product`, context);  
};

export const getStaticPaths: GetStaticPaths = async () => {      
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default ProductDetailPage;
