interface PaginationInput {
  page?: unknown;
  limit?: unknown;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = ({ page, limit }: PaginationInput): PaginationOptions => {
  const parsedPage = Number(page ?? 1);
  const parsedLimit = Number(limit ?? 10);
  const safePage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const safeLimit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 10;

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

export const buildPaginationMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
