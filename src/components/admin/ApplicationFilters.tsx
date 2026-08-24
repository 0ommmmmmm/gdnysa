import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  APPLICATION_STATUSES,
  MENTORSHIP_PROGRAMS,
  TARGET_EXAMS,
  emptyApplicationFilters,
  type ApplicationFilterState,
} from "@/types/admin";

interface ApplicationFiltersProps {
  value: ApplicationFilterState;
  onChange: (value: ApplicationFilterState) => void;
}

export function ApplicationFilters({ value, onChange }: ApplicationFiltersProps) {
  const set = <K extends keyof ApplicationFilterState>(
    key: K,
    v: ApplicationFilterState[K]
  ) => onChange({ ...value, [key]: v });

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Search by name, email or phone"
          className="pl-9"
          aria-label="Search applications"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
        <Select value={value.status} onValueChange={(v) => set("status", v as ApplicationFilterState["status"])}>
          <SelectTrigger className="sm:w-[150px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All statuses</SelectItem>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.target_exam} onValueChange={(v) => set("target_exam", v)}>
          <SelectTrigger className="sm:w-[170px]" aria-label="Filter by target exam">
            <SelectValue placeholder="Target exam" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All exams</SelectItem>
            {TARGET_EXAMS.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.preferred_program} onValueChange={(v) => set("preferred_program", v)}>
          <SelectTrigger className="sm:w-[180px]" aria-label="Filter by program">
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All programs</SelectItem>
            {MENTORSHIP_PROGRAMS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={() => onChange(emptyApplicationFilters)}>
        Reset
      </Button>
    </div>
  );
}
