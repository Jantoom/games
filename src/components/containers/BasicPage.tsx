import React from 'react';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';
import Page from './Page';

interface BasicPageProps {
  children: React.ReactNode;
}

const BasicPage: React.FC<BasicPageProps> = ({ children }) => {
  return (
    <Page>
      <Header />
      <Body>{children}</Body>
      <Footer />
    </Page>
  );
};

export default BasicPage;
