import { useUniformTracker } from '@uniformdev/optimize-tracker-react';
import Head from 'next/head';
import { PageFields } from '../lib/contentful';
import { createElement } from 'react';

const componentDataPropMap = {
  ticketsComponent: 'tickets',
  talksList: 'talks',
  productSearch: 'products'
};

export interface PageProps {
  slug: string;
  page: PageFields;
}

export function Home(props) {
  const { page } = props;
  const { componentMapping } = useUniformTracker();
  return (
    <>
      <Head>
        <title>{page?.title} | UniformConf</title>
      </Head>
      {page?.components &&
        page.components.map((component, index) => {
          const componentType = component.sys.contentType?.sys?.id;
          const componentPropKey = componentDataPropMap[componentType]
            ? componentDataPropMap[componentType]
            : componentType;
          const componentProps = {
            key: index,
            ...component,
          };
          if (props[componentType]) {
            componentProps[componentPropKey] = props[componentType];
          }
          return createElement(
            componentMapping[componentType] ?? (() => null),
            componentProps
          );
        })}
    </>
  );
}
