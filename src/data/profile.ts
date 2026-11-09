export const PROFILE = {
  name: "Hadi Abou Daya",
  role: "AI Consultant",
  supportingRole: "Software Engineer",
  location: "Paris, France",
  description: "I work backwards from client needs to design and deliver AI solutions for company knowledge and business workflows, combining consulting with hands-on engineering.",
  url: "https://hadi.aboudaya.com",
} as const;

export const CV_FILES = [
  { language: "en", label: "CV in English", href: "/cv/HadiAbouDayaCV.pdf", sha256: "dc50ef8fcfb98423bd966d4bb7a0e2c02b256186428ae0977ff2dfdc5732a666" },
  { language: "fr", label: "CV en français", href: "/cv/HadiAbouDayaCV-fr.pdf", sha256: "38768192f5fb4c98d6b4a449be5524ff73452842b33bc0928ec5b23df70699b3" },
] as const;
