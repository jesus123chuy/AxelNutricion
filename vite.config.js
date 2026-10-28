import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// En páginas con skeleton, el CSS principal se carga sin bloquear el render:
// así el skeleton (con estilos inline) aparece de inmediato aunque la conexión sea lenta.
const nonBlockingCss = {
  name: 'non-blocking-css',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      if (!html.includes('id="page-skeleton"')) return html;
      return html.replace(/<link rel="stylesheet"( crossorigin)? href="([^"]+\.css)">/g, (_match, crossorigin = '', href) => [
        `<link rel="stylesheet"${crossorigin} href="${href}" media="print" data-app-css onload="this.media='all';window.__skeleton&&window.__skeleton.ready('css')" onerror="window.__skeleton&&window.__skeleton.fail()">`,
        `<noscript><link rel="stylesheet"${crossorigin} href="${href}"></noscript>`,
      ].join('\n    '));
    },
  },
};

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), nonBlockingCss],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacidad: resolve(import.meta.dirname, 'aviso-de-privacidad.html'),
      },
    },
  },
});
