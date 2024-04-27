import ReactPaginate from "react-paginate";

import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Trans, msg } from "@lingui/macro";
import { ChevronLeft, ChevronRight } from "react-feather";
import { i18nNoop } from "shared/lib/noop";
import { SimpleSelect } from "../Form/FormSelect/Simple";
import { TABLE_PAGE_SIZES } from "./constants";

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

const Root = styled.div`
  background: ${USE_ROOT_COLOR("base-color")};
  padding: 0 0.5rem;
`;

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
    <Root>
      <Stack $justify="space-between" $align="center">
        <Typo.MD>
          <Trans>
            Showing{" "}
            <SimpleSelect
              width={55}
              options={TABLE_PAGE_SIZES.map((option) => ({
                value: `${option}`,
                label: msg`${i18nNoop(option)}`,
              }))}
              onChange={(value) => setPageSize(Number(value))}
              value={pageSize}
            />{" "}
            entries of <b>{Intl.NumberFormat("en-US").format(totalRecords)}</b>{" "}
            results
          </Trans>
        </Typo.MD>
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
      </Stack>
    </Root>
  );
}
