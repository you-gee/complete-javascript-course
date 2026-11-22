/**
 * Application-wide configuration values for the Forkify API and UI.
 *
 * @module config
 */

/** @constant {string} Base URL for recipe API requests. */
export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes';
/** @constant {number} Maximum number of seconds to wait for an API request. */
export const TIMEOUT_SECONDS = 5;
/** @constant {number} Number of search results shown on each page. */
export const RESULTS_PER_PAGE = 10;
/** @constant {string} API key used for authenticated recipe requests. */
export const API_KEY = 'e780a2d5-11f0-4d21-85b6-f388b669212d';
/** @constant {number} Delay, in seconds, before the add-recipe modal closes. */
export const MODAL_CLOSE_TIME_SEC = 2.5;
