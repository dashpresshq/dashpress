import ReactPaginate from "react-paginate";
import { Trans, msg } from "@lingui/macro";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "react-feather";
import { fakeMessageDescriptor } from "translations/fake";
import { TABLE_PAGE_SIZES } from "./constants";
import { Select } from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  "text-primary border border-primary-alpha hover:bg-primary-alpha hover:text-primary-alpha-text"
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
      <div className="flex items-center flex-col gap-2 md:flex-row md:justify-between">
        <div className="flex gap-2 items-center">
          <Trans>
            Showing
            <Select
              placeholder={msg`Select Page Size`}
              name="table-page-size"
              className="w-18"
              options={TABLE_PAGE_SIZES.map((option) => ({
                value: `${option}`,
                label: fakeMessageDescriptor(`${option}`),
              }))}
              onChange={(value) => setPageSize(Number(value))}
              value={`${pageSize}`}
            />{" "}
            of <b>{Intl.NumberFormat("en-US").format(totalRecords)}</b> results
          </Trans>
        </div>
        <nav role="navigation" aria-label="pagination">
          <ReactPaginate
            previousLabel={<ChevronLeft className="h-4 w-4" />}
            nextLabel={<ChevronRight className="h-4 w-4" />}
            breakLabel={<MoreHorizontal className="h-4 w-4" />}
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
