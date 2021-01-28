import { ServerState, TrackerRequestContext } from '@uniformdev/optimize-tracker-common';
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';
import { createLocalTracker } from '../lib/local-tracker';

type CustomDocumentProps = DocumentInitialProps & {
  serverState: ServerState;
};

class MyDocument extends Document<CustomDocumentProps> {
  static getRequestContext = (ctx: DocumentContext): TrackerRequestContext => {
    const { req } = ctx;

    return {
      url: 'https://' + req.headers.host + req.url,
      cookies: req.headers.cookie,
      userAgent: req.headers['user-agent'],
    };
  };

  static async getInitialProps(ctx: DocumentContext): Promise<CustomDocumentProps> {
    const serverTracker = createLocalTracker(ctx);
    const requestContext = MyDocument.getRequestContext(ctx);

    await serverTracker.initialize();
    const { signalMatches, scoring } = await serverTracker.reevaluateSignals(requestContext);

    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props: any) => (
          <App {...props} tracker={serverTracker} ssrMatches={signalMatches} scoring={scoring} />
        ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      serverState: {
        matches: signalMatches,
        scoring,
      },
    };
  }

  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="UniformConf, a Uniform Optimize demo site" />
          <link rel="preconnect" href="https://images.ctfassets.net" />
          <link rel="preconnect" href="https://cdn11.bigcommerce.com" />
          <link rel="preconnect" href="https://sjhb9d5vm9-dsn.algolia.net" />
        </Head>
        <body className="leading-normal tracking-normal text-white gradient">
          <Main />
          <script
            id="__UNIFORM_DATA__"
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(this.props.serverState),
            }}
          ></script>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
