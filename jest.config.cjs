/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    'src/services/carbonIntensity.test.ts',
  ],
}
