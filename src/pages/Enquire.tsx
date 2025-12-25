import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";

const stats = [
  { label: "Parent Satisfaction", value: 98, suffix: "%" },
  { label: "Student Grade Improvement", value: 94, suffix: "%" },
  { label: "Students Tutored", value: 500, suffix: "+" },
  { label: "Average Score Increase", value: 2.3, suffix: " grades" },
];

const AnimatedStat = ({ stat, index }: { stat: typeof stats[0]; index: number }) => {
  const [count, setCount] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        const duration = 2000;
        const steps = 60;
        const increment = stat.value / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            setCount(stat.value);
            clearInterval(timer);
          } else {
            setCount(Number(current.toFixed(1)));
          }
        }, duration / steps);
      }}
      className="text-center p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm"
    >
      <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
        {count}{stat.suffix}
      </div>
      <div className="text-muted-foreground text-sm tracking-wide uppercase">
        {stat.label}
      </div>
    </motion.div>
  );
};

const EnquirePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Message sent successfully! We'll be in touch soon.");
    setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
                Get Started
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Take the first step towards academic excellence. We'll reach out to schedule an introductory meeting.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              {stats.map((stat, index) => (
                <AnimatedStat key={stat.label} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left Column - Process & Contact */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                    What Happens Next?
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    After filling out the form, we'll reach out to book a quick consultation call to meet and discuss your goals and aspirations.
                  </p>

                  {/* Process Steps */}
                  <div className="space-y-6">
                    {[
                      "Consultation call takes place",
                      "Study schedule and content is created specifically for the student",
                      "Tuition time and date is discussed and set",
                      "Lessons begin with monthly reports sent to parents",
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {index + 1}
                        </div>
                        <p className="text-foreground">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 pt-8 border-t border-border">
                  <a
                    href="mailto:contact@sparkededucation.com"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <Mail className="w-5 h-5" />
                    <span>contact@sparkededucation.com</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a
                    href="tel:+6421234567"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <Phone className="w-5 h-5" />
                    <span>021 234 5678</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </motion.div>

              {/* Right Column - Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary p-8 md:p-10 rounded-2xl">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                    The New Approach to Education.
                  </h3>
                  <p className="text-primary-foreground/80 mb-8">
                    We will reach out to schedule an introductory meeting.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-primary-foreground mb-2 block">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-primary-foreground border-0 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-primary-foreground mb-2 block">
                        Mobile Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="021 234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="bg-primary-foreground border-0 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-primary-foreground mb-2 block">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-primary-foreground border-0 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-primary-foreground mb-2 block">
                        Subject <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        required
                      >
                        <SelectTrigger className="bg-primary-foreground border-0 text-foreground">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ncea">NCEA</SelectItem>
                          <SelectItem value="cambridge">Cambridge</SelectItem>
                          <SelectItem value="ib">IB</SelectItem>
                          <SelectItem value="university">University</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-primary-foreground mb-2 block">
                        Message (optional)
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your goals..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-primary-foreground border-0 text-foreground placeholder:text-muted-foreground min-h-[100px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-background text-foreground hover:bg-background/90 font-semibold py-6 text-base tracking-wide"
                    >
                      {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default EnquirePage;
