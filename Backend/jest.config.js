module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
    testTimeout: 30000,
    verbose: true,
    detectOpenHandles: true,
    forceExit: true,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            isolatedModules: true
        }]
    },
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    }
}; 