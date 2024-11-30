export default function getPaginationRange(
  currentPage: number | undefined,
  totalPages: number | undefined
): (number | -1 | -2)[] {
  const visiblePages = 3;
  const result: (number | -1 | -2)[] = [];

  if (totalPages && currentPage) {
    if (totalPages <= visiblePages + 2) {
      // If total pages are less than or equal to 5, show all pages
      for (let i = 1; i <= totalPages; i++) {
        result.push(i);
      }
    } else {
      // Always include the first page
      result.push(1);

      const start = Math.max(2, currentPage - 1); // Start page, ensuring it's at least 2
      const end = Math.min(totalPages - 1, currentPage + 1); // End page, ensuring it's not greater than totalPages - 1

      if (start > 2) {
        result.push(-1); // "..." before the current page range
      }

      // Add the page range (currentPage - 1 to currentPage + 1)
      for (let i = start; i <= end; i++) {
        result.push(i);
      }

      if (end < totalPages - 1) {
        result.push(-2); // "..." after the current page range
      }

      // Always include the last page
      result.push(totalPages);
    }
  }

  return result;
}
