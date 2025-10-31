"use client";

import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/registry/default/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/default/ui/field";

const items = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "grape", label: "Grape" },
  { value: "strawberry", label: "Strawberry" },
  { value: "mango", label: "Mango" },
  { value: "pineapple", label: "Pineapple" },
  { value: "kiwi", label: "Kiwi" },
  { value: "peach", label: "Peach" },
  { value: "pear", label: "Pear" },
];

export default function FieldComboboxDemo() {
  return (
    <Field>
      <FieldLabel>Fruits</FieldLabel>
      <Combobox items={items}>
        <ComboboxInput
          aria-label="Select an item"
          placeholder="Select an item..."
        />
        <ComboboxPopup>
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
      <FieldDescription>Select a item.</FieldDescription>
    </Field>
  );
}
