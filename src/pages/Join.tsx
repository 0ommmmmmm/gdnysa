import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxBackground } from "@/components/animations/ParallaxBackground";
import { submitApplication } from "@/services/applications";
import { z } from "zod";
import { PROGRAM_OPTIONS, getProgramByEnrollmentValue } from "@/data/programs";

const targetExams = ["GATE Geology", "CSIR-NET", "IIT JAM", "University Exams"];
const programs = PROGRAM_OPTIONS;

const joinSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number too long")
    .regex(/^[+\d\s()-]+$/, "Phone may only contain digits and + ( ) - spaces"),
  targetExam: z.string().min(1, "Please select your target exam"),
  program: z.string().min(1, "Please select a program"),
  message: z.string().max(1000, "Message must be under 1000 characters").optional(),
});

type FormErrors = Partial<Record<keyof typeof initialState, string>>;

const initialState = {
  name: "",
  email: "",
  phone: "",
  targetExam: "",
  program: "",
  message: "",
};

export default function Join() {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();

  // Pre-select the programme chosen from a programme card / modal / assistant.
  const requestedProgram = searchParams.get("program") ?? "";
  useEffect(() => {
    if (!requestedProgram) return;
    const match = getProgramByEnrollmentValue(requestedProgram);
    if (match) {
      setFormData((prev) => ({ ...prev, program: match.enrollmentValue }));
    }
  }, [requestedProgram]);

  const selectedProgram = getProgramByEnrollmentValue(formData.program);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = joinSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof initialState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast({
        title: "Please fix the errors",
        description: "Some fields need your attention.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Isolated service call — Windsurf will swap this for the Supabase insert.
      await submitApplication({
        full_name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        target_exam: parsed.data.targetExam,
        preferred_program: parsed.data.program,
        message: parsed.data.message,
      });

      toast({
        title: "Registration submitted successfully.",
        description: "We'll reach out to you shortly with next steps.",
      });
      setSubmitted(true);
      setFormData(initialState);
    } catch (err: any) {
      // Log detailed error for debugging
      if (import.meta.env.DEV) {
        console.error("Submission error:", err);
      }

      // Show user-friendly error message
      toast({
        title: "Submission Failed",
        description: err?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof initialState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 relative overflow-hidden">
        <ParallaxBackground className="absolute inset-0" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif mb-6">
                Join the <span className="text-primary">Mentorship</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Register for personalized guidance and take the first step
                towards cracking your geology exam.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Registration Form */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal delay={0.1}>
              <GlassCard className="p-8 md:p-12">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-foreground font-serif mb-2">
                      Thank you for registering!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Your details have been received. Our team will get in
                      touch within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="glass-button bg-primary text-primary-foreground px-6 py-3 font-medium"
                    >
                      Submit another response
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        aria-invalid={!!errors.name}
                        className="glass-input w-full text-foreground placeholder:text-muted-foreground"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                        className="glass-input w-full text-foreground placeholder:text-muted-foreground"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        aria-invalid={!!errors.phone}
                        className="glass-input w-full text-foreground placeholder:text-muted-foreground"
                        placeholder="+91 XXXXX XXXXX"
                      />
                      {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                    </div>

                    {/* Target Exam */}
                    <div>
                      <label htmlFor="targetExam" className="block text-sm font-medium text-foreground mb-2">
                        Target Exam *
                      </label>
                      <select
                        id="targetExam"
                        name="targetExam"
                        value={formData.targetExam}
                        onChange={handleChange}
                        aria-invalid={!!errors.targetExam}
                        className="glass-input w-full text-foreground"
                      >
                        <option value="">Select your target exam</option>
                        {targetExams.map((exam) => (
                          <option key={exam} value={exam}>{exam}</option>
                        ))}
                      </select>
                      {errors.targetExam && <p className="text-sm text-destructive mt-1">{errors.targetExam}</p>}
                    </div>

                    {/* Program */}
                    <div>
                      <label htmlFor="program" className="block text-sm font-medium text-foreground mb-2">
                        Preferred Mentorship Program *
                      </label>
                      <select
                        id="program"
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        aria-invalid={!!errors.program}
                        className="glass-input w-full text-foreground"
                      >
                        <option value="">Select a program</option>
                        {programs.map((prog) => (
                          <option key={prog} value={prog}>{prog}</option>
                        ))}
                      </select>
                      {errors.program && <p className="text-sm text-destructive mt-1">{errors.program}</p>}
                      {selectedProgram?.id === "career-guidance" && (
                        <p className="text-sm text-muted-foreground mt-2">
                          You're booking a one-to-one Career Guidance slot. Sessions run
                          every Monday, 7:00 PM – 9:00 PM — four slots available. We'll
                          confirm your slot by email.
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Additional Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        aria-invalid={!!errors.message}
                        className="glass-input w-full text-foreground placeholder:text-muted-foreground resize-none"
                        placeholder="Tell us about your preparation goals..."
                      />
                      {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="glass-button w-full bg-primary text-primary-foreground py-4 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Register for Mentorship
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Benefits */}
                <div className="mt-8 pt-8 border-t border-border/50">
                  <h4 className="font-medium text-foreground mb-4">What happens next?</h4>
                  <ul className="space-y-2">
                    {[
                      "We'll review your registration within 24 hours",
                      "You'll receive a confirmation email with next steps",
                      "Schedule a free consultation call",
                      "Start your personalized mentorship journey",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
