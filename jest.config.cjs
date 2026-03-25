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
    '/e2e/',
  ],
  setupFilesAfterEnv: ['./jest.setup.ts'],
}
