/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? language + '/' : '') + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer" >
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('getting-started.html')}>
              Getting Started
            </a>
            <a href={this.docUrl('android.html')}>
              Android
            </a>
            <a href={this.docUrl('ios.html')}>
              IOS
            </a>
            <a href={this.docUrl('python.html')}>
              Python
            </a>
          </div>
          <div>
            <h5>Reddit</h5>
            <a
              href="https://www.reddit.com/r/KinFoundation/"
              target="_blank"
              rel="noreferrer noopener">
              r/KinFoundation
            </a>
            <h6>Telegram</h6>
            <a href="https://t.me/KinAnnouncements"
              target="_blank"
              rel="noreferrer noopener">
              Announcements</a>
            <a href="https://t.me/kinfoundation"
              target="_blank"
              rel="noreferrer noopener">
              General</a>
            <a href="https://t.me/kincurrency"
              target="_blank"
              rel="noreferrer noopener">
              Currency</a>
            <a href="https://t.me/kintechnology"
              target="_blank"
              rel="noreferrer noopener">
              Technology</a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://medium.com/kinfoundation"
              target="_blank"
              rel="noreferrer noopener">Kin Blog</a>
            <a href="https://medium.com/inside-kin"
              target="_blank"
              rel="noreferrer noopener">Inside Kin Blog</a>
            <a
              href="https://twitter.com/kin_foundation"
              target="_blank"
              rel="noreferrer noopener">
              Twitter
              </a>
            <a href="https://www.youtube.com/channel/UCZ0z9fRKhW-GEjQs-_Jxfyg"
              target="_blank"
              rel="noreferrer noopener">YouTube</a>
            <a href="https://kinecosystem.org"
              target="_blank"
              rel="noreferrer noopener">Kin Ecosystem</a>
          </div>
        </section>

        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
