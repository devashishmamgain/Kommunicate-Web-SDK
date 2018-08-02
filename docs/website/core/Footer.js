/**
 * Copyright (c) 2018-present, Kommunicate, Inc.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
   // return baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
   return baseUrl + 'docs/' +  doc;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? language + '/' : '') + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
      
        <section className="sitemap">
        <div className="col-lg-6 no-flex">
      <a
          href="https://kommunicate.io"
          target="_blank"
          className="kmLogoFooter">
          <img
            src={this.props.config.baseUrl + 'img/km-logos.svg'}
            alt="Facebook Open Source"
            width="170"
            height="45"
          />
        </a>
        <div className="km-address">
          <p>
            Stanford Financial Square,<br/>
            2600 El Camino Real, Suite 415,<br/>
            Palo Alto, CA 94306<br/><br/>

            <a href="tel:+13109097458">(+1) (310) 909-7458 </a><br/>
            <a href="mailto:hello@kommunicate.io">hello@kommunicate.io</a><br/>
          </p>
        </div>
      </div>
      <div className="col-lg-6">
      <div>
            <h5>Docs</h5>
            <a href={this.docUrl('web-installation.html', this.props.language)}>
              Web
            </a>
            <a href={this.docUrl('android-installation.html', this.props.language)}>
              Android
            </a>
            <a href={this.docUrl('ios-installation.html', this.props.language)}>
              iOS
            </a>
            <a href={this.docUrl('cordova-installation.html', this.props.language)}>
            Ionic/Phonegap
            </a>
            <a href="https://docs.applozic.com/docs/xamarin-chat-sdk" target="_blank">
            Xamarin
            </a>
          </div>
          <div>
            <h5>Product</h5>
            {/* <a href={this.pageUrl('users.html', this.props.language)}>
              User Showcase
            </a> */}
            <a href="https://www.kommunicate.io/pricing" className="footer-pricing">Pricing and FAQs</a>
            <a href="https://calendly.com/kommunicate/15min" target="_blank">Request Demo</a>
          </div>
          <div>
            <h5>Social</h5>
            <a href="https://facebook.com/kommunicateio" target="_blank">Facebook</a>
            <a href="https://twitter.com/kommunicateio" target="_blank">Twitter</a>
            <a href="https://www.linkedin.com/company/13623163/" target="_blank">Linkedin</a>
            {/* <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a> */}
          </div>
      </div>
        </section>
        <section className="copyright">
          Copyright &copy; {currentYear} Kommunicate.io.
        </section>
      </footer>
    );
  }
}

module.exports = Footer;