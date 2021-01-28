import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export async function fetchCategoryTree() {
    const { storeApiEndpoint, storeApiToken } = publicRuntimeConfig || {};      
    if (!storeApiEndpoint) {
      throw 'BIGCOMMERCE_STOREFRONT_API_URL not specified';
    }
    if (!storeApiToken) {
      throw 'BIGCOMMERCE_STOREFRONT_API_TOKEN not specified';
    }
    try {
      const url = `${storeApiEndpoint}/v3/catalog/categories/tree`;      
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