import type { Event } from "@/types";

export const events: Event[] = [
  {
    slug: "joined-aws-emea",
    title: "Joined AWS EMEA as AI/ML Delivery Consultant",
    date: "2026-07-01",
    location: "France",
    category: "career",
    summary:
      "Starting as an Associate Delivery Consultant for AI/ML at AWS EMEA, designing production-grade GenAI solutions for enterprise customers.",
    description:
      "Joining the AWS EMEA Professional Services team to support large-scale AI/ML delivery engagements. The role involves designing and implementing production-grade machine learning and generative AI solutions on AWS for enterprise customers across the EMEA region, including end-to-end MLOps pipelines and model deployment strategies.",
    relatedExperienceId: "aws-emea",
    tags: ["AWS", "AI/ML", "GenAI", "Enterprise", "Consulting"],
  },
  {
    slug: "built-cyrus-ai-sales-copilot",
    title: "Built Cyrus AI: Multi-Agent Sales Copilot",
    date: "2026-02-01",
    location: "Remote",
    category: "project",
    summary:
      "Developed a multi-agent sales copilot using LangGraph for automated lead qualification and Slack draft generation with Salesforce and Gmail integrations.",
    description:
      "Built Cyrus AI at Supportful: a multi-agent sales copilot powered by LangGraph that automates lead qualification and generates Slack draft messages. The system integrates with Salesforce and Gmail, deployed as a multi-tenant SaaS platform on AWS. This project demonstrated the power of orchestrating multiple specialized AI agents for complex B2B sales workflows.",
    relatedExperienceId: "supportful",
    tags: ["LangGraph", "Multi-Agent", "SaaS", "Salesforce", "AWS"],
  },
  {
    slug: "built-zameel-ai-platform",
    title: "Built Zameel AI: NL Booking & BI Platform",
    date: "2026-01-15",
    location: "Remote",
    category: "project",
    summary:
      "Created a LangGraph + Gemini platform enabling natural language court booking, scheduling, payments, and conversational BI with auto-generated React charts.",
    description:
      "Developed Zameel AI at Supportful: a LangGraph and Gemini-powered platform that enables users to book sports courts, manage schedules, and process payments using natural language. The platform includes an NL BI layer that auto-generates React charts from conversational queries, making data exploration accessible to non-technical users.",
    relatedExperienceId: "supportful",
    tags: ["LangGraph", "Gemini", "NLP", "React", "BI"],
  },
  {
    slug: "causal-inference-savencia",
    title: "Causal Inference Research at Savencia",
    date: "2025-07-01",
    location: "La Boissiere-Ecole, France",
    category: "project",
    summary:
      "Led a causal inference project to optimize lactoferrin production in dairy manufacturing using DoWhy, EconML, and CausalNex.",
    description:
      "Led a research project at Savencia applying causal inference methods to optimize lactoferrin production in dairy manufacturing. Built end-to-end Databricks data pipelines for experiment tracking and causal analysis. Applied Propensity Score Matching, Double ML, and Causal Forest to identify key production drivers, bridging the gap between academic causal ML and real-world industrial optimization.",
    relatedExperienceId: "savencia",
    tags: ["Causal Inference", "DoWhy", "EconML", "Databricks", "Manufacturing"],
  },
  {
    slug: "exchange-semester-mcgill",
    title: "Exchange Semester at McGill University",
    date: "2025-04-01",
    location: "Montreal, Canada",
    category: "education",
    summary:
      "Completed an exchange semester at McGill University focused on Data Science and AI Strategy coursework.",
    description:
      "Spent a semester at McGill University in Montreal as part of the MSc Data Science & AI Strategy program at emlyon business school. The exchange provided exposure to North American academic perspectives on AI, data science methodologies, and cross-cultural collaboration in a world-class research university environment.",
    relatedExperienceId: "mcgill",
    tags: ["McGill", "Exchange", "Data Science", "Canada"],
  },
  {
    slug: "msc-emlyon-business-school",
    title: "Started MSc at emlyon business school",
    date: "2024-09-01",
    location: "Paris, France",
    category: "education",
    summary:
      "Began the Master of Science in Data Science & AI Strategy at emlyon business school in Paris.",
    description:
      "Enrolled in the MSc Data Science & AI Strategy program at emlyon business school in Paris, with a focus on causal inference, AI-driven business strategy, and applied machine learning. Received the LIFE Lebanon Scholarship and was elected class representative, combining technical depth with strategic business thinking.",
    relatedExperienceId: "emlyon",
    tags: ["emlyon", "MSc", "AI Strategy", "Data Science", "Scholarship"],
  },
  {
    slug: "multi-llm-orchestration-mopo",
    title: "Co-Architected Multi-LLM Orchestration at MOPO",
    date: "2023-08-01",
    location: "San Francisco (Remote)",
    category: "project",
    summary:
      "Co-designed a multi-LLM agent system with RAG pipelines, knowledge graphs, and speech services for an AI-native startup.",
    description:
      "Co-designed and built a multi-LLM agent system at MOPO, where a lead agent orchestrates specialized tool agents. Implemented RAG pipelines with vector embeddings, knowledge graphs, and semantic routers. Developed speech-to-text and translation services deployed on AWS ECS, and migrated the database layer to PostgreSQL with vector search capabilities.",
    relatedExperienceId: "mopo",
    tags: ["LLMs", "RAG", "Multi-Agent", "Knowledge Graphs", "AWS ECS"],
  },
  {
    slug: "freelance-ai-consulting-launch",
    title: "Launched Freelance AI Consulting Practice",
    date: "2023-08-01",
    location: "Lebanon / Remote",
    category: "career",
    summary:
      "Started delivering end-to-end AI consulting engagements, building LLM-powered chatbots, RAG systems, and GenAI architectures for multiple clients.",
    description:
      "Launched a freelance AI consulting practice serving clients across Paris, Beirut, and San Francisco. Key engagements included: building an LLM chatbot and RAG agent on Azure AI Search for TowardsChange, developing a CV ranking system for ShebangNow, leading GenAI architecture design at AI.skilled, and building a voice-to-JSON agent for Traveln.ai.",
    relatedExperienceId: "freelance-ai-consultant",
    tags: ["Freelance", "Consulting", "LLMs", "RAG", "Azure AI"],
  },
  {
    slug: "ml-production-mobile-arts",
    title: "Scaled ML to Production at Mobile Arts",
    date: "2022-06-01",
    location: "Beirut, Lebanon",
    category: "career",
    summary:
      "Built and deployed ML-powered services for content moderation, anomaly detection, and ad optimization across AWS infrastructure.",
    description:
      "Joined Mobile Arts as ML Specialist and built production ML services across AWS. Created a content moderation service with Angular and .NET Core, developed AI anomaly detection on AWS Lambda for real-time earnings monitoring, built a predictive engine on SageMaker for ad traffic optimization, and trained/deployed YOLOv8 logo detection on Dockerized AWS EC2.",
    relatedExperienceId: "mobile-arts",
    tags: ["AWS", "SageMaker", "YOLOv8", "Content Moderation", "MLOps"],
  },
  {
    slug: "edge-ai-decentra-tech",
    title: "Edge AI Deployment at Decentra Tech",
    date: "2021-05-01",
    location: "Beirut, Lebanon",
    category: "project",
    summary:
      "Trained and deployed computer vision models for real-time automotive safety on NVIDIA Jetson edge devices.",
    description:
      "Developed real-time computer vision systems for automotive safety at Decentra Tech. Trained models on GPU-accelerated AWS EC2 using NVIDIA TAO Toolkit and built inference pipelines with DeepStream SDK on Jetson Nano and Jetson Orin. Implemented collision warning, lane detection, and traffic sign detection achieving high-FPS real-time inference on edge hardware.",
    relatedExperienceId: "decentra-tech",
    tags: ["Computer Vision", "NVIDIA Jetson", "Edge AI", "DeepStream", "ADAS"],
  },
  {
    slug: "vine-detection-kefraya",
    title: "First ML Project: Vine Detection at Kefraya-AI",
    date: "2021-01-01",
    location: "Lebanon",
    category: "project",
    summary:
      "Trained a YOLOv3 model for vine detection from satellite and drone imagery for Chateau Kefraya vineyards.",
    description:
      "First hands-on machine learning project at Kefraya-AI (USJ), training a YOLOv3 object detection model to identify vines from satellite and drone imagery for Chateau Kefraya vineyards. This project marked the transition from academic ML knowledge to applied computer vision, combining remote sensing data with deep learning for precision agriculture.",
    relatedExperienceId: "kefraya-ai",
    tags: ["YOLOv3", "Computer Vision", "Agriculture", "Satellite Imagery"],
  },
  {
    slug: "nlp-sentiment-vee-smart",
    title: "NLP Sentiment Analysis at Vee Smart",
    date: "2021-02-01",
    location: "Beirut, Lebanon",
    category: "project",
    summary:
      "Built sentiment analysis and NER pipelines on restaurant review data using LSTM and BERT models.",
    description:
      "Developed NLP models at Vee Smart for sentiment analysis and named entity recognition on Zomato restaurant reviews. Built a sentiment analysis pipeline using LSTM and BERT models, and implemented Named Entity Recognition for aspect-based sentiment extraction, enabling fine-grained understanding of customer feedback.",
    relatedExperienceId: "vee-smart",
    tags: ["NLP", "BERT", "LSTM", "Sentiment Analysis", "NER"],
  },
  {
    slug: "laravel-development-eddys",
    title: "Backend Development at Eddys Group",
    date: "2020-09-01",
    location: "Beirut, Lebanon",
    category: "career",
    summary:
      "First professional software development role, building backend services and APIs using the Laravel PHP framework.",
    description:
      "Joined Eddys Group as a Laravel Developer, building backend services and APIs using the Laravel PHP framework for business applications. This role provided foundational experience in professional software development, REST API design, and database management with MySQL.",
    relatedExperienceId: "eddys-group",
    tags: ["Laravel", "PHP", "MySQL", "Backend", "API"],
  },
  {
    slug: "freelance-wordpress-launch",
    title: "Started Freelance WordPress Development",
    date: "2020-06-01",
    location: "Lebanon",
    category: "career",
    summary:
      "Launched freelance career building and customizing WordPress websites for local businesses.",
    description:
      "Started freelancing by building and customizing WordPress websites for local businesses and clients in Lebanon. Handled design, development, and deployment end-to-end, gaining early entrepreneurial experience and client management skills alongside technical web development.",
    relatedExperienceId: "freelance-wordpress",
    tags: ["WordPress", "Freelance", "Web Development", "PHP"],
  },
  {
    slug: "engineering-degree-usj-esib",
    title: "Engineer's Degree at USJ-ESIB",
    date: "2018-09-01",
    location: "Beirut, Lebanon",
    category: "education",
    summary:
      "Began a five-year Software Engineering degree at USJ-ESIB with progressive specialization in ML, computer vision, and AI.",
    description:
      "Enrolled in the five-year Software Engineering program at Universite Saint-Joseph (USJ-ESIB) in Beirut. The program featured a progressive specialization towards machine learning, computer vision, and artificial intelligence. Served as Vice President of the Student Representative Committee (Amicale) and completed notable projects including gene mutation prediction, solar panel detection, licence plate recognition, pose estimation, and MinervaHub.",
    relatedExperienceId: "usj-esib",
    tags: ["Software Engineering", "USJ", "ESIB", "Computer Science"],
  },
];
