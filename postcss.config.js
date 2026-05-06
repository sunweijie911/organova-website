import UnoCSS from '@unocss/postcss';
import pxToViewport from 'postcss-px-to-viewport-8-plugin';

export default {
  plugins: [
    UnoCSS({
      content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    }),
    pxToViewport({
      unitToConvert: 'px',
      viewportWidth: 1920,
      unitPrecision: 3,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      landscape: false,
    }),
  ],
};
