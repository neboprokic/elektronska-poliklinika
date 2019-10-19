import { forwardTo } from 'utils/route';

const apiUrl = 'http://localhost:3003';

const getResponseBody = response => {
  const contentType = response.headers.get('Content-Type') || '';

  return contentType.includes('application/json') ? response.json() : response;
};

const getQueryString = params => {
  if (!params || !Object.keys(params).length) return '';

  const queryParams = Object.keys(params).map(key => `${key}=${params[key]}`);

  return `?${queryParams.join('&')}`;
};

const request = async ({ url, method, data, query }) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');

    if (token) headers.token = token;

    const response = await fetch(`${apiUrl}${url}${getQueryString(query)}`, {
      method,
      body: JSON.stringify(data),
      mode: 'cors',
      headers,
      redirect: 'follow',
    });

    if (response.status === 401 || response.status === 403) {
      forwardTo('/login');

      return;
    }

    if (!response.ok) {
      const responseBody = await getResponseBody(response);
      throw new Error(
        JSON.stringify({ status: response.status, ...responseBody }),
      );
    }

    return getResponseBody(response);
  } catch (error) {
    console.log('api error', error.message);

    throw error;
  }
};

export default {
  get: (url, query = {}) => request({ url, query, method: 'GET' }),
  post: (url, data = {}) => request({ url, data, method: 'POST' }),
  put: (url, data = {}) => request({ url, data, method: 'PUT' }),
  delete: (url, data = {}) => request({ url, data, method: 'DELETE' }),
};
