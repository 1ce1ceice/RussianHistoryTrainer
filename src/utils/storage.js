const STORAGE_KEY = 'historyTrainerResults';

export function getResults() {
  const rawResults = localStorage.getItem(STORAGE_KEY);
  return rawResults ? JSON.parse(rawResults) : [];
}

export function saveResult(result) {
  const results = getResults();
  const updatedResults = [result, ...results];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
}

export function clearResults() {
  localStorage.removeItem(STORAGE_KEY);
}
