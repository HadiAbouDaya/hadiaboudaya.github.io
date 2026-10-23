import type { Experience } from "@/types";

// Month precision: these are engagement periods, not exact project dates.
export const experiences: Experience[] = [
  {
    "id": "aws",
    "company": "Amazon Web Services (AWS)",
    "role": "Delivery Consultant AI/ML, ProServe",
    "type": "work",
    "period": "May 2026 - Oct 2026",
    "startDate": "2026-05",
    "endDate": "2026-10",
    "location": "Paris, France",
    "description": "Worked on client-facing AI and data solutions, combining customer requirements, architecture and hands-on implementation.",
    "bullets": [
      "Conceived, developed and deployed a multi-tenant agentic platform using Amazon Bedrock and AgentCore as a customer pilot, enabling questions over company knowledge, actions in enterprise systems and multi-step business workflows.",
      "Worked backwards from customer needs to translate business, data-sovereignty and security requirements into architecture and delivery decisions.",
      "Implemented the Agent2Agent (A2A) protocol within the platform.",
      "Built an AWS Transform modernisation prototype during Agentic August and contributed to an Amazon Redshift proof of concept."
    ],
    "technologies": [
      "Amazon Bedrock",
      "AgentCore",
      "A2A",
      "AWS Transform",
      "Amazon Redshift"
    ],
    "logoPath": "/Media/experience/aws/logo.webp",
    "caseStudySlugs": [
      "aws-agentic-platform-pilot"
    ]
  },
  {
    "id": "freelance-ai-consultant",
    "company": "Independent AI Consulting",
    "role": "Self-employed / Freelance",
    "type": "freelance",
    "period": "Jun 2023 - May 2026",
    "startDate": "2023-06",
    "endDate": "2026-05",
    "location": "Remote",
    "description": "Worked with clients on AI projects from needs discovery and solution design through implementation and deployment. Combined hands-on engineering with architecture advice, delivery planning, stakeholder coordination and clear communication of technical decisions. Selected engagements within this practice are listed below. Some ran concurrently.",
    "bullets": [],
    "technologies": [],
    "logoPath": "/Media/experience/freelance/logo.webp",
    "engagements": [
      {
        "id": "supportful",
        "company": "Supportful",
        "role": "AI Consultant / Freelance",
        "type": "freelance",
        "period": "Dec 2025 - May 2026",
        "startDate": "2025-12",
        "endDate": "2026-05",
        "location": "Remote",
        "description": "Delivered production AI systems across sales workflows, client engagement and sports-facility operations.",
        "bullets": [],
        "technologies": [
          "LangGraph",
          "FastMCP",
          "Salesforce",
          "AWS",
          "Terraform",
          "Gemini",
          "React",
          "LangSmith"
        ],
        "logoPath": "/Media/experience/freelance/supportful-logo.webp",
        "projects": [
          {
            "heading": "B2B Sales Intelligence Platform",
            "bullets": [
              "Built a production LangGraph sales copilot connecting Salesforce, Gmail and business tools for lead qualification and Slack drafts with human review.",
              "Developed a Salesforce MCP server using Python and FastMCP, enabling CRM actions within the requesting user's existing roles and permissions.",
              "Exposed customer and opportunity retrieval, lead and opportunity creation and updates, interaction summaries and support-ticket creation through agent-accessible tools.",
              "Engineered the agent's execution, tool routing, workflow state, context, memory, failure recovery, evaluations and human approvals.",
              "Deployed the product on AWS with infrastructure managed through Terraform.",
              "Enabled sales representatives, account managers and leadership or operations users to complete multiple CRM actions in one conversation, reducing manual entry and record updating."
            ]
          },
          {
            "heading": "AI Consulting Firm",
            "bullets": [
              "Collaborated on the design and development of a client portal providing engagement updates, action ownership and answers grounded in previous meetings.",
              "Enabled demonstrations to prospective clients that contributed to signed new client contracts.",
              "Delivered production AI applications for research, document review and technical knowledge access across financial-services and industrial clients."
            ]
          },
          {
            "heading": "Sports Facility Management Platform",
            "bullets": [
              "Delivered production LangGraph/Gemini agents for bookings, availability checks, rescheduling, cancellations, refunds and payments through web chat and WhatsApp.",
              "Built a telephone agent handling complete calls and booking courts and training sessions across football, basketball, padel and tennis facilities in Saudi Arabia.",
              "Developed conversational analytics translating managers' questions into interactive React charts for revenue, bookings, payment methods, staffing and trainer performance.",
              "Improved agent reliability and accessibility through Arabic support, image and voice-note processing, conversation memory, guardrails, human handover and automated LangSmith evaluations."
            ]
          }
        ],
        "caseStudySlugs": [
          "salesforce-agent-mcp",
          "client-engagement-portal",
          "sports-booking-agents"
        ],
        "companyUrl": "https://supportful.world"
      },
      {
        "id": "mopo",
        "company": "MOPO",
        "role": "AI Software Engineer / Freelance / Project Lead",
        "type": "freelance",
        "period": "Jun 2023 - Jan 2026",
        "startDate": "2023-06",
        "endDate": "2026-01",
        "location": "San Francisco (Remote)",
        "description": "Led the AI product project from initial concept through production launch, coordinating engineering and business stakeholders to deliver company-knowledge question answering and automated customer-facing conversations.",
        "bullets": [
          "Translated customer needs and product priorities into architecture and delivery plans.",
          "Designed and implemented multi-LLM orchestration with lead agents, specialised tool agents and function calling.",
          "Built RAG pipelines using vector search, knowledge graphs and semantic routing, alongside speech transcription and translation integrations.",
          "Owned production backend deployment and maintenance on AWS ECS, led CI/CD delivery and evolved conversation and document storage using PostgreSQL with vector search.",
          "Contributed to customer discussions, product direction, pitches and fundraising preparation, connecting technical capabilities to business needs and introducing agile delivery practices."
        ],
        "technologies": [
          "LLM orchestration",
          "RAG",
          "AWS ECS",
          "Docker",
          "PostgreSQL"
        ],
        "logoPath": "/Media/experience/mopo/logo.webp",
        "caseStudySlugs": [
          "mopo-conversational-ai"
        ]
      },
      {
        "id": "minervahub",
        "company": "MinervaHub",
        "role": "AI Consultant / Freelance",
        "type": "freelance",
        "period": "Apr 2025 - Jun 2025",
        "startDate": "2025-04",
        "endDate": "2025-06",
        "location": "Remote",
        "description": "Worked backwards from communication, knowledge-sharing and cultural-integration pain points to define an AI-enabled employee portal for a fashion and luxury supply-chain group.",
        "bullets": [
          "Assessed business and employee needs to identify useful portal capabilities and prioritise use cases.",
          "Translated findings into user journeys, a portal blueprint, access requirements and data-governance recommendations.",
          "Developed architecture recommendations with the project team covering Microsoft/Azure services, single sign-on, AI-assisted document search, personalised content and enterprise integrations.",
          "Contributed an implementation roadmap that informed prioritisation of the next phase."
        ],
        "technologies": [
          "Client discovery",
          "Azure",
          "SSO",
          "Governance",
          "Delivery planning"
        ],
        "logoPath": "/Media/experience/minervahub/logo.webp",
        "caseStudySlugs": [
          "minervahub-portal-advisory"
        ]
      },
      {
        "id": "towardschange",
        "company": "TowardsChange",
        "role": "AI Consultant / Contract engagement",
        "type": "freelance",
        "period": "Sep 2024 - Nov 2024",
        "startDate": "2024-09",
        "endDate": "2024-11",
        "location": "Remote",
        "description": "Adapted enterprise knowledge-access solutions to client workflows, document sources and hosting requirements through needs analysis, architecture and implementation.",
        "bullets": [],
        "technologies": [
          "Mistral",
          "RAG",
          "Azure AI Search",
          "Azure Document Intelligence",
          "Python",
          "FastAPI"
        ],
        "logoPath": "/Media/experience/towardschange/logo.webp",
        "projects": [
          {
            "heading": "On-premise knowledge assistant",
            "bullets": [
              "Translated confidentiality and internal hosting requirements into an on-premise RAG pilot using self-hosted Mistral models.",
              "Kept document retrieval and LLM processing within the client's infrastructure.",
              "Delivered a pilot used by selected client users."
            ]
          },
          {
            "heading": "FridayGPT cloud product",
            "bullets": [
              "Contributed to a separate enterprise knowledge assistant deployed in a product used by customers.",
              "Combined keyword, vector and semantic retrieval through Azure AI Search to support answers grounded in business documents and accompanied by source references.",
              "Improved retrieval preparation through email preprocessing and PDF-to-Markdown extraction with Azure Document Intelligence.",
              "Contributed Python/FastAPI services for chat, embeddings and document question answering within a product integrating SharePoint documents, email conversations and support tickets."
            ]
          }
        ],
        "caseStudySlugs": [
          "towardschange-enterprise-knowledge"
        ]
      },
      {
        "id": "additional-ai-consulting",
        "company": "Additional AI consulting engagements",
        "role": "AI Consultant / Freelance",
        "type": "freelance",
        "period": "Sep 2023 - Aug 2024",
        "startDate": "2023-09",
        "endDate": "2024-08",
        "location": "Remote",
        "description": "Selected client work during this period:",
        "bullets": [],
        "technologies": [
          "LLMs",
          "Embeddings",
          "Python",
          "Docker"
        ],
        "logoPath": "/Media/experience/freelance/logo.webp",
        "projects": [
          {
            "heading": "AI.skilled",
            "bullets": [
              "Led GenAI architecture and delivery planning and guided three AI engineers.",
              "Developed tools for data collection, sales-email generation and customer-persona onboarding."
            ]
          },
          {
            "heading": "ShebangNow",
            "bullets": [
              "Built a recruitment application extracting information from PDF CVs and comparing candidates against job requirements using LLMs and embeddings.",
              "Developed interview preparation, SWOT analysis and CV-improvement recommendations through an English/French interface with containerised deployment."
            ]
          },
          {
            "heading": "Traveln.ai",
            "bullets": [
              "Developed personalised travel RAG combining database records, preferences and conversational input.",
              "Built LLM services for trip planning, information extraction and voice-based travel search, supported by API and web collection of points-of-interest data."
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "savencia",
    "company": "Savencia",
    "role": "Data Scientist Intern",
    "type": "work",
    "period": "Jul 2025 - Dec 2025",
    "startDate": "2025-07",
    "endDate": "2025-12",
    "location": "La Boissiere-Ecole, France",
    "description": "Applied causal inference to industrial production questions, translating findings into recommendations for R&D and engineering teams.",
    "bullets": [
      "Led a causal-inference project investigating drivers of lactoferrin production yield.",
      "Developed Databricks workflows and applied methods including Double Machine Learning and causal forests using DoWhy, EconML and related tools.",
      "Presented causal diagrams, findings and process recommendations to make analytical assumptions and results understandable for manufacturing decisions."
    ],
    "technologies": [
      "Causal inference",
      "Databricks",
      "DoWhy",
      "EconML"
    ],
    "logoPath": "/Media/experience/savencia/logo-transparent.svg",
    "caseStudySlugs": [
      "savencia-causal-inference"
    ],
    "companyUrl": "https://www.savencia.com"
  },
  {
    "id": "mobile-arts",
    "company": "Mobile Arts",
    "role": "Machine Learning Specialist",
    "type": "work",
    "period": "Jun 2022 - Aug 2023",
    "startDate": "2022-06",
    "endDate": "2023-08",
    "location": "Beirut, Lebanon",
    "description": "Delivered cloud ML systems for advertising optimisation, moderation and operational monitoring, combining client requirements with engineering and evaluation.",
    "bullets": [
      "Developed and launched an AWS SageMaker prediction engine that improved advertising revenue through data-driven traffic allocation.",
      "Worked with clients to gather moderation requirements and delivered image, video and text tooling with an Angular frontend and .NET backend.",
      "Built production anomaly-detection services on AWS Lambda to alert operations teams and media buyers to performance issues and unusual earnings-per-click patterns.",
      "Trained a YOLOv8 logo-detection model and deployed a containerised application on AWS EC2."
    ],
    "technologies": [
      "AWS SageMaker",
      "Lambda",
      "EC2",
      "Angular",
      ".NET",
      "YOLOv8"
    ],
    "logoPath": "/Media/experience/mobile-arts/logo.webp"
  },
  {
    "id": "decentra-tech",
    "company": "Decentra Tech",
    "role": "Computer Vision Developer",
    "type": "work",
    "period": "May 2021 - May 2022",
    "startDate": "2021-05",
    "endDate": "2022-05",
    "location": "Beirut, Lebanon",
    "description": "Developed and optimised edge computer-vision capabilities for automotive safety applications.",
    "bullets": [
      "Fine-tuned and pruned computer-vision models with NVIDIA TAO, achieving 60 FPS on NVIDIA Jetson Nano for the optimised model.",
      "Built DeepStream pipelines and deployed collision-warning, lane-detection and traffic-sign capabilities on Jetson devices.",
      "Trained detection and segmentation models using cloud GPUs, TensorFlow and PyTorch."
    ],
    "technologies": [
      "NVIDIA TAO",
      "DeepStream",
      "Jetson Nano",
      "TensorFlow",
      "PyTorch"
    ],
    "logoPath": "/Media/experience/decentra-tech/logo.webp"
  },
  {
    "id": "vee-smart",
    "company": "Vee Smart",
    "role": "Machine Learning Engineer Intern",
    "type": "work",
    "period": "Feb 2021 - Apr 2021",
    "startDate": "2021-02",
    "endDate": "2021-04",
    "location": "Beirut, Lebanon",
    "description": "",
    "bullets": [
      "Collected and prepared restaurant-review data for NLP analysis.",
      "Developed LSTM and BERT sentiment-analysis models and used named-entity recognition to identify aspects discussed in customer reviews."
    ],
    "technologies": [
      "Python",
      "BERT",
      "LSTM",
      "NLP"
    ],
    "logoPath": "/Media/experience/vee-smart/logo.webp",
    "companyUrl": "https://github.com/HadiAbouDaya/VeeSmart"
  },
  {
    "id": "kefraya-ai",
    "company": "USJ / Kefraya-AI",
    "role": "Machine Learning Engineer / University Project",
    "type": "work",
    "period": "Jan 2021 - Feb 2021",
    "startDate": "2021-01",
    "endDate": "2021-02",
    "location": "Lebanon",
    "description": "",
    "bullets": [
      "Labelled vineyard imagery and trained YOLOv3 models to detect grapevine presence and absence.",
      "Applied computer vision to an agricultural image-analysis problem, covering data preparation, training and evaluation."
    ],
    "technologies": [
      "Python",
      "YOLOv3",
      "Satellite imagery"
    ],
    "logoPath": "/Media/experience/kefraya-ai/logo.webp",
    "companyUrl": "https://github.com/HadiAbouDaya/Kefraya-AI"
  },
  {
    "id": "eddys-group",
    "company": "Eddy’s Group",
    "role": "Laravel Developer Intern",
    "type": "work",
    "period": "Sep 2020 - Dec 2020",
    "startDate": "2020-09",
    "endDate": "2020-12",
    "location": "Beirut, Lebanon",
    "description": "",
    "bullets": [
      "Developed backend services and APIs using Laravel, PHP and MySQL."
    ],
    "technologies": [
      "Laravel",
      "PHP",
      "MySQL"
    ],
    "logoPath": "/Media/experience/eddys-group/logo.webp"
  },
  {
    "id": "freelance-wordpress",
    "company": "Freelance WordPress Development",
    "role": "WordPress Developer / Freelance",
    "type": "freelance",
    "period": "Jun 2020 - Oct 2020",
    "startDate": "2020-06",
    "endDate": "2020-10",
    "location": "Lebanon",
    "description": "",
    "bullets": [
      "Designed, customised, developed and deployed WordPress websites for local clients."
    ],
    "technologies": [
      "WordPress",
      "PHP",
      "CSS"
    ],
    "logoPath": "/Media/experience/freelance/wordpress-logo.webp"
  },
  {
    "id": "fomaco",
    "company": "Fomaco sarl",
    "role": "Assistant Technician Intern",
    "type": "work",
    "period": "Jun 2019 - Aug 2019",
    "startDate": "2019-06",
    "endDate": "2019-08",
    "location": "Lebanon",
    "description": "",
    "bullets": [
      "Assisted with electrical troubleshooting, diagnostics and repairs."
    ],
    "technologies": [
      "Electrical troubleshooting"
    ],
    "logoPath": "/Media/experience/fomaco/logo.webp"
  },
  {
    "id": "emlyon",
    "company": "emlyon business school",
    "role": "MSc Data Science & Artificial Intelligence Strategy",
    "type": "education",
    "period": "Sep 2024 - Jan 2026",
    "startDate": "2024-09",
    "endDate": "2026-01",
    "location": "Paris, France",
    "logoPath": "/Media/education/emlyon/logo.webp",
    "companyUrl": "https://em-lyon.com",
    "description": "MSc Data Science & Artificial Intelligence Strategy at emlyon business school, with an exchange semester at McGill University.",
    "bullets": [
      "LIFE Lebanon Scholarship recipient"
    ],
    "technologies": []
  },
  {
    "id": "mcgill",
    "company": "McGill University",
    "role": "Exchange Semester",
    "type": "education",
    "period": "Apr 2025 - Jul 2025",
    "startDate": "2025-04",
    "endDate": "2025-07",
    "location": "Montreal, Canada",
    "logoPath": "/Media/education/mcgill/logo.webp",
    "companyUrl": "https://www.mcgill.ca",
    "description": "Exchange semester at McGill University within the emlyon MSc. Studies included AI strategy and business in North America.",
    "bullets": [],
    "technologies": []
  },
  {
    "id": "usj-esib",
    "company": "USJ - ESIB",
    "role": "Engineer's Degree, Software Engineering",
    "type": "education",
    "period": "Sep 2018 - May 2023",
    "startDate": "2018-09",
    "endDate": "2023-05",
    "location": "Beirut, Lebanon",
    "logoPath": "/Media/education/usj-esib/logo.webp",
    "companyUrl": "https://www.usj.edu.lb",
    "description": "Five-year Software Engineering degree, with projects in machine learning, computer vision and artificial intelligence.",
    "bullets": [],
    "technologies": []
  }
];

export const professionalExperiences = experiences.filter(item => item.type !== "education").sort((a, b) => b.endDate.localeCompare(a.endDate));
export const educationExperiences = experiences.filter(item => item.type === "education").sort((a, b) => b.endDate.localeCompare(a.endDate));
export const latestExperience = professionalExperiences[0];
export const allEngagements = experiences.flatMap(item => [item, ...(item.engagements ?? [])]);
export function getEngagement(id: string) { return allEngagements.find(item => item.id === id); }

export function getEngagementContext(id: string) {
  const engagement = getEngagement(id);
  const practice = experiences.find(item => item.engagements?.some(child => child.id === id));
  return { engagement, practice };
}
