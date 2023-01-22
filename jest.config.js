/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.js'],
  transform: {
    '^.+\\.(js|ts|tsx|jsx)$': 'ts-jest',
  },
  collectCoverage: true,
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(azure-devops-ui|azure-devops-extension-sdk)/)'],
};
