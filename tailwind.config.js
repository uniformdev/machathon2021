module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  theme: {    
    extend: {
      minHeight: {
        500: '400px',
      },
      maxHeight: {
        500: '400px',
      },
      keyframes: {
        fadeIn60: {
          '0%': { opacity: '0' },
          '100%': { opacity: '0.6'}
        }
      },
      animation: {
        fadeIn60: 'fadeIn60 0.3s ease-in-out forwards'
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled']
    }
  },
  plugins: [],
};
