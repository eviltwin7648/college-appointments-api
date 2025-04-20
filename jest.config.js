/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  preset:"ts-jest",
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['./src/__tests__/jest.setup.ts'],
  verbose:true,
  forceExit:true
};