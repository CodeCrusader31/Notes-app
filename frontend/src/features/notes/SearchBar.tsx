import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  search: string;
  tag: string;
  showPinnedOnly: boolean;
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onPinnedChange: (value: boolean) => void;
}

export function SearchBar({
  search,
  tag,
  showPinnedOnly,
  onSearchChange,
  onTagChange,
  onPinnedChange,
}: SearchBarProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-ink-100 bg-white p-3 lg:grid-cols-[1fr_220px_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
        <Input
          aria-label="Search notes"
          className="pl-10"
          placeholder="Search title, content, or tags"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <Input
        aria-label="Filter by tag"
        placeholder="Filter tag"
        value={tag}
        onChange={(event) => onTagChange(event.target.value)}
      />
      <div className="flex gap-2">
        <Button
          className="flex-1"
          icon={<SlidersHorizontal size={16} />}
          type="button"
          variant={showPinnedOnly ? "primary" : "secondary"}
          onClick={() => onPinnedChange(!showPinnedOnly)}
        >
          Pinned
        </Button>
        {(search || tag || showPinnedOnly) ? (
          <Button
            aria-label="Clear filters"
            icon={<X size={16} />}
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => {
              onSearchChange("");
              onTagChange("");
              onPinnedChange(false);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
