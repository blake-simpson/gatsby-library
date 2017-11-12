import React from 'react';
import Link from 'gatsby-link';
import { Helmet } from 'react-helmet';

import { rhythm } from '../utils/typography';

import * as styles from './Layout.css';

export default ({ children, data }) => (
  <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Library</title>
    </Helmet>

    <header className="masthead">
      <Link className="home-link" to={`/`}>
        <h3>{data.site.siteMetadata.title}</h3>
      </Link>
    </header>

    {children()}
  </div>
);

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
