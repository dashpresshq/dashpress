import { msg, Trans } from "@lingui/macro";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "react-feather";
import ReactPaginate from "react-paginate";

import { buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { TABLE_PAGE_SIZES } from "./constants";

interface IProps {
  setPageSize: (pageSize: number) => void;
  gotoPage: (page: number) => void;
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPageCount: number;
}

const className = cn(
  buttonVariants({ variant: "ghost" }),
  "border border-primary-alpha text-primary hover:bg-primary-alpha hover:text-primary-alpha-text"
);

export function TablePagination({
  setPageSize,
  gotoPage,
  totalRecords,
  pageIndex,
  pageSize,
  totalPageCount,
}: IProps) {
  if (totalPageCount === 0) {
    return null;
  }
  return (
    <div className="px-3 py-2">
      <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Select
            placeholder={msg`Select Page Size`}
            name="table-page-size"
            className="w-28"
            options={TABLE_PAGE_SIZES.map((option) => ({
              value: `${option}`,
              label: msg`${option} / Page`,
            }))}
            onChange={(value) => setPageSize(Number(value))}
            value={`${pageSize}`}
          />{" "}
          of <b>{Intl.NumberFormat("en-US").format(totalRecords)}</b>{" "}
          <Trans> results </Trans>
        </div>
        <nav role="navigation" aria-label="pagination">
          <ReactPaginate
            previousLabel={<ChevronLeft className="size-4" />}
            nextLabel={<ChevronRight className="size-4" />}
            breakLabel={<MoreHorizontal className="size-4" />}
            pageCount={totalPageCount}
            renderOnZeroPageCount={() => null}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            forcePage={pageIndex}
            breakLinkClassName={className}
            pageLinkClassName={className}
            nextLinkClassName={className}
            breakClassName="hidden md:inline-block"
            pageClassName="hidden md:inline-block"
            previousLinkClassName={className}
            disabledLinkClassName="opacity-70 cursor-not-allowed"
            containerClassName="flex flex-row items-center gap-1"
            activeLinkClassName="!bg-primary-alpha !text-primary-alpha-text"
            onPageChange={({ selected }) => {
              gotoPage(selected);
            }}
          />
        </nav>
      </div>
    </div>
  );
}
