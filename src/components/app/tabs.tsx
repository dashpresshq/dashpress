import { useState, useEffect, ReactNode } from "react";
import { sluggify } from "shared/lib/strings";
import { MessageDescriptor } from "@lingui/core";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useLingui } from "@lingui/react";
import { TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface IProps {
  contents: {
    label: MessageDescriptor;
    id: string;
    content: ReactNode;
  }[];
  currentTab?: string;
  onChange?: (tab: string) => void;
}

export function Tabs({ contents, currentTab, onChange }: IProps) {
  const { _ } = useLingui();

  const [activeTab, setActiveTab$1] = useState<string>(
    sluggify(currentTab || _(contents[0].id))
  );

  const setActiveTab = (id: string) => {
    setActiveTab$1(id);
  };

  useEffect(() => {
    if (currentTab) {
      setActiveTab(currentTab);
    } else {
      setActiveTab(_(contents[0].id));
    }
  }, [currentTab, JSON.stringify(contents.map((content) => content.id))]);

  const changeTab = (tabId: string | null) => {
    if (!tabId) {
      return;
    }
    if (activeTab !== tabId) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  return (
    <TabsPrimitive.Root
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={changeTab}
    >
      <TabsList>
        {contents.map(({ label, id }) => (
          <TabsTrigger value={id} key={id}>
            {_(label)}
          </TabsTrigger>
        ))}
      </TabsList>
      {contents.map(({ id, content }) => (
        <TabsContent key={id} value={id}>
          {content}
        </TabsContent>
      ))}
    </TabsPrimitive.Root>
  );
}
