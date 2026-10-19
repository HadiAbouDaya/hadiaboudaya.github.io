export const PROFILE = {
  name: "Hadi Abou Daya",
  role: "AI Consultant",
  supportingRole: "Software Engineer",
  location: "Paris, France",
  description: "I work backwards from client needs to design and deliver AI solutions, combining consulting with hands-on engineering.",
  url: "https://hadi.aboudaya.com",
} as const;

export const CV_FILES = [
  { language: "en", label: "CV in English", href: "/cv/HadiAbouDayaCV.pdf", sha256: "86a0c686f3704baf9f539207de7b64c88e708e65d81e768c1e6bfe584caee021" },
  { language: "fr", label: "CV en français", href: "/cv/HadiAbouDayaCV-fr.pdf", sha256: "f34bd1369215c4a7c2c451c95084e36cb682c082a03147eefdbeb75a380772e2" },
] as const;
