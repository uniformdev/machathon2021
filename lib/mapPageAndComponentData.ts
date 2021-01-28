import getConfig from 'next/config';
import { GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getPageBySlug } from './api';
import componentDataProviders from './bigcommerce/api/componentDataProviders';
import { Entry } from 'contentful';

export const mapPageAndComponentData = async (
  slug: string,
  context: GetStaticPropsContext<ParsedUrlQuery>
) => {
  const { publicRuntimeConfig } = getConfig();
  const isPreview: boolean = context.preview || publicRuntimeConfig.preview;

  const page = await getPageBySlug(isPreview, slug);
  const components = (page && page.components) || [];

  const componentData = {};
  for await (const component of components) {
    const type = component.sys.contentType.sys.id;
    if (componentDataProviders[type]) {
      // fetching the data for this component type if it's registered
      componentData[type] = await componentDataProviders[type]({
        isPreview,
        page,
        componentData: component as unknown as Entry<any>,
        ssgContext: context,
      });
    }
  }

  return {
    props: {
      slug,
      page,
      ...componentData,
    },
  };
};
