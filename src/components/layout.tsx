import Navbar from './navbar';
import Footer from './footer';
import HeadDoc from './head';
import React from 'react';


export default function Layout({ children , props }) {
  return (

    <div className=" h-100">
      <HeadDoc />
      <Navbar props={props} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

