import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useEffect, useRef, useState } from "react";
import { Loader, Search } from "react-feather";

import { Input } from "@/components/ui/input";

interface IProps {
  onChange: (value: string) => void;
  loading?: boolean;
  initialValue?: string;
  shouldAutoFocus?: boolean;
}

export function FormSearch({
  onChange,
  loading,
  initialValue,
  shouldAutoFocus,
}: IProps) {
  const { _ } = useLingui();
  const [value, setValue] = useState(initialValue || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldAutoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldAutoFocus, value]);

  return (
    <div className="relative flex w-full">
      <button
        className="border-b border-border pl-3 text-primary"
        type="button"
      >
        {loading ? (
          <Loader className="mr-2 size-4 shrink-0 animate-spin" />
        ) : (
          <Search className="mr-2 size-4 shrink-0" />
        )}
      </button>
      <Input
        className="rounded-none border-x-0 border-t-0 px-1 focus-visible:ring-0"
        type="search"
        value={value}
        onChange={(e) => {
          onChange(e.target.value.toLowerCase());
          setValue(e.target.value);
        }}
        onBlur={(e) => {
          if (["listbox", "option"].includes(e.relatedTarget?.role)) {
            e.target.focus();
          }
        }}
        placeholder={_(msg`Search`)}
        ref={inputRef}
      />
    </div>
  );
}
