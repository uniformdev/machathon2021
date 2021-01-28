

import { gql } from 'graphql-request'

const productInfoFragment = gql`
fragment productInfo on Product {
  id
  entityId
  name
  path
  brand {
    entityId
  }
  description
  images {
    edges {
      node {
        urlOriginal
        altText
        isDefault
      }
    }
  }
  variants {
    edges {
        node {
            entityId
        }
    }
  }
  prices {
    price {
      value
      currencyCode
    }
    salePrice {
      value
      currencyCode
    }
    retailPrice {
      value
      currencyCode
    }
  }
}
`
export const allProductsQuery = gql`
query paginateProducts(
  $pageSize: Int = 3
  $cursor: String,
  $products: Boolean = false,
  $featuredProducts: Boolean = false,
  $bestSellingProducts: Boolean = false,
  $newestProducts: Boolean = false
) {
  site {
    products(first: $pageSize, after: $cursor) @include(if: $products) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...productInfo
        }
      }
    }
    featuredProducts(first: $pageSize, after: $cursor) @include(if: $featuredProducts) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...productInfo
        }
      }
    }
    bestSellingProducts(first: $pageSize, after: $cursor) @include(if: $bestSellingProducts) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...productInfo
        }
      }
    }
    newestProducts(first: $pageSize, after: $cursor) @include(if: $newestProducts) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...productInfo
        }
      }
    }
  }
}
${productInfoFragment}
`;

