import type { KeyFact, Language } from "@/types";

export const BIO =
  "Lebanese-born AI/ML engineer based in Paris. From edge-deployed computer vision on NVIDIA Jetson to multi-LLM agent systems with LangGraph, I build intelligent products that scale on AWS. Currently consulting as an AI engineer.";

export const KEY_FACTS: KeyFact[] = [
  {
    icon: "Briefcase",
    label: "Experience",
    value: "Since 2020",
    detail: "5+ years across CV, NLP, LLM agents, and cloud ML",
  },
  {
    icon: "Award",
    label: "Certifications",
    value: "AI \u00b7 Cloud \u00b7 PM",
    detail: "AWS ML Specialty, PMP, Azure, TensorFlow Developer, and more",
  },
  {
    icon: "GraduationCap",
    label: "Education",
    value: "Engineering & Strategy",
    detail:
      "MSc Data Science & AI Strategy (emlyon x McGill) + Engineer's Degree (USJ-ESIB)",
  },
  {
    icon: "Globe",
    label: "International Experience",
    value: "Multicultural",
    detail:
      "Lebanon, France, Canada, Spain, Saudi Arabia, USA, and more",
  },
];

export const LANGUAGES: Language[] = [
  { greeting: "Bonjour", name: "French", proficiency: "Fluent" },
  { greeting: "Hello", name: "English", proficiency: "Fluent" },
  { greeting: "مرحبا", name: "Arabic", proficiency: "Native" },
];

export const HOMEPAGE_EXPERTISE: { heading: string; icon: "Bot" | "Cloud" | "Eye" | "Lightbulb" | "FlaskConical"; text: string }[] = [
  {
    heading: "LLM Agents and Multi-Agent Systems",
    icon: "Bot",
    text: "Most AI agent demos look impressive and break the moment you connect them to a real CRM. I build the ones that don't.\n\nI architect multi-agent systems that handle end-to-end workflows: lead qualification, CRM updates, message drafting with human approval, natural language analytics. The hard part isn't getting one LLM call to work. It's orchestrating multiple steps, managing context across them, and knowing where a human needs to step in. I've built sales copilots, conversational booking systems, and RAG-powered chatbots for clients across France, the Middle East, and the US, deployed on AWS with isolated databases per tenant.\n\nI also work with Azure AI Search and on-premise LLM deployments for companies that can't send their data to a third-party API. Every system ships with human oversight at the decision points that actually matter.",
  },
  {
    heading: "Production Machine Learning on the Cloud",
    icon: "Cloud",
    text: "I work with companies that need ML models in production, not sitting in a Jupyter notebook getting demo'd to investors.\n\nMy deployments include content moderation pipelines, ad optimization engines, and anomaly detection systems. The stack depends on the problem. I work across AWS, Azure, and GCP, and I pick the services that fit the use case, not the other way around. I handle the full MLOps cycle: data pipelines, training, deployment, monitoring for drift, and the part nobody talks about, keeping it all running after the initial launch.\n\nI hold AWS and Azure certifications, and I speak regularly at AWS community events.",
  },
  {
    heading: "Computer Vision and Edge AI",
    icon: "Eye",
    text: "Edge deployment is where things get tricky because you can't just throw more GPU at the problem.\n\nI handle the full edge CV pipeline: training, fine-tuning, pruning, quantization, and building inference applications that run on constrained hardware in real time. Past applications include automotive safety systems (collision warning, lane detection, traffic sign recognition), agricultural monitoring from satellite and drone imagery, logo detection for brand compliance, and multilingual licence plate recognition.\n\nThe interesting part of edge work is fitting an accurate model inside hardware that costs a few hundred dollars. I work across the full pipeline: training on cloud GPUs, pruning and quantizing for the target device, and building the inference application that runs on-site.",
  },
  {
    heading: "AI Strategy and Consulting",
    icon: "Lightbulb",
    text: "I also take on work where the job isn't writing code. Sometimes a company needs someone to figure out where AI fits in their operations, whether to build or buy, and how to phase a rollout without burning money.\n\nI studied Data Science and AI Strategy at emlyon business school and McGill University, so I can hold both conversations: the technical architecture and the business case. I've evaluated startups as a jury member at MWC Barcelona and the Startup World Series. I've led AI workshops across universities and tech events reaching hundreds of attendees. And I've delivered hands-on implementations for clients ranging from early-stage startups to banks and enterprise.",
  },
  {
    heading: "Causal Inference and Industrial Data Science",
    icon: "FlaskConical",
    text: "Predictive models tell you what will probably happen. Causal inference tells you what would happen if you changed something. Different question, harder question, and the one that matters when you're making process decisions in manufacturing or operations.\n\nI build causal analysis pipelines that isolate the real drivers behind operational outcomes. The method depends on the data and the question, but the goal is always the same: give decision-makers a clear picture of what actually moves the needle, backed by evidence they can defend in a room full of engineers.\n\nWhen someone asks 'what happens if we change this process variable?', causal inference gives a grounded answer instead of a forecast with a confidence interval.",
  },
];

export const JOURNEY_PARAGRAPHS = [
  "Born and raised in the Bekaa Valley of Lebanon, I grew up fascinated by physics, mathematics, and how things work. After earning my Lebanese Baccalaureate in General Science from Collège Saint Joseph - Zahle, I moved to Beirut to study Software Engineering at USJ-ESIB.",
  "During my engineering degree, I discovered machine learning and never looked back. Starting with computer vision projects: vine detection from satellite imagery, sentiment analysis with BERT, I quickly transitioned to deploying real-time inference on NVIDIA Jetson devices at Decentra Tech.",
  "At Mobile Arts, I scaled ML to production on AWS: content moderation services, anomaly detection pipelines on Lambda, and predictive engines on SageMaker. This experience cemented my passion for building ML systems that deliver real business value.",
  "The emergence of large language models shifted my focus toward multi-agent systems. At MOPO, I co-architected a multi-LLM orchestration platform with RAG pipelines and knowledge graphs. As a freelance consultant, I built RAG chatbots, sales copilots, and voice-to-JSON agents for startups across Paris, Beirut, and San Francisco.",
  "In parallel, I pursued a Master's in Data Science & AI Strategy at emlyon business school, with an exchange semester at McGill University in Montreal. My end-of-studies internship at Savencia applied causal inference to optimize industrial manufacturing processes.",
  "Today, I consult on AI-powered SaaS products at Supportful, building multi-agent systems with LangGraph for B2B sales intelligence and sports facility management.",
];
