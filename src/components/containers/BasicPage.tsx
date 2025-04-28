import React from 'react';
import Page from './Page';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

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
