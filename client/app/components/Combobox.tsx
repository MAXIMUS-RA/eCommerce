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

interface CategoryItem {
  id: number;
  name: string;
}

interface Categories {
  categories?: CategoryItem[];
  onCategorySelect?: (categoryId: number | undefined) => void; 
  selectedCategoryId?: number; 
}

export function Combobox({
  categories,
  onCategorySelect,
  selectedCategoryId,
}: Categories) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<number | undefined>(
    selectedCategoryId
  );

  React.useEffect(() => {
    setValue(selectedCategoryId);
  }, [selectedCategoryId]);

  const handleSelect = (categoryId: number) => {
    const newValue = categoryId === value ? undefined : categoryId;
    setValue(newValue);
    setOpen(false);

    if (onCategorySelect) {
      setTimeout(() => {
        onCategorySelect(newValue);
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
          className="w-[200px] justify-between"
        >
          {value
            ? categories?.find((category) => category.id === value)?.name
            : "Виберіть категорію ..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Пошук категорії..." className="h-9" />
          <CommandList>
            <CommandEmpty>Категорія не знайдена.</CommandEmpty>
            <CommandGroup>
              {categories?.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => handleSelect(category.id)}
                >
                  {category.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === category.id ? "opacity-100" : "opacity-0"
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
