import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ArrowRight,
  Eraser,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { streamChatReply, type ChatMessage } from "@/services/chat";
import { PROGRAMS, type Program } from "@/data/programs";
import { useProgramModal } from "@/components/programs/ProgramModalProvider";
import { cn } from "@/lib/utils";

const WELCOME = `Namaste! 👋

I'm the G-Dnyasa AI Assistant.

I can help you learn about our personalized mentorship, programs, geology exams, resources, enrollment and more.

How can I help you?`;

const SUGGESTIONS = [
  "What programs do you offer?",
  "What is the Full Course?",
  "What is One Topic Masterclass?",
  "How does Career Guidance work?",
  "What is PYQ Solving?",
  "When does the Full Course start?",
  "How can I join G-Dnyasa?",
];

const newId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const welcomeMessage = (): ChatMessage => ({
  id: "welcome",
  role: "assistant",
  content: WELCOME,
});

/** Programmes explicitly named in an assistant reply become clickable actions. */
function programsMentioned(text: string): Program[] {
  const lower = text.toLowerCase();
  return PROGRAMS.filter((p) => lower.includes(p.title.toLowerCase()));
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage()]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);

  const navigate = useNavigate();
  const { openProgram } = useProgramModal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;

      setError(null);
      setLastQuestion(text);
      setInput("");

      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const userMessage: ChatMessage = {
        id: newId(),
        role: "user",
        content: text,
      };
      const replyId = newId();

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: replyId, role: "assistant", content: "" },
      ]);
      setBusy(true);

      try {
        await streamChatReply(text, history, (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === replyId ? { ...m, content: m.content + chunk } : m,
            ),
          );
        });
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== replyId));
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Sorry, I'm temporarily unable to respond. Please try again in a moment.",
        );
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [busy, messages],
  );

  const retry = () => {
    if (!lastQuestion) return;
    // Drop the failed exchange before retrying.
    setMessages((prev) => {
      const idx = [...prev]
        .reverse()
        .findIndex((m) => m.role === "user" && m.content === lastQuestion);
      if (idx === -1) return prev;
      return prev.slice(0, prev.length - 1 - idx);
    });
    setError(null);
    void send(lastQuestion);
  };

  const clear = () => {
    setMessages([welcomeMessage()]);
    setError(null);
    setLastQuestion(null);
    inputRef.current?.focus();
  };

  const joinProgram = (program: Program) => {
    setOpen(false);
    navigate(`/join?program=${encodeURIComponent(program.enrollmentValue)}`);
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close G-Dnyasa Assistant" : "Ask G-Dnyasa"}
        aria-expanded={open}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-primary/30 bg-primary px-5 py-3 text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
        <span className="hidden text-sm font-medium sm:inline">
          {open ? "Close" : "Ask G-Dnyasa"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="G-Dnyasa Assistant"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="glass-card fixed bottom-24 right-3 left-3 z-50 flex max-h-[75vh] flex-col overflow-hidden p-0 sm:left-auto sm:right-5 sm:w-[400px] md:max-h-[600px]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border/60 bg-secondary/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-base font-semibold text-foreground">
                    G-Dnyasa Assistant
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your AI guide to G-Dnyasa
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Clear conversation"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                >
                  <Eraser className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              {messages.map((m) => {
                const actions =
                  m.role === "assistant" && m.content
                    ? programsMentioned(m.content)
                    : [];
                return (
                  <div key={m.id} className="space-y-2">
                    <div
                      className={cn(
                        "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-foreground",
                      )}
                    >
                      {m.role === "assistant" ? (
                        m.content ? (
                          <div className="prose prose-sm max-w-none text-foreground prose-headings:font-serif prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <span className="flex gap-1 py-1" aria-label="Typing">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="h-2 w-2 animate-bounce rounded-full bg-primary/60"
                                style={{ animationDelay: `${i * 0.15}s` }}
                              />
                            ))}
                          </span>
                        )
                      ) : (
                        <span className="whitespace-pre-wrap">{m.content}</span>
                      )}
                    </div>

                    {actions.length > 0 && !busy && (
                      <div className="flex flex-wrap gap-2">
                        {actions.map((p) => (
                          <div key={p.id} className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openProgram(p)}
                              className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/60"
                            >
                              View {p.title}
                            </button>
                            <button
                              type="button"
                              onClick={() => joinProgram(p)}
                              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              Join {p.title}
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-foreground">
                  <p>{error}</p>
                  {lastQuestion && (
                    <button
                      type="button"
                      onClick={retry}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Retry
                    </button>
                  )}
                </div>
              )}

              {messages.length === 1 && !busy && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary/60"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t border-border/60 bg-background/40 p-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  rows={1}
                  maxLength={1000}
                  placeholder="Ask about programs, exams, enrollment…"
                  aria-label="Message G-Dnyasa Assistant"
                  className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-border/70 bg-background/70 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send message"
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Enter to send · Shift + Enter for a new line
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
