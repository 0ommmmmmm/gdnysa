import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ProgramModal } from "@/components/programs/ProgramModal";
import { getProgram, type Program } from "@/data/programs";

interface ProgramModalContextValue {
  openProgram: (programOrId: Program | string) => void;
  closeProgram: () => void;
}

const ProgramModalContext = createContext<ProgramModalContextValue | null>(null);

export function useProgramModal(): ProgramModalContextValue {
  const ctx = useContext(ProgramModalContext);
  if (!ctx) {
    throw new Error("useProgramModal must be used within ProgramModalProvider");
  }
  return ctx;
}

export function ProgramModalProvider({ children }: { children: ReactNode }) {
  const [program, setProgram] = useState<Program | null>(null);
  const [open, setOpen] = useState(false);

  const openProgram = useCallback((programOrId: Program | string) => {
    const next =
      typeof programOrId === "string" ? getProgram(programOrId) : programOrId;
    if (!next) return;
    setProgram(next);
    setOpen(true);
  }, []);

  const closeProgram = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openProgram, closeProgram }),
    [openProgram, closeProgram]
  );

  return (
    <ProgramModalContext.Provider value={value}>
      {children}
      <ProgramModal program={program} open={open} onOpenChange={setOpen} />
    </ProgramModalContext.Provider>
  );
}
