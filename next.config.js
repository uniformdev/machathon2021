module.exports = {
  target: 'serverless',
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    gaTrackingId: process.env.GA_UA_ID,
    segmentTrackingId: process.env.SEGMENT_ID,
    preview: process.env.PREVIEW !== undefined,
    bcApiEndpoint: process.env.BIGCOMMERCE_STOREFRONT_API_URL,
    bcToken: process.env.BIGCOMMERCE_STOREFRONT_API_TOKEN,
    storeApiEndpoint: process.env.BIGCOMMERCE_STORE_API_URL,
    storeApiToken: process.env.BIGCOMMERCE_STORE_API_TOKEN,
  },
  trailingSlash: true,
};
