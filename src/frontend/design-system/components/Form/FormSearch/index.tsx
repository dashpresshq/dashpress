import React from "react";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { SystemIcon } from "frontend/design-system/Icons/System";
import { Input } from "../Styles";
import { StyledBaseButton } from "../../Button/Button";

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
  & > input {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    min-width: 0;
    margin-bottom: 0;
  }
`;

const InputGroupPrepend = styled.span`
  margin-right: -1px;
  display: flex;
`;

const ButtonSearch = styled(StyledBaseButton)`
  border-bottom: 1px solid ${USE_ROOT_COLOR("border-color")};
  border-radius: 0;
  color: ${USE_ROOT_COLOR("primary-color")};
  &:focus {
    box-shadow: none;
  }
`;

const FormSearchStyled = styled(Input)`
  border-radius: 0;
  border-top: 0;
  border-left: 0;
  box-shadow: none;
  border-right: 0;
  height: calc(1.8em + 0.75rem + 10px);
  padding-left: 0.75rem;

  &:focus {
    border-color: ${USE_ROOT_COLOR("border-color")};
  }
`;

interface IProps {
  onChange: (value: string) => void;
}

export function FormSearch({ onChange }: IProps) {
  return (
    <InputGroup>
      <FormSearchStyled
        type="search"
        onChange={(e) => onChange(e.target.value.toLowerCase())}
        placeholder="Search"
      />
      <InputGroupPrepend>
        <ButtonSearch type="button">
          <SystemIcon icon="Search" size={18} />
        </ButtonSearch>
      </InputGroupPrepend>
    </InputGroup>
  );
}
