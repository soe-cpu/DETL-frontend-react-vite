export default function getPaginationRange(
  currentPage: number | 0,
  totalPages: number | 0
) {
  const visiblePages = 3;
  const result = [];

  if (totalPages <= visiblePages + 2) {
    for (let i = 1; i <= totalPages; i++) {
      result.push(i);
    }
  } else {
    result.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      result.push(-1); // "..." before
    }

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    if (end < totalPages - 1) {
      result.push(-2); // "..." after
    }

    result.push(totalPages);
  }

  return result;
}
