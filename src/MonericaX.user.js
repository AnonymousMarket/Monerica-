// ==UserScript==
// @name         MonericaX
// @version      1.0
// @description  Enhance Monerica's UI, remove sponsored content, clean referral links, and highlight reported scams.
// @match        https://monerica.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // CSS to enhance the UI
    const improvedCss = `
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #18181b;
            color: #333 !important;
            width: 100%;
        }
        hr {
            color: rgb(51, 51, 54);
            background-color: rgb(51, 51, 54);
        }
        * {
            text-shadow: none !important;
        }
        label, a, li, ul {
            color: #818cf8 !important;
            font-weight: normal !important;
        }
        label:hover {
          cursor: pointer;
        }
        i, p {
            color: #d4d4d8 !important;
        }
        h1, h2, h3, h4 {
            color: #f4f4f5 !important;
        }
        header, nav {
            background-color: #1e1e1e;
            color: #fff;
        }
        header a, nav a {
            color: #ffcc00;
        }
        header a:hover, nav a:hover {
            color: #fff;
        }
        .content, .main-container {
            margin: 20px auto;
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
        }
        footer {
            background-color: #1e1e1e;
            color: #fff;
            padding: 10px;
            text-align: center;
        }
        footer a {
            color: #ffcc00;
        }
        footer a:hover {
            color: #fff;
        }
        .error-text {
            color: #e11d48 !important;
        }
        .error-text::before {
            content: '⚠️';
            vertical-align: middle;
        }
        .referral-cleaned::after {
            content: '🔗';
            color: #4ade80;
            margin-left: 5px;
            font-size: 14px;
        }
    `;

    // Remove sponsored content
    const removeSponsoredContent = () => {
        const sponsoredSelectors = [
            '.create-sponsored-listing',
            '.sponsored',
            'div.sponsored-section',
            'p.sub-category-sponsored-listing > .app-link',
        ];
        sponsoredSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => element.remove());
        });
    };

    // Clean referral links
    const cleanReferralLinks = () => {
        document.querySelectorAll('a').forEach(link => {
            const url = new URL(link.href);
            if (url.search) {
                url.search = '';

                link.href = url.toString();
                link.classList.add('referral-cleaned');
            }
        });
    };

    // Highlight scam reported sites
    const highlightErrors = () => {
        document.querySelectorAll('p').forEach(paragraph => {
            if (paragraph.textContent.includes('❌')) {
                paragraph.classList.add('error-text');
                paragraph.textContent = paragraph.textContent.replace(/❌+/g, '').trim();
            }
        });
    };

    // Inject custom CSS
    const injectCss = () => {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = improvedCss;
        document.head.appendChild(style);
    };

    // Observe for dynamically added content (added via js)
    const observeMutations = () => {
        const observer = new MutationObserver(() => {
            removeSponsoredContent();
            cleanReferralLinks();
            highlightErrors();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Init Header for Monerica++
    document.getElementsByClassName('top-container')[0].innerHTML = ``
    document.getElementsByClassName('legend')[0].innerHTML = `
      <h4>Welcome to MonericaX</h4>
      <p>⚠️ Indicates scams being reported from the service</p>
      <p>🔗 Means Monerica injected their referal link into the URL, but has been removed by MonericaX</p>
    `

    injectCss();
    removeSponsoredContent();
    cleanReferralLinks();
    highlightErrors();
    observeMutations();
})();
