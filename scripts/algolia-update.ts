#!/usr/bin/env ts-node-script
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

import algoliasearch from "algoliasearch";
import { getTalks } from "../lib/api";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import fetch from "node-fetch";
import { IndexedProduct } from "../lib/algolia/IndexedProduct";
import { IndexedTalk } from "../lib/algolia/IndexedTalk";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_WRITE_API_KEY
);

const talksIndex = searchClient.initIndex("talks");

(async () => {
  try {
    const talks = await getTalks(false);

    await talksIndex.replaceAllObjects(
      talks.map<IndexedTalk>((talk) => ({
        objectID: talk.sys.id,
        name: talk.fields.title,
        description: documentToHtmlString(talk.fields.description),
        intentTag: Object.keys(talk.fields.unfrmOptIntentTag.intents),
        slug: talk.fields.slug,
        speaker: talk.fields.speaker
      }))
    );

    console.log(`Updated talks (${talks.length})`);
  } catch (e) {
    console.log(JSON.stringify(e));
  }
})();

const productsIndex = searchClient.initIndex("products");

(async () => {
  try {
    const products = await fetch(
      `${process.env.BIGCOMMERCE_STORE_API_URL}/v3/catalog/products?include=custom_fields,images,variants&limit=2000`,
      {
        method: "GET",
        headers: {
          "x-auth-token": process.env.BIGCOMMERCE_STORE_API_TOKEN,
        },
      }
    ).then((res) => res.json());

    const mappedProducts = (products.data as Array<any>).map<IndexedProduct>((product) => {
      console.log("pid", product.id);

      try {
        const images: Record<string, string> = {};

        const variationAttributes = product.variants
          ? product.variants
              .filter(
                (variant) =>
                  variant.option_values && variant.option_values.length
              )
              .map((variant) => {
                const value = variant.option_values[0];

                const attributeValue = `${value.option_display_name}>${value.label}`;

                if(variant.image_url) {
                  images[attributeValue] = variant.image_url
                }

                return attributeValue;
              })
          : [];

        const intentTags = product.custom_fields
          ? product.custom_fields
              .filter((field) => field.name === "intent")
              .map((field) => field.value.split(","))
          : [];

        const flatTags = intentTags.flat();

        images.standard =
          product.images && product.images.length
            ? product.images[0].url_standard
            : null;

        return {
          objectID: `prod-${product.id}`,
          productId: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          keywords: product.search_keywords,
          categories: product.categories,
          intentTag: [...variationAttributes, ...flatTags],
          images
        };
      } catch (e) {
        console.log(e, product.variants);
        // not sure why this does not throw by default
        throw e;
      }
    });

    await productsIndex.replaceAllObjects(mappedProducts);

    console.log(`Updated products (${mappedProducts.length})`);
  } catch (e) {
    console.log(JSON.stringify(e));
  }
})();
