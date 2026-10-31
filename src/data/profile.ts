export const PROFILE = {
  name: "Hadi Abou Daya",
  role: "AI Consultant",
  supportingRole: "Software Engineer",
  location: "Paris, France",
  description: "I work backwards from client needs to design and deliver AI solutions, combining consulting with hands-on engineering.",
  url: "https://hadi.aboudaya.com",
} as const;

export const CV_FILES = [
  { language: "en", label: "CV in English", href: "/cv/HadiAbouDayaCV.pdf", sha256: "5bfc49c35d89563f0b42e239608c3c07d80fcaca4102aa7a52e581a405ba1614" },
  { language: "fr", label: "CV en français", href: "/cv/HadiAbouDayaCV-fr.pdf", sha256: "74f023c91d35ae9a3aee79882b5dc5be2582026b773f586e9d45bd4969bf5578" },
] as const;
