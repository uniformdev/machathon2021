const imageHost = 'https://cdn11.bigcommerce.com';

export const getResizedImageUrl = (src: string, width: number): string => {
  if (!src) {
    return undefined;
  }
  return src.replace(
    `${imageHost}/s-xqu7q0aniv/product_images/`,
    `${imageHost}/s-xqu7q0aniv/images/stencil/${width}w/`
  );
};