export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

  return `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;
}
