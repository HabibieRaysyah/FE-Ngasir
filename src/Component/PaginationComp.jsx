import { Pagination } from "flowbite-react";

export default function PaginationComp({onPageChange , currentPage, maxPage}) {
  return (
    <div className="flex overflow-x-auto sm:justify-center mt-3">
      <Pagination
        layout="pagination"
        currentPage={currentPage}
        totalPages={maxPage}
        onPageChange={onPageChange}
        previousLabel="Go back"
        nextLabel="Go forward"
        showIcons
      />
    </div>
  );
}