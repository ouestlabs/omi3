"use client";

import * as React from "react";

import {
  Combobox,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
} from "@/registry/default/ui/combobox";

// Grouped items demo
type Tag = { id: string; label: string; group: "Status" | "Priority" | "Team" };
type TagGroup = { value: string; items: Tag[] };

const tagsData: Tag[] = [
  // Status
  { id: "s-open", label: "Open", group: "Status" },
  { id: "s-in-progress", label: "In progress", group: "Status" },
  { id: "s-blocked", label: "Blocked", group: "Status" },
  { id: "s-resolved", label: "Resolved", group: "Status" },
  { id: "s-closed", label: "Closed", group: "Status" },
  // Priority
  { id: "p-low", label: "Low", group: "Priority" },
  { id: "p-medium", label: "Medium", group: "Priority" },
  { id: "p-high", label: "High", group: "Priority" },
  { id: "p-urgent", label: "Urgent", group: "Priority" },
  // Team
  { id: "t-design", label: "Design", group: "Team" },
  { id: "t-frontend", label: "Frontend", group: "Team" },
  { id: "t-backend", label: "Backend", group: "Team" },
  { id: "t-devops", label: "DevOps", group: "Team" },
  { id: "t-qa", label: "QA", group: "Team" },
  { id: "t-mobile", label: "Mobile", group: "Team" },
  { id: "t-data", label: "Data", group: "Team" },
  { id: "t-security", label: "Security", group: "Team" },
  { id: "t-platform", label: "Platform", group: "Team" },
  { id: "t-infra", label: "Infrastructure", group: "Team" },
  { id: "t-product", label: "Product", group: "Team" },
  { id: "t-marketing", label: "Marketing", group: "Team" },
  { id: "t-sales", label: "Sales", group: "Team" },
  { id: "t-support", label: "Support", group: "Team" },
  { id: "t-research", label: "Research", group: "Team" },
  { id: "t-content", label: "Content", group: "Team" },
  { id: "t-analytics", label: "Analytics", group: "Team" },
  { id: "t-operations", label: "Operations", group: "Team" },
  { id: "t-finance", label: "Finance", group: "Team" },
  { id: "t-hr", label: "HR", group: "Team" },
  { id: "t-legal", label: "Legal", group: "Team" },
  { id: "t-growth", label: "Growth", group: "Team" },
  { id: "t-partner", label: "Partner", group: "Team" },
  { id: "t-community", label: "Community", group: "Team" },
  { id: "t-docs", label: "Docs", group: "Team" },
  { id: "t-l10n", label: "Localization", group: "Team" },
  { id: "t-a11y", label: "Accessibility", group: "Team" },
  { id: "t-sre", label: "SRE", group: "Team" },
  { id: "t-release", label: "Release", group: "Team" },
  { id: "t-architecture", label: "Architecture", group: "Team" },
  { id: "t-ux", label: "UX", group: "Team" },
  { id: "t-ui", label: "UI", group: "Team" },
  { id: "t-management", label: "Management", group: "Team" },
];

function groupTags(tags: Tag[]): TagGroup[] {
  const groups: Record<string, Tag[]> = {};
  for (const t of tags) {
    (groups[t.group] ??= []).push(t);
  }
  const order: Array<TagGroup["value"]> = ["Status", "Priority", "Team"];
  return order.map((value) => ({ value, items: groups[value] ?? [] }));
}

const groupedTags: TagGroup[] = groupTags(tagsData);

export default function ComboboxGrouped() {
  return (
    <Combobox items={groupedTags}>
      <div className="flex flex-col items-start gap-2">
        <ComboboxInput aria-label="Search tags" placeholder="e.g. feature" />
      </div>
      <ComboboxPopup>
        <ComboboxEmpty>No tags found.</ComboboxEmpty>
        <ComboboxList>
          {(group: TagGroup) => (
            <React.Fragment key={group.value}>
              <ComboboxGroup items={group.items}>
                <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
                <ComboboxCollection>
                  {(tag: Tag) => (
                    <ComboboxItem key={tag.id} value={tag}>
                      {tag.label}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
              {group.value !== "Team" && <ComboboxSeparator />}
            </React.Fragment>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
