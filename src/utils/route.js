let history;

export function setHistory(appHistoryObj) {
  history = appHistoryObj;
}

export function forwardTo(location) {
  const { pathname, search } = window.location;

  if (location === `${pathname}${search}`) return;

  history.push(location);
}
