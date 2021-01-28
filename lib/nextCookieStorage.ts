import { ScoringStorage } from '@uniformdev/optimize-tracker-common';
import { NextPageContext } from 'next';
import { parseCookies, setCookie } from 'nookies';
import { cookieScoringStorage } from '@uniformdev/optimize-tracker';

export const createNextCookieStorage = (ctx?: NextPageContext): ScoringStorage => {
  const cookieStorage = cookieScoringStorage({
    getCookie: (name) => {
      const cookies = parseCookies(ctx) || {};
      return cookies[name];
    },

    setCookie: (name, value, maxAge) => {
      setCookie(ctx, name, value, {
        maxAge,
        path: '/',
      });
    },
  });

  return cookieStorage;
};
