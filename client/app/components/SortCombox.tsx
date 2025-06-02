"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export type SortByType =
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc"
  | "created_desc"
  | "created_asc"
  | undefined;

interface SortOptions {
  onSortSelect?: (sortOption: SortByType) => void;
  selectedSortOption?: SortByType;
}

const sortOptions: { id: string; name: string; label: string }[] = [
  { id: "price_asc", name: "price_asc", label: "Ціна: від низької до високої" },
  { id: "price_desc", name: "price_desc", label: "Ціна: від високої до низької" },
  { id: "name_asc", name: "name_asc", label: "Назва: А-Я" },
  { id: "name_desc", name: "name_desc", label: "Назва: Я-А" },
  { id: "created_desc", name: "created_desc", label: "Спочатку нові" },
  { id: "created_asc", name: "created_asc", label: "Спочатку старі" },
];

export function SortCombox({
  onSortSelect,
  selectedSortOption,
}: SortOptions) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<SortByType>(
    selectedSortOption
  );

  React.useEffect(() => {
    setValue(selectedSortOption);
  }, [selectedSortOption]);

  const handleSelect = (sortId: string) => {
    const newValue = (sortId === value ? undefined : sortId) as SortByType;
    setValue(newValue);
    setOpen(false);

    if (onSortSelect) {
      setTimeout(() => {
        onSortSelect(newValue);
      }, 0);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {value
            ? sortOptions?.find((option) => option.id === value)?.label
            : "Сортувати за..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Пошук сортування..." className="h-9" />
          <CommandList>
            <CommandEmpty>Варіант сортування не знайдено.</CommandEmpty>
            <CommandGroup>
              {sortOptions?.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.label}
                  onSelect={() => handleSelect(option.id)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}