export const PROFILE = {
  name: "Hadi Abou Daya",
  role: "AI Consultant",
  supportingRole: "Software Engineer",
  location: "Paris, France",
  description: "I work backwards from client needs to design and deliver AI solutions, combining consulting with hands-on engineering.",
  url: "https://hadi.aboudaya.com",
} as const;

export const CV_FILES = [
  { language: "en", label: "CV in English", href: "/cv/HadiAbouDayaCV.pdf", sha256: "3937a6517067f8efd3d4167bb53ef3eed5ce2ed333d927144081cb1efb81a13c" },
  { language: "fr", label: "CV en français", href: "/cv/HadiAbouDayaCV-fr.pdf", sha256: "70c630bf904467c95f78ed3ebc90c530900c1da20ca2695f563c87404d1c51a0" },
] as const;
