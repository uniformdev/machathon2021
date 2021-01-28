import React, { useState, useEffect } from "react";
import { fetchProducts } from "@bcapi/products";
import ContentLoader from "react-content-loader";

/* DEPRECATED - replaced by Algolia version. But this can still be legit for some use cases */

export const MerchList: React.FC<any> = ({ fields }) => {
  const { productType, productCount, title, personalizedTitle } = fields;

  const [products, setProducts] = useState(undefined);
  
  // @ts-ignore
  useEffect(async () => {
    const data = await fetchProducts(productCount, productType);
    const siteData = data?.site;
    const productData =
      productType && siteData[productType]
        ? siteData[productType]?.edges
        : siteData?.products?.edges;
    const products =
      productData && Array.isArray(productData)
        ? productData.map((p) => p.node)
        : [];
    setProducts(products);
  }, [setProducts, productCount]);

  return (
    <section className="bg-white border-b py-8">
      <div className="container mx-auto flex flex-wrap pt-4 pb-12">
        <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          {title}
        </h2>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6 mx-auto">
          {products && Array.isArray(products) ? (
            products
              .filter((p) => p)
              .map((product, index) => (
                <MerchListItem
                  key={index}
                  path={product.path}
                  imageSrc={product.images?.edges[0]?.node.urlOriginal}
                  name={product.name}
                  price={product.prices?.price?.value}
                />
              ))
          ) : (
            <EmptyMerchList productCount={productCount} />
          )}
        </div>
      </div>
    </section>
  );
};

const EmptyMerchList: React.FC<any> = ({ productCount }) => {
  return Array.apply(null, Array(productCount)).map((item, index) => (
    <MerchListItem key={index} isLoading={true} />
  ));
};

const MerchItemLoader = (props) => (
  <ContentLoader
    speed={2}
    width={340}
    height={84}
    viewBox="0 0 340 84"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="300" height="25" />
    <rect x="0" y="30" rx="3" ry="3" width="50" height="25" />
    <rect x="75" y="30" rx="3" ry="3" width="225" height="25" />
  </ContentLoader>
);

const MerchListItem: React.FC<any> = ({
  name,
  path,
  imageSrc,
  price,
  isLoading,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
      <div
        className={
          isLoading
            ? "flex items-end justify-end h-56 w-full bg-cover bg-gray-200"
            : "flex items-end justify-end h-56 w-full bg-cover"
        }
        style={{
          backgroundImage: `url("${isLoading ? null : imageSrc}")`,
        }}
      >
        {isLoading ? null : <CheckoutButton isLoading={isLoading} />}
      </div>
      <div className="px-5 py-3">
        {isLoading ? (
          <MerchItemLoader />
        ) : (
          <>
            <h3 className="text-gray-700 uppercase">{name}</h3>
            <span className="text-gray-500 mt-2">${price}</span>
          </>
        )}
      </div>
    </div>
  );
};

const CheckoutButton: React.FC<any> = (props) => {
  return (
    <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
      <svg
        className="h-5 w-5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </button>
  );
};
