import { getAllBlogs } from "@/actions/blog.action";
import BlogCard from "@/components/BlogCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Ensure this path is correct after 'npx shadcn-ui add pagination'

const ITEMS_PER_PAGE = 5;

// This is a placeholder; the actual implementation might differ.
// type Blog = Awaited<ReturnType<typeof getAllBlogs>> extends (infer U)[]
//   ? U
//   : never; // Extract Blog type

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams: initialSearchParams, // Renamed prop
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Speculatively "await" the searchParams prop
  const searchParams = await Promise.resolve(initialSearchParams);

  // Simplified currentPage derivation for diagnostics
  let currentPage = 1;
  if (searchParams && typeof searchParams.page === "string") {
    const parsedPage = parseInt(searchParams.page, 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      currentPage = parsedPage;
    }
  }

  // TODO: Modify getAllBlogs to support pagination
  // For now, we'll fetch all and manually paginate to build the UI.
  // This is NOT performant and should be replaced with true backend pagination.
  const allBlogs = await getAllBlogs();
  const totalCount = allBlogs.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const paginatedBlogs = allBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  // End of temporary pagination logic

  /* 
  // Ideal data fetching (once getAllBlogs is updated):
  const { blogs: paginatedBlogs, totalCount } = await getAllBlogs({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  }) as PaginatedBlogsResponse; // Type assertion for clarity
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  */

  return (
    <div className="">
      {paginatedBlogs.length === 0 && totalCount > 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No blogs found on this page.
          </p>
          <PaginationLink href="/?page=1" className="mt-4 inline-block">
            Go to First Page
          </PaginationLink>
        </div>
      )}
      {paginatedBlogs.length === 0 && totalCount === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No blogs have been posted yet.
          </p>
          {/* Optionally, add a link to the /write page */}
        </div>
      )}
      {paginatedBlogs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
          {/* Changed lg:grid-cols-1 to display one card per row for a cleaner look with new card design */}
          {paginatedBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? `/?page=${currentPage - 1}` : "#"}
                aria-disabled={currentPage <= 1}
                className={
                  currentPage <= 1
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>

            {/* Basic pagination numbers - can be enhanced with ellipsis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={`/?page=${pageNumber}`}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href={
                  currentPage < totalPages ? `/?page=${currentPage + 1}` : "#"
                }
                aria-disabled={currentPage >= totalPages}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
