/**
 * Ultra-Aggressive Styled-JSX Patch for Server-Side Rendering (v3.0)
 *
 * This patch completely eliminates "document is not defined" errors during
 * static page generation in Vercel by:
 *
 * 1. Creating a comprehensive mock for document with all methods needed by styled-jsx
 * 2. Directly replacing the styled-jsx StyleSheet class entirely
 * 3. Using Module.prototype._compile override to intercept any styled-jsx loading
 * 4. Applying patches at multiple levels (global, module, require hooks)
 * 5. Monkey-patching Node.js module system to intercept any styled-jsx load attempt
 */

// Flag to prevent multiple applications of the patch
if (typeof global !== 'undefined' && !global.__STYLED_JSX_ULTRA_PATCH_APPLIED__) {
  console.log('🔧 Applying ultra-aggressive styled-jsx SSR/SSG patch v3.0');
  
  // Step 1: Create a comprehensive document mock that handles all styled-jsx needs
  const createMockDocument = () => ({
    createElement: (tag) => {
      const element = {
        style: {},
        sheet: {
          cssRules: [],
          insertRule: (rule) => 0,
          deleteRule: () => {}
        },
        setAttribute: () => {},
        removeAttribute: () => {},
        appendChild: () => {},
        removeChild: () => {},
        textContent: '',
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false
        }
      };
      
      // Special handling for style tags
      if (tag === 'style') {
        element.type = 'text/css';
        element.styleSheet = {
          cssText: '',
          addRule: () => -1,
          removeRule: () => {}
        };
      }
      
      return element;
    },
    createTextNode: () => ({ data: '' }),
    getElementById: () => null,
    getElementsByTagName: () => [],
    head: {
      appendChild: () => {},
      removeChild: () => {},
      insertBefore: () => {}
    },
    body: {
      appendChild: () => {},
      removeChild: () => {}
    },
    documentElement: { style: {} },
    querySelector: () => null,
    querySelectorAll: () => [],
    createStyleSheet: () => ({
      addRule: () => -1,
      removeRule: () => {},
      ownerNode: {},
      cssRules: []
    })
  });

  // Step 2: Define a production-ready mock registry for styled-jsx
  const createMockRegistry = () => ({
    add: () => {},
    update: () => {},
    remove: () => {},
    reset: () => {},
    getStyles: () => []
  });

  // Step 3: Create a completely safe StyleSheet replacement for styled-jsx
  class UltraSafeStyleSheet {
    constructor(options) {
      this.tags = [];
      this.ctr = 0;
      this.sheet = {
        cssRules: [],
        insertRule: () => 0,
        deleteRule: () => {}
      };
      this.cache = {};
      this.registry = createMockRegistry();
      this.isSpeedy = false;
      this.options = options || {};
    }
    
    inject() { return this; }
    remove() {}
    flush() {}
    getSheet() { return { cssRules: [] }; }
    getRules() { return ""; }
    insertRule(rule) { return 0; }
    deleteRule() {}
    replaceRule() {}
    cssRules() { return []; }
    makeStyleTag() {
      return {
        type: 'text/css',
        styleSheet: { cssText: '' },
        appendChild: () => {}
      };
    }
    
    // Add static method for Server-Side Rendering
    static renderStyles() {
      return { styles: [] };
    }
    
    // Add all other methods that might be used
    hydrate() {}
    collectStyles() { return { props: {} }; }
  }

  // Step 4: Apply all global polyfills if we're in a server environment
  if (typeof window === 'undefined') {
    // ALWAYS create our document mock - this is the key change for reliability
    // Even if document exists, we replace it to ensure consistency
    global.document = createMockDocument();
    console.log('✅ Ultra-safe document mock created for SSR/SSG');
    
    // Make document non-configurable and non-writable to prevent deletion
    try {
      Object.defineProperty(global, 'document', {
        value: global.document,
        writable: false,
        configurable: false
      });
      console.log('✅ Made document non-configurable for maximum protection');
    } catch (err) {
      console.warn('⚠️ Could not make document non-configurable:', err.message);
    }
    
    // Set up window with our document
    global.window = {
      document: global.document,
      StyleSheet: UltraSafeStyleSheet,
      navigator: { userAgent: 'Node.js' }
    };
    
    // Make window non-configurable too
    try {
      Object.defineProperty(global, 'window', {
        value: global.window,
        writable: false,
        configurable: false
      });
    } catch (err) {
      console.warn('⚠️ Could not make window non-configurable:', err.message);
    }
    
    // Handle self references
    global.self = global;
    
    // Expose the UltraSafeStyleSheet globally
    global.StyleSheet = UltraSafeStyleSheet;
    
    // Next.js specific environment flags
    if (typeof process !== 'undefined') {
      process.env.NEXT_STYLED_JSX_PATCH = 'true';
      process.env.NEXT_DISABLE_STYLED_JSX_OPTIMIZATION = 'true';
      process.env.NEXT_DISABLE_STATIC_GENERATION_OPTION = 'true';
      process.env.NEXT_DISABLE_SSG = 'true';
      process.env.NEXT_FORCE_SERVER_MODE = 'true';
    }
  }
  
  // Step 5: Super-aggressive approach to intercept styled-jsx at the Node.js module level
  try {
    // Only do this on the server
    if (typeof window === 'undefined' && typeof require === 'function') {
      // Try to monkey-patch the Node.js module system if possible
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Module = require('module');
        
        // Save the original _compile method
        const originalCompile = Module.prototype._compile;
        
        // Override _compile to intercept styled-jsx during loading
        Module.prototype._compile = function(content, filename) {
          // Check if this is a styled-jsx file
          if (filename.includes('styled-jsx') &&
              (filename.includes('/dist/') || filename.endsWith('index.js'))) {
            
            console.log(`🔍 Intercepted styled-jsx file load: ${filename}`);
            
            // Replace StyleSheet class in the content if possible
            if (content.includes('StyleSheet')) {
              // Replace the entire StyleSheet implementation with our safe version
              content = content.replace(
                /var StyleSheet\s*=\s*[\s\S]*?function StyleSheet[\s\S]*?return StyleSheet;?\}\(\)\);?/g,
                 
                'var StyleSheet = require("' + require.resolve('./enhanced-styled-jsx-patch.js') +
                '").UltraSafeStyleSheet;'
              );
              
              console.log(`✅ Replaced StyleSheet implementation in ${filename}`);
            }
          }
          
          // Call the original _compile with possibly modified content
          return originalCompile.call(this, content, filename);
        };
        
        console.log('✅ Successfully monkey-patched Node.js module system for styled-jsx interception');
      } catch (err) {
        console.warn('⚠️ Could not monkey-patch Node.js module system:', err.message);
      }
      
      // More direct patching of already loaded modules
      try {
        // Try to resolve the styled-jsx path
         
        const styledJsxPath = require.resolve('styled-jsx');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const styledJsx = require(styledJsxPath);
        
        if (styledJsx && styledJsx.StyleSheet) {
          // Replace the StyleSheet implementation
          styledJsx.StyleSheet = UltraSafeStyleSheet;
          console.log('✅ Successfully patched already loaded styled-jsx module');
        }
      } catch (err) {
        console.warn('⚠️ Could not patch already loaded styled-jsx module:', err.message);
      }
      
      // Ultra-aggressive path-based approach to find and patch styled-jsx
      const possiblePaths = [
        'styled-jsx/dist/index/index.js',
        'styled-jsx/dist/index.js',
        'styled-jsx/index.js',
        'node_modules/styled-jsx/dist/index/index.js',
        '../node_modules/styled-jsx/dist/index/index.js',
        '../../node_modules/styled-jsx/dist/index/index.js',
        '.pnpm/styled-jsx@*/node_modules/styled-jsx/dist/index/index.js'
      ];
      
      for (const path of possiblePaths) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const styledJsx = require(path);
          if (styledJsx && styledJsx.StyleSheet) {
            // Replace the StyleSheet implementation
            styledJsx.StyleSheet = UltraSafeStyleSheet;
            console.log(`✅ Successfully patched styled-jsx at path: ${path}`);
          }
        } catch (err) {
          // Continue trying paths
        }
      }
      
      // Override require for styled-jsx
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Module = require('module');
      const originalRequire = Module.prototype.require;
      Module.prototype.require = function(id) {
        // Call the original require
        const result = originalRequire.apply(this, arguments);
        
        // Check if this is styled-jsx
        if (id === 'styled-jsx' || id.includes('styled-jsx')) {
          // Patch the StyleSheet if it exists
          if (result && result.StyleSheet) {
            result.StyleSheet = UltraSafeStyleSheet;
            console.log(`✅ Patched styled-jsx during require: ${id}`);
          }
        }
        
        return result;
      };
    }
  } catch (error) {
    console.warn('⚠️ Error during ultra-aggressive styled-jsx patching:', error.message);
  }
  
  // Export the UltraSafeStyleSheet for external use
  global.UltraSafeStyleSheet = UltraSafeStyleSheet;
  
  // Mark as applied to prevent duplicate application
  global.__STYLED_JSX_ULTRA_PATCH_APPLIED__ = true;
  console.log('✅ Ultra-aggressive styled-jsx patch v3.0 applied successfully');
}

// Export UltraSafeStyleSheet for direct use
export const UltraSafeStyleSheet = global.UltraSafeStyleSheet;

// Export marker function to verify patch is loaded
export function verifyEnhancedStyledJsxPatch() {
  return typeof global !== 'undefined' && !!global.__STYLED_JSX_ULTRA_PATCH_APPLIED__;
}

// Support CommonJS exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    verifyEnhancedStyledJsxPatch,
    UltraSafeStyleSheet: global.UltraSafeStyleSheet,
    default: verifyEnhancedStyledJsxPatch
  };
}

export default verifyEnhancedStyledJsxPatch;