import '../css/style.css';

// import morphdom from 'https://cdn.skypack.dev/morphdom';
// import { morph } from 'https://cdn.skypack.dev/@alpinejs/morph';
import { morph } from './morph';

async function setup() {
    const pages = {
        page1: await fetch('/pages/1.html').then((res) => res.text()),
        page2: await fetch('/pages/2.html').then((res) => res.text()),
    };

    const iframe = document.querySelector('iframe');
    let currentPage = 'page1';

    setInterval(() => {
        currentPage = currentPage === 'page1' ? 'page2' : 'page1';

        const page = pages[currentPage];

        morph(iframe.contentDocument.documentElement, page).then(console.log);
        // console.log(morphdom(iframe.contentDocument.documentElement, page));
    }, 1000);
}

setup();
