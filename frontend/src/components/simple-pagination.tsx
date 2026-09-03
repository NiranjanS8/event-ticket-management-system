import { SpringBootPagination } from "@/domain/domain";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimplePaginationProps<T> {
  pagination: SpringBootPagination<T>;
  onPageChange: (page: number) => void;
}

export function SimplePagination<T>({
  pagination,
  onPageChange,
}: SimplePaginationProps<T>) {
  const currentPage = pagination.number;
  const totalPages = pagination.totalPages;
  const canGoPrevious = !pagination.first;
  const canGoNext = !pagination.last;

  return (
    <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
      <button
        aria-label="Previous page"
        disabled={!canGoPrevious}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-all duration-200 hover:border-foreground/30 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span>
        {currentPage + 1} / {totalPages}
      </span>
      <button
        aria-label="Next page"
        disabled={!canGoNext}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-all duration-200 hover:border-foreground/30 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
