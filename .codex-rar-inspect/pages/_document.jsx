import { Head, Html, Main, NextScript } from 'next/document';

const themeScript = "(function(){try{var theme=window.localStorage.getItem('keymiyay-theme');if(theme==='dark'){document.documentElement.classList.add('theme-dark');}}catch(e){}})();";

export default function Document() {
  return (
    <Html suppressHydrationWarning data-scroll-behavior="smooth">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
