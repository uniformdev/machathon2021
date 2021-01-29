# Uniform MACHathon 2021 project

[Submission here](https://devpost.com/software/universal-personalization-across-cms-commerce-and-search)

[![Netlify Status](https://api.netlify.com/api/v1/badges/994a0378-cbe5-468f-9ef4-362f211338d5/deploy-status)](https://app.netlify.com/sites/machdemouniform/deploys)

## Built with
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Tailwind Landing Page from @tailwindtoolbox](https://github.com/tailwindtoolbox/Landing-Page) - UI theme
- [Next.js](https://nextjs.org/) - React framework
- [Next.js Commerce](https://nextjs.org/commerce) - parts of the BigCommerce framework
- [Algolia](https://www.algolia.com/) for talks and product search
- [BigCommerce](https://www.bigcommerce.com/) for product catalog and checkout (via GraphQL and REST API)
- [Contentful](https://www.contentful.com/) for all things content
- [Netlify](https://www.netlify.com/) for serverless functions, Jamstack builds and fast delivery
- [Uniform](https://uniform.dev) as edge personalization, tracking and orchestration
- Google Analytics for personalization analytics and data collection

## Getting Started

### Pre-requisites
- Using your [BigCommerce](https://www.bigcommerce.com/) account:
    - Perform products import using the export file from `\exports\bigcommerce-products.csv`.

- Using your [Contentful](https://www.contentful.com/) account:
    - perform content import of exported content from `\exports\contentful-export.json`.
- Using your [Algolia](https://www.algolia.com/) account:
    - setup your Algolia app and retrieve the API keys for the .env file below.
- Setup a free account with [Uniform](https://uniform.app).

### Configure environment variables

- Copy .env.example to .env
- Set values to match your Contentful, BigCommerce, Uniform, and Algolia values

### Install packages

```shell
yarn
```

### Run the development server

```shell
yarn dev
```

Open <http://localhost:4120> with your browser to see the result.

## Learn More

To learn more about Uniform, check out our [website](https://uniform.dev), [sign up for an account](https://uniform.app), or read our [documentation](https://docs.uniform.app)
