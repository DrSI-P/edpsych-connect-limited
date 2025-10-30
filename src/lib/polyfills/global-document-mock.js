
/**
 * Global Document Mock for Server-Side Rendering
 * 
 * This module provides a safe document object that can be used during
 * server-side rendering to prevent "document is not defined" errors.
 */

if (typeof global !== 'undefined' && typeof global.document === 'undefined') {
  global.document = {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      appendChild: () => {},
      textContent: ''
    }),
    head: { 
      appendChild: () => {} 
    },
    createTextNode: () => ({}),
    documentElement: { 
      style: {} 
    },
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: () => [],
    querySelector: () => null,
    querySelectorAll: () => []
  };

  global.window = {
    getComputedStyle: () => ({
      getPropertyValue: () => ''
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
    document: global.document
  };

  global.navigator = {
    userAgent: 'node'
  };

  console.log('✅ Successfully created server-side document mock');
}

module.exports = {
  isDocumentMocked: typeof global !== 'undefined' && typeof global.document !== 'undefined'
};
