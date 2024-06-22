import ReactPaginate from "react-paginate";

import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Trans, msg } from "@lingui/macro";
import { ChevronLeft, ChevronRight } from "react-feather";
import { i18nNoop } from "translations/fake";
import { TABLE_PAGE_SIZES } from "./constants";
import { Select } from "@/components/ui/select";

const Pagination = styled.div`
  .pagination {
    display: flex;
    padding-left: 0;
    list-style: none;
  }

  .page-link {
    padding: 0.25rem 0.5rem;
    margin-left: 6px;
    font-size: 0.8rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${USE_ROOT_COLOR("primary-color")};
    border: 1px solid ${USE_ROOT_COLOR("primary-color")};

    &:hover {
      color: ${USE_ROOT_COLOR("text-on-primary")};
      background-color: ${USE_ROOT_COLOR("primary-color")};
      border-color: ${USE_ROOT_COLOR("primary-color")};
    }
  }

  .page-item.active {
    .page-link {
      color: ${USE_ROOT_COLOR("text-on-primary")};
      background-color: ${USE_ROOT_COLOR("primary-color")};
      border-color: ${USE_ROOT_COLOR("primary-color")};
    }
  }

  .page-item.disabled {
    .page-link {
      cursor: not-allowed;
      color: ${USE_ROOT_COLOR("muted-text")};
      border-color: ${USE_ROOT_COLOR("border-color")};
    }
  }
`;

const DirectionIcon = styled.i`
  height: 20px;
`;

const Root = styled.div``;

interface IProps {
  setPageSize: (pageSize: number) => void;
  gotoPage: (page: number) => void;
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPageCount: number;
}

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
    <Root className="px-3 py-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Trans>
            Showing
            <Select
              placeholder={msg`Select Page Size`}
              name="table-page-size"
              className="w-14"
              options={TABLE_PAGE_SIZES.map((option) => ({
                value: `${option}`,
                label: i18nNoop(option),
              }))}
              onChange={(value) => setPageSize(Number(value))}
              value={`${pageSize}`}
            />{" "}
            entries of <b>{Intl.NumberFormat("en-US").format(totalRecords)}</b>{" "}
            results
          </Trans>
        </div>
        <Pagination>
          <ReactPaginate
            previousLabel={<DirectionIcon as={ChevronLeft} size={16} />}
            nextLabel={<DirectionIcon as={ChevronRight} size={16} />}
            breakLabel="..."
            pageCount={totalPageCount}
            renderOnZeroPageCount={() => null}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            breakClassName="page-item"
            nextClassName="page-item"
            forcePage={pageIndex}
            previousClassName="page-item"
            pageClassName="page-item"
            breakLinkClassName="page-link"
            pageLinkClassName="page-link"
            nextLinkClassName="page-link"
            previousLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            onPageChange={({ selected }) => {
              gotoPage(selected);
            }}
          />
        </Pagination>
      </div>
    </Root>
  );
}
