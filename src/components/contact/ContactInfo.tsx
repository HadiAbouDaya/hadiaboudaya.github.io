import { Mail, Linkedin, Github, Phone, MapPin } from "lucide-react";
import { SOCIAL_LINKS } from "@/data/social";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: SOCIAL_LINKS.email,
    href: `mailto:${SOCIAL_LINKS.email}`,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/hadiad",
    href: SOCIAL_LINKS.linkedin,
    external: true,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/HadiAbouDaya",
    href: SOCIAL_LINKS.github,
    external: true,
  },
  {
    icon: Phone,
    label: "Phone",
    value: SOCIAL_LINKS.phone,
    href: `tel:${SOCIAL_LINKS.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Paris, France",
  },
];

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <ScrollReveal direction="right">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Direct Contact
        </h2>
      </ScrollReveal>

      <div className="space-y-4">
        {contactMethods.map((method, i) => {
          const Icon = method.icon;
          const content = (
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {method.label}
                </p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">
                  {method.value}
                </p>
              </div>
            </div>
          );

          return (
            <ScrollReveal key={method.label} direction="right" delay={i * 0.1}>
              {method.href ? (
                <a
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noopener noreferrer" : undefined}
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
