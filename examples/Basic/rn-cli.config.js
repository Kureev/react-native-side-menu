const defaultConfig = require('react-native/local-cli/default.config.js');
const path = require('path');

/**
 * Default configuration
 *
 * This is used instead of inline packager instructions so that
 * it works regardless of the invocation
 */
const config = {

  getProjectRoots() {
    const roots = defaultConfig.getProjectRoots();
    roots.unshift(path.resolve(__dirname, '../../'));
    return roots;
  },

};

module.exports = config;
