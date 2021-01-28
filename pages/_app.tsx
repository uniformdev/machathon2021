// for locally downloaded intent data and tracker from npm
import { AppProps } from 'next/dist/next-server/lib/router/router';

// uniform magic
import { UniformTracker } from '@uniformdev/optimize-tracker-react';
import { Tracker } from '@uniformdev/optimize-tracker-common';
import { IntentVector } from '@uniformdev/optimize-common';
import { localTracker } from '../lib/local-tracker';
import { ComponentMapping } from '../lib/ComponentMapping';

// Component imports
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { ProductSearch } from '@components/Products/ProductSearch';
import { WhyAttend } from '@components/WhyAttend';
import TalkList from '@components/TalkList';
import { MerchList } from '@components/MerchList';
import MainHero from '@components/Hero';
import CallToAction from '@components/CallToAction';
import { PersonalizedHero } from '@components/PersonalizedHero';
import { RegisterForm } from '@components/RegisterForm';
import { Cart } from '@components/Cart/Cart';
import Tickets from '@components/Tickets';
import { ProductDetail } from '@components/Products/ProductDetail';

// global styles
import '../styles/style.css';
import { CommerceProvider } from '@framework';
import { useRouter } from 'next/router';
import { AppContextProvider } from '@lib/contexts';
import TalkDetail from '@components/TalkDetail';
import { TalkSearch } from '@components/TalkSearch';
import { FullCart } from '@components/Cart/FullCart';

const componentMapping: ComponentMapping = {
  hero: MainHero,
  cta: CallToAction,
  // that's 'personalized hero'
  '3zPkEj1KqeSn4QdsdnNKO3': PersonalizedHero,
  talksList: TalkList,
  talkDetail: TalkDetail,
  talkSearch: TalkSearch,
  registrationForm: RegisterForm,
  whyAttend: WhyAttend,
  merchList: MerchList,
  productSearch: ProductSearch,
  ticketsComponent: Tickets,
  productDetail: ProductDetail,
  fullCart: FullCart
};

export type UniformConfAppProps = AppProps & {
  tracker?: Tracker;
  scoring?: IntentVector;
};

export default function UniformConfApp({
  Component,
  pageProps,
  tracker,
  scoring,
}: UniformConfAppProps) {
  const trackerInstance = tracker || localTracker;
  const { locale = 'en-US' } = useRouter();

  return (
    <UniformTracker
      trackerInstance={trackerInstance}
      componentMapping={componentMapping}
      isServer={typeof window === 'undefined'}
      initialIntentScores={scoring}
    >
      <CommerceProvider locale={locale}>
        <AppContextProvider>
          <Navbar />
          <Component {...pageProps} />
          <Cart />
          <Footer />
        </AppContextProvider>
      </CommerceProvider>
    </UniformTracker>
  );
}
