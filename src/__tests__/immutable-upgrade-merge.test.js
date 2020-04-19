jest.autoMockOff();
const defineTest = require('../testUtils').defineTest;

describe('immutable-upgrade-merge', () => {
    defineTest(__dirname, 'immutable-upgrade-merge', null, 'immutableMergeWithImport');
    defineTest(__dirname, 'immutable-upgrade-merge', null, 'immutableMergeWithoutImport');
});
