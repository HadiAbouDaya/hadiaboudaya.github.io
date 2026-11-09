export const PROFILE = {
  name: "Hadi Abou Daya",
  role: "AI Consultant",
  supportingRole: "Software Engineer",
  location: "Paris, France",
  description: "I work backwards from client needs to design and deliver AI solutions for company knowledge and business workflows, combining consulting with hands-on engineering.",
  url: "https://hadi.aboudaya.com",
} as const;

export const CV_FILES = [
  { language: "en", label: "CV in English", href: "/cv/HadiAbouDayaCV.pdf", sha256: "7dc04b36ea41998dd237af2faea7d9ebd15a7f3a4c3143120a788128a319338e" },
  { language: "fr", label: "CV en français", href: "/cv/HadiAbouDayaCV-fr.pdf", sha256: "0faef83fa6db802c5b1f9111a0184188d0ac1f6d1649aae23fa73614f2fc55e2" },
] as const;
