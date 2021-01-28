import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export async function getTickets(isPreview) {
  const { storeApiEndpoint, storeApiToken } = publicRuntimeConfig || {};
  if (!storeApiEndpoint) {
    throw "BIGCOMMERCE_STORE_API_URL not specified";
  }

  // this is entry id for "Tickets" product category
  const ticketsCategoryId = 29;
  const url = `${storeApiEndpoint}/v3/catalog/products?categories:in=${ticketsCategoryId}`;

  const response = await fetch(url, {
    headers: {
      "X-Auth-Token": storeApiToken,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data?.data;
}
