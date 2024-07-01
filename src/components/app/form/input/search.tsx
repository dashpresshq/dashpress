import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Loader, Search } from "react-feather";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface IProps {
  onChange: (value: string) => void;
  loading?: boolean;
  initialValue?: string;
}

export function FormSearch({ onChange, loading, initialValue }: IProps) {
  const { _ } = useLingui();

  const [value, setValue] = useState(initialValue || "");

  return (
    <div className="relative flex w-full">
      <button
        className="text-primary pl-3 border-b border-border"
        type="button"
      >
        {loading ? (
          <Loader className="animate-spin mr-2 h-4 w-4 shrink-0" />
        ) : (
          <Search className="mr-2 h-4 w-4 shrink-0" />
        )}
      </button>
      <Input
        className="rounded-none focus-visible:ring-0 px-1 border-t-0 border-x-0"
        type="search"
        value={value}
        onChange={(e) => {
          onChange(e.target.value.toLowerCase());
          setValue(e.target.value);
        }}
        placeholder={_(msg`Search`)}
      />
    </div>
  );
}
