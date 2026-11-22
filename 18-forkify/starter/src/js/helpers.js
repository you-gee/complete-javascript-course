import { TIMEOUT_SECONDS } from './config';

/**
 * Shared HTTP and timeout helpers for API requests.
 *
 * @module helpers
 */

/**
 * Creates a promise that rejects after the supplied number of seconds.
 *
 * @param {number} s Timeout duration in seconds.
 * @returns {Promise<never>} A promise that rejects when the timeout expires.
 */
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Sends a GET or POST request and parses the JSON response.
 *
 * @param {string} url Request URL.
 * @param {Object} [postData] Optional data to send in a POST request.
 * @returns {Promise<Object>} Parsed API response.
 * @throws {Error} If the request times out or the API returns an error.
 */
export const AJAX = async function (url, postData = undefined) {
  try {
  const fetchPromise = postData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(postData),
    }) : fetch(url);
    
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json() 

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Sends a GET request and parses the JSON response.
 *
 * @param {string} url Request URL.
 * @returns {Promise<Object>} Parsed API response.
 * @throws {Error} If the request times out or the API returns an error.
 */
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Sends JSON data in a POST request and parses the response.
 *
 * @param {string} url Request URL.
 * @param {Object} postData Data to serialize into the request body.
 * @returns {Promise<Object>} Parsed API response.
 * @throws {Error} If the request times out or the API returns an error.
 */
export const sendJSON = async function (url, postData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(postData),
    });
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
