import Layout from '../components/layout';
import '../css/app.scss';
import '../css/panel.css';

import Router, {useRouter} from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import '../css/nprogress.css'; //styles of nprogress
import React, { useState, useEffect } from 'react';

//Route Events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from '../redux/store';
import LayoutPanel from "../components/panel/layout";
import qs from "querystring";
import Head from "next/head";

export default function MyApp({ Component, pageProps, }: AppProps) {
    const { pathname } = useRouter();
  return (
      pathname.includes('/panel') || pathname.includes('/admin') ?

      <Provider store={store}>
          <LayoutPanel props={pageProps.cookies}>
              <Head>
                  <link rel="manifest" href="/manifest.json"/>
                  <link rel="apple-touch-icon" href="/images/pwa/icon-512x512.png"></link>
                  <meta
                      name='viewport'
                      content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
                  />   </Head>
            <ToastContainer />
            <Component {...pageProps} />
          </LayoutPanel>
    </Provider>

:
              <Provider store={store}>
                  <ToastContainer />
                  <Layout props={pageProps.cookies}>
                      <Head>
                          <link rel="manifest" href="/manifest.json"/>
                          <link rel="apple-touch-icon" href="/images/pwa/icon-512x512.png"></link>
                          <meta
                              name='viewport'
                              content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
                          /> </Head>
                      <Component {...pageProps} />
                  </Layout>
              </Provider>

  );
}

MyApp.getInitialProps = async ({ ctx }) => {
    const { req  } = ctx;

    const cookie = req ? req.headers.cookie : document.cookie;
    if(cookie){
        const cookies = qs.decode(cookie, "; ");
        return {
            pageProps:  { cookies }
        };
    }else{
        return {
            pageProps:  {  }
        };
    }

};