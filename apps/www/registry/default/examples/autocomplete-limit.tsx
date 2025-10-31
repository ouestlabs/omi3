"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui-components/react/autocomplete";
import * as React from "react";

import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteStatus,
} from "@/registry/default/ui/autocomplete";

// Limit results demo
const limit = 7;
type SimpleTag = { id: string; value: string };
const manyTags: SimpleTag[] = [
  { id: "lang-js", value: "JavaScript" },
  { id: "lang-ts", value: "TypeScript" },
  { id: "lang-py", value: "Python" },
  { id: "lang-java", value: "Java" },
  { id: "lang-csharp", value: "C#" },
  { id: "lang-cpp", value: "C++" },
  { id: "lang-c", value: "C" },
  { id: "lang-go", value: "Go" },
  { id: "lang-rust", value: "Rust" },
  { id: "lang-rb", value: "Ruby" },
  { id: "lang-php", value: "PHP" },
  { id: "lang-swift", value: "Swift" },
  { id: "lang-kotlin", value: "Kotlin" },
  { id: "lang-scala", value: "Scala" },
  { id: "lang-elixir", value: "Elixir" },
  { id: "lang-hs", value: "Haskell" },
  { id: "lang-dart", value: "Dart" },
  { id: "lang-objc", value: "Objective-C" },
  { id: "lang-julia", value: "Julia" },
  { id: "lang-r", value: "R" },
  { id: "lang-perl", value: "Perl" },
  { id: "lang-lua", value: "Lua" },
  { id: "lang-ocaml", value: "OCaml" },
  { id: "lang-fsharp", value: "F#" },
];

export default function AutocompleteLimit() {
  const [value, setValue] = React.useState("");
  const { contains } = AutocompletePrimitive.useFilter({ sensitivity: "base" });

  const totalMatches = React.useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed) return manyTags.length;
    return manyTags.filter((t) => contains(t.value, trimmed)).length;
  }, [value, contains]);

  const moreCount = Math.max(0, totalMatches - limit);

  return (
    <Autocomplete
      items={manyTags}
      limit={limit}
      onValueChange={setValue}
      value={value}
    >
      <AutocompleteInput placeholder="e.g. feature" />
      <AutocompletePopup>
        <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
        <AutocompleteList>
          {(tag: SimpleTag) => (
            <AutocompleteItem key={tag.id} value={tag}>
              {tag.value}
            </AutocompleteItem>
          )}
        </AutocompleteList>
        {moreCount > 0 && (
          <AutocompleteStatus>
            +{moreCount} more (keep typing to narrow down)
          </AutocompleteStatus>
        )}
      </AutocompletePopup>
    </Autocomplete>
  );
}
