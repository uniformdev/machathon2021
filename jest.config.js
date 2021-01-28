module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(tests?|specs?))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: false,
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/cypress/**', '!**/node_modules/**', '!**/out/**'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
