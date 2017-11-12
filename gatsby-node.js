const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const fs = require('fs');

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNode, createParentChildLink } = boundActionCreators;

  if (node.internal.mediaType === `application/pdf`) {
    const path = createFilePath({ node, getNode, basePath: `pages` });
    const metadata = {};
    const pdfPath = node.absolutePath;

    pdfExtract.extract(
      pdfPath,
      {} /* options, currently nothing available*/,
      function(err, data) {
        if (err) {
          return console.log(err);
        }

        if (data.meta.info) {
          const downloadPath = pdfPath.match(
            /(.*)\/src\/pages\/books\/(.*)/
          )[2];
          const fallbackName = downloadPath.replace(/\.pdf$/, '');

          metadata.downloadPath = `../../pdf/${downloadPath}`;
          metadata.title = data.meta.info.Title || fallbackName;
          metadata.author = data.meta.info.Author || 'Unknown';
          metadata.pageCount = (data.pdfInfo.numPages || 0).toString();
          metadata.fingerprint =
            data.pdfInfo.fingerprint || Math.random().toString();
        }

        const bookNode = {
          ...metadata,
          path: path.replace(/\s|\(|\)|\[|\]\<|>/g, '-'),
          id: `${node.id} [${metadata.fingerprint}] >>> ${node.extension}`,
          children: [],
          parent: node.id,
          internal: {
            contentDigest: data.pdfInfo.fingerprint,
            type: 'book'
          }
        };

        createNode(bookNode);
        createParentChildLink({ parent: node, child: bookNode });
      }
    );
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const viewBook = path.resolve('./src/templates/view-book.js');
    resolve(
      graphql(
        `
          {
            allBook(limit: 1000) {
              edges {
                node {
                  path
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        result.data.allBook.edges.forEach(edge => {
          createPage({
            path: edge.node.path,
            component: viewBook,
            context: {
              path: edge.node.path
            }
          });
        });
      })
    );
  });
};
