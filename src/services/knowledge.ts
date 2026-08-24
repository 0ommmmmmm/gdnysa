import { supabase } from "@/integrations/supabase/client";

export const KNOWLEDGE_CATEGORIES = [
  "about",
  "programs",
  "mentorship",
  "full-course",
  "masterclass",
  "career-guidance",
  "pyq-solving",
  "csir-net",
  "gate",
  "iit-jam",
  "gsi",
  "university-exams",
  "mentors",
  "fees",
  "enrollment",
  "resources",
  "tours",
  "store",
  "contact",
  "faq",
] as const;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

export interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeInput {
  category: string;
  title: string;
  content: string;
  keywords: string[];
  priority: number;
  is_active: boolean;
}

const TABLE = "gdnyasa_knowledge";

// The generated Supabase types predate this table, so the client is loosened here.
const db = supabase as unknown as {
  from: (table: string) => any;
};

export async function listKnowledge(): Promise<KnowledgeEntry[]> {
  const { data, error } = await db
    .from(TABLE)
    .select("*")
    .order("priority", { ascending: false })
    .order("title", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as KnowledgeEntry[];
}

export async function createKnowledge(input: KnowledgeInput): Promise<void> {
  const { error } = await db.from(TABLE).insert(input);
  if (error) throw new Error(error.message);
}

export async function updateKnowledge(
  id: string,
  input: Partial<KnowledgeInput>,
): Promise<void> {
  const { error } = await db
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteKnowledge(id: string): Promise<void> {
  const { error } = await db.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
