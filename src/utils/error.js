/**
 * Utility for creating standardized error objects
 * 
 * @param {string} message - Human-readable error message
 * @param {string} code - Error code for programmatic handling
 * @param {Error} originalError - Original error that caused this error (optional)
 * @returns {Error} Standardized error object
 */
function createError(message, code, originalError = null) {
  const error = new Error(message);
  error.code = code;
  
  if (originalError) {
    error.originalError = originalError;
    error.stack = `${error.stack}\nCaused by: ${originalError.stack}`;
  }
  
  return error;
}

module.exports = {
  createError
};