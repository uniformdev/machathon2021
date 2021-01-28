import { GraphQLClient } from 'graphql-request';
import { allProductsQuery } from '@bcq/products';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import { fetchCategoryTree } from './categories';

// REST
export async function fetchAllProducts() {
  return fetchProducts(20, undefined);
}

// category id 23 = shop all category
export async function fetchAllByCategory() {
  return fetchProductCategory();
}

export async function fetchProductCategory(categoryId = '23') {
  const { storeApiEndpoint, storeApiToken } = publicRuntimeConfig || {};
  const includeOptions = 'images,variants';
  if (!storeApiEndpoint) {
    throw 'BIGCOMMERCE_STOREFRONT_API_URL not specified';
  }
  if (!storeApiToken) {
    throw 'BIGCOMMERCE_STOREFRONT_API_TOKEN not specified';
  }
  try {
    const url = `${storeApiEndpoint}/v3/catalog/products?categories:in=${categoryId}&include=${includeOptions}`;
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': storeApiToken,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.warn(error.msg);
  }
}

export async function fetchGroupedByCategory() {
    const categoryTree = await fetchCategoryTree();
    const allProducts = await fetchProductCategory();
    return allProducts.reduce((result, item) => {
        item.categories.forEach(categoryId => {
          if(!result.hasOwnProperty(categoryId)) {
            result[categoryId] = {
              ...categoryTree.find(item => {
                if(item.id === categoryId) {
                  return item;
                }
              }),
              list: []
            };
          }
          result[categoryId].list.push({...item});
        })
        return result;
    }, []).filter(item => item);
}

export async function fetchSingleProduct(productId) {
  const { storeApiEndpoint, storeApiToken } = publicRuntimeConfig || {};
  const includeOptions = 'images,variants,options,custom_fields';
  if (!storeApiEndpoint) {
    throw 'BIGCOMMERCE_STOREFRONT_API_URL not specified';
  }
  if (!storeApiToken) {
    throw 'BIGCOMMERCE_STOREFRONT_API_TOKEN not specified';
  }
  try {
    const url = `${storeApiEndpoint}/v3/catalog/products/${productId}?include=${includeOptions}`;
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': storeApiToken,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.warn(error.msg);
  }
}

// GraphQL
export async function fetchProducts(pageSize: Number = 4, productType: String) {
  const { bcApiEndpoint, bcToken } = publicRuntimeConfig;
  if (!bcApiEndpoint) {
    throw 'BIGCOMMERCE_STOREFRONT_API_URL not specified';
  }
  if (!bcToken) {
    throw 'BIGCOMMERCE_STOREFRONT_API_TOKEN not specified';
  }

  const variables = {
    pageSize,
    products: true,
    featuredProducts: productType === 'featuredProducts',
    bestSellingProducts: productType === 'bestSellingProducts',
    newestProducts: productType === 'newestProducts',
  };

  const graphQLClient = new GraphQLClient(bcApiEndpoint, {
    mode: 'cors',
    headers: {
      authorization: `Bearer ${bcToken}`,
    },
  });

  return await graphQLClient.request(allProductsQuery, variables);
}
