import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  KNOWLEDGE_CATEGORIES,
  createKnowledge,
  deleteKnowledge,
  listKnowledge,
  updateKnowledge,
  type KnowledgeEntry,
} from "@/services/knowledge";

const emptyDraft = {
  category: "about",
  title: "",
  content: "",
  keywords: "",
  priority: 0,
  is_active: true,
};

type Draft = typeof emptyDraft;

export default function AdminKnowledge() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState<KnowledgeEntry | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setEntries(await listKnowledge());
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not load knowledge",
        description: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesCategory = category === "all" || e.category === category;
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        (e.keywords ?? []).some((k) => k.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [entries, search, category]);

  const openCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setDialogOpen(true);
  };

  const openEdit = (entry: KnowledgeEntry) => {
    setEditing(entry);
    setDraft({
      category: entry.category,
      title: entry.title,
      content: entry.content,
      keywords: (entry.keywords ?? []).join(", "),
      priority: entry.priority,
      is_active: entry.is_active,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!draft.title.trim() || !draft.content.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Title and content are required.",
      });
      return;
    }
    setSaving(true);
    const payload = {
      category: draft.category,
      title: draft.title.trim(),
      content: draft.content.trim(),
      keywords: draft.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      priority: Number(draft.priority) || 0,
      is_active: draft.is_active,
    };
    try {
      if (editing) await updateKnowledge(editing.id, payload);
      else await createKnowledge(payload);
      toast({ title: editing ? "Knowledge updated" : "Knowledge added" });
      setDialogOpen(false);
      await load();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: (err as Error).message,
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (entry: KnowledgeEntry) => {
    try {
      await updateKnowledge(entry.id, { is_active: !entry.is_active });
      await load();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: (err as Error).message,
      });
    }
  };

  const remove = async (entry: KnowledgeEntry) => {
    if (!window.confirm(`Delete "${entry.title}"? This cannot be undone.`)) return;
    try {
      await deleteKnowledge(entry.id);
      toast({ title: "Knowledge deleted" });
      await load();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: (err as Error).message,
      });
    }
  };

  return (
    <AdminLayout title="AI Knowledge Base">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Content the G-Dnyasa AI Assistant uses to answer visitor questions.
          </p>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add knowledge
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, content or keywords"
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {KNOWLEDGE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card py-16 text-center text-muted-foreground">
            No knowledge entries match your filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry) => (
              <div key={entry.id} className="glass-card space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        {entry.title}
                      </h3>
                      <Badge variant="secondary">{entry.category}</Badge>
                      <Badge variant="outline">priority {entry.priority}</Badge>
                      {!entry.is_active && (
                        <Badge variant="destructive">inactive</Badge>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                      {entry.content}
                    </p>
                    {entry.keywords?.length > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Keywords: {entry.keywords.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={entry.is_active}
                      onCheckedChange={() => void toggleActive(entry)}
                      aria-label="Toggle active"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(entry)}
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void remove(entry)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editing ? "Edit knowledge" : "Add knowledge"}
            </DialogTitle>
            <DialogDescription>
              This content is supplied to the assistant as reference material.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => setDraft({ ...draft, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KNOWLEDGE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={draft.priority}
                  onChange={(e) =>
                    setDraft({ ...draft, priority: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                rows={10}
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Input
                id="keywords"
                value={draft.keywords}
                onChange={(e) => setDraft({ ...draft, keywords: e.target.value })}
                placeholder="full course, fees, price"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="active"
                checked={draft.is_active}
                onCheckedChange={(v) => setDraft({ ...draft, is_active: v })}
              />
              <Label htmlFor="active">Active (used by the assistant)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void save()} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
