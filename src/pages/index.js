import React, { Component } from 'react';
import Link from 'gatsby-link';
import classNames from 'classnames';

import * as styles from './Pages.css';

class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      searchOpen: false
    };

    this.toggleSearch = this.toggleSearch.bind(this);
    this.search = this.search.bind(this);
  }

  toggleSearch(event) {
    event.preventDefault();

    this.setState({ searchOpen: !this.state.searchOpen });
  }

  search(event) {
    this.setState({ searchQuery: event.currentTarget.value });
  }

  books(allBook) {
    return allBook.edges.filter(node =>
      node.node.title.match(new RegExp(`${this.state.searchQuery}`))
    );
  }

  render() {
    const inputClasses = classNames('search-input', {
      hidden: !this.state.searchOpen
    });

    const { allBook } = this.props.data;

    const books = allBook.edges.filter(book => {
      const regex = new RegExp(`.*${this.state.searchQuery}.*`, 'i');
      return book.node.title.match(regex);
    });

    return (
      <div>
        <div className="info-bar">
          <h4 className="book-count">{books.length} Books</h4>

          <form className="search-form">
            <a href="#" className="search-button" onClick={this.toggleSearch}>
              &#128269;
            </a>

            <input
              type="search"
              value={this.state.searchQuery}
              className={inputClasses}
              placeholder="Book title..."
              onChange={this.search}
            />
          </form>
        </div>

        {books.map(({ node }) => (
          <div key={node.id} className="book">
            <Link className="book-link" to={node.path}>
              <h3>{node.title}</h3>
            </Link>

            <div className="book-info">
              <span className="info">{node.author}</span>

              {node.pageCount && (
                <span className="info">{node.pageCount} pages</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default IndexPage;

export const query = graphql`
  query IndexQuery {
    allBook(sort: { fields: [title] }) {
      totalCount
      edges {
        node {
          id
          title
          author
          pageCount
          path
        }
      }
    }
  }
`;
