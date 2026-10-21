import type { CaseStudy } from "@/types";

export const caseStudies: CaseStudy[] = [
  {
    "slug": "salesforce-agent-mcp",
    "title": "Salesforce agent and MCP integration",
    "engagementId": "supportful",
    "stage": "Production",
    "summary": "Sales work involved retrieving customer context and carrying out updates across existing business tools. The application brought those tasks into a conversational workflow while respecting each user's existing access.",
    "sections": [
      {
        "heading": "The need",
        "paragraphs": [
          "Sales work involved retrieving customer context and carrying out updates across existing business tools. The application brought those tasks into a conversational workflow while respecting each user's existing access."
        ]
      },
      {
        "heading": "My contribution",
        "paragraphs": [
          "I built a LangGraph sales copilot integrating Salesforce, Gmail and other business tools, with lead qualification and Slack drafts for human review. I developed the Salesforce MCP server in Python with FastMCP so the agent could retrieve customer details, search opportunities, create and update leads or opportunities, summarise interactions and create support tickets.",
          "Actions followed the requesting user's existing roles and permissions. Alongside the integration, I built and customised the agent's execution loops, tool routing, workflow state, context and memory, failure recovery, evaluation and human-approval behaviour. I deployed the product on AWS with infrastructure managed through Terraform."
        ]
      },
      {
        "heading": "Outcome",
        "paragraphs": [
          "Sales representatives, account managers and leadership or operations users used the system in production. It reduced manual CRM entry and updating and let users complete several CRM actions in one conversation."
        ]
      }
    ],
    "technologies": [
      "Python",
      "FastMCP",
      "MCP",
      "LangGraph",
      "Salesforce",
      "AWS",
      "Terraform"
    ],
    "updatedAt": "2026-10-19",
    "context": "B2B Sales Intelligence Platform"
  },
  {
    "slug": "aws-agentic-platform-pilot",
    "title": "Multi-tenant agentic platform pilot on AWS",
    "engagementId": "aws",
    "stage": "Customer pilot",
    "summary": "The pilot explored how enterprise users could access company knowledge and carry out business workflows through AI agents while meeting hosting, data-sovereignty and security requirements.",
    "sections": [
      {
        "heading": "The need",
        "paragraphs": [
          "The pilot explored how enterprise users could access company knowledge and carry out business workflows through AI agents while meeting hosting, data-sovereignty and security requirements."
        ]
      },
      {
        "heading": "My contribution",
        "paragraphs": [
          "I conceived, developed and deployed a multi-tenant platform using Amazon Bedrock and AgentCore. It enabled questions over company knowledge, actions in enterprise systems and multi-step business workflows.",
          "I worked backwards from customer requirements to make architecture and delivery decisions and implemented the Agent2Agent (A2A) protocol within the platform."
        ]
      },
      {
        "heading": "Outcome",
        "paragraphs": [
          "The work reached a customer-facing pilot, providing a working implementation of the knowledge and workflow capabilities within the agreed constraints."
        ]
      }
    ],
    "technologies": [
      "Amazon Bedrock",
      "AgentCore",
      "A2A",
      "AWS"
    ],
    "updatedAt": "2026-10-19"
  },
  {
    "slug": "mopo-conversational-ai",
    "title": "From concept to production: enterprise conversational AI",
    "engagementId": "mopo",
    "stage": "Production launch",
    "summary": "MOPO's product enabled customers to obtain answers grounded in company knowledge and automate customer-facing conversations.",
    "acquisition": {
      "buyer": "Act-On",
      "date": "2026-01",
      "continuation": "Act-On acquired the product and continued its development with its own team.",
      "productName": "Act-On InSite",
      "productUrl": "https://act-on.com/product/act-on-insite/"
    },
    "sections": [
      {
        "heading": "The need",
        "paragraphs": [
          "MOPO's product enabled customers to obtain answers grounded in company knowledge and automate customer-facing conversations."
        ]
      },
      {
        "heading": "My contribution",
        "paragraphs": [
          "I led the project from initial concept through production launch, coordinating engineering and business stakeholders and translating customer needs into delivery priorities.",
          "The implementation combined multi-LLM orchestration, specialised tools and retrieval-augmented generation. I worked on vector search, knowledge graphs and semantic routing, integrated speech transcription and translation, and owned backend deployment and maintenance on AWS ECS.",
          "I led CI/CD delivery, evolved conversation and document storage using PostgreSQL with vector search, and contributed to product discussions, customer engagement, pitches and fundraising preparation."
        ]
      },
      {
        "heading": "Outcome",
        "paragraphs": [
          "The project progressed from concept to a production product supporting company-knowledge answers and automated customer conversations."
        ]
      }
    ],
    "technologies": [
      "LLM orchestration",
      "RAG",
      "tool calling",
      "AWS ECS",
      "Docker",
      "PostgreSQL",
      "vector search"
    ],
    "updatedAt": "2026-10-21"
  },
  {
    "slug": "minervahub-portal-advisory",
    "title": "From organisational pain points to an employee-portal roadmap",
    "engagementId": "minervahub",
    "stage": "Advisory / blueprint / roadmap",
    "summary": "MinervaHub faced challenges in internal communication, knowledge sharing and cultural integration across its fashion and luxury supply-chain group.",
    "sections": [
      {
        "heading": "The need",
        "paragraphs": [
          "MinervaHub faced challenges in internal communication, knowledge sharing and cultural integration across its fashion and luxury supply-chain group."
        ]
      },
      {
        "heading": "My contribution",
        "paragraphs": [
          "I assessed those needs and worked backwards to define how an AI-enabled employee portal could address them. With the project team, I translated the findings into use cases, user journeys, access and governance requirements, and a portal blueprint.",
          "The architecture recommendations covered Microsoft/Azure services, single sign-on, AI-assisted document search, personalised content and enterprise integrations. The implementation roadmap connected proposed capabilities to organisational priorities."
        ]
      },
      {
        "heading": "Outcome",
        "paragraphs": [
          "The blueprint and roadmap informed prioritisation of the next phase."
        ]
      }
    ],
    "technologies": [
      "Client discovery",
      "use-case prioritisation",
      "solution architecture",
      "governance requirements and delivery planning"
    ],
    "updatedAt": "2026-10-19"
  },
  {
    "slug": "towardschange-enterprise-knowledge",
    "title": "Enterprise knowledge access across on-premise and cloud delivery",
    "engagementId": "towardschange",
    "stage": "Selected-user on-premise pilot; separate customer-used cloud-product contributions",
    "summary": "Enterprise knowledge assistants must fit the client's documents, workflows and hosting requirements. My work at TowardsChange covered two distinct solutions.",
    "sections": [
      {
        "heading": "The need",
        "paragraphs": [
          "Enterprise knowledge assistants must fit the client's documents, workflows and hosting requirements. My work at TowardsChange covered two distinct solutions."
        ]
      },
      {
        "heading": "On-premise Mistral/RAG pilot",
        "paragraphs": [
          "I translated confidentiality and internal hosting requirements into a self-hosted RAG solution using Mistral models on the client's infrastructure. Document retrieval and LLM processing remained within that environment. The pilot was used by selected client users."
        ]
      },
      {
        "heading": "FridayGPT cloud-product contributions",
        "paragraphs": [
          "Separately, I contributed to FridayGPT's enterprise knowledge assistant in a product used by customers. The work combined keyword, vector and semantic retrieval through Azure AI Search with source-referenced answers.",
          "I improved document preparation through email preprocessing and PDF-to-Markdown extraction with Azure Document Intelligence and contributed Python/FastAPI services for chat, embeddings and document question answering."
        ]
      },
      {
        "heading": "Outcome",
        "paragraphs": [
          "The on-premise work reached a selected-user pilot. The cloud contributions were deployed in the customer-used product."
        ]
      }
    ],
    "technologies": [
      "Mistral",
      "RAG",
      "Azure AI Search",
      "Azure Document Intelligence",
      "Python",
      "FastAPI"
    ],
    "updatedAt": "2026-10-19"
  },
  {
    "slug": "client-engagement-portal",
    "title": "Client engagement portal for an AI consulting firm",
    "engagementId": "supportful",
    "stage": "Delivered portal; prospective-client demonstrations",
    "summary": "Client leadership needed an accessible view of engagement progress, outstanding actions and the context of previous discussions.",
    "sections": [
      {
        "heading": "The need",
        "paragraphs": [
          "Client leadership needed an accessible view of engagement progress, outstanding actions and the context of previous discussions."
        ]
      },
      {
        "heading": "My contribution",
        "paragraphs": [
          "I collaborated on the design and development of a portal bringing together engagement updates, action ownership and answers grounded in previous meetings. It gave users a place to review progress and retrieve meeting context with references.",
          "The portal also supported demonstrations to prospective clients."
        ]
      },
      {
        "heading": "Outcome",
        "paragraphs": [
          "Demonstrations contributed to signed new client contracts."
        ]
      }
    ],
    "technologies": [
      "Client experience",
      "engagement visibility",
      "meeting knowledge and commercial demonstrations"
    ],
    "updatedAt": "2026-10-19",
    "context": "AI Consulting Firm"
  },
  {
    "slug": "sports-booking-agents",
    "title": "Conversational booking and analytics for sports facilities",
    "engagementId": "supportful",
    "stage": "Production",
    "summary": "The platform supported court and training bookings and gave managers access to operational information through conversation.",
    "sections": [
      {
        "heading": "The need",
        "paragraphs": [
          "The platform supported court and training bookings and gave managers access to operational information through conversation."
        ]
      },
      {
        "heading": "My contribution",
        "paragraphs": [
          "I built LangGraph/Gemini agents for web chat and WhatsApp covering availability, bookings, scheduling changes, cancellations, refunds and payments.",
          "I also developed a telephone agent that handled complete booking calls for courts and training sessions across football, basketball, padel and tennis facilities in Saudi Arabia.",
          "For managers, I built natural-language analytics that translated questions into interactive React charts covering revenue, bookings, payment methods, staffing and trainer performance.",
          "Reliability and accessibility work included Arabic support, image and voice-note processing, persistent memory, guardrails, human handover and automated LangSmith evaluations."
        ]
      },
      {
        "heading": "Outcome",
        "paragraphs": [
          "The web/WhatsApp agents, telephone booking agent and conversational analytics were used by real users in production. User feedback provided qualitative evidence of value."
        ]
      }
    ],
    "technologies": [
      "LangGraph",
      "Gemini",
      "React",
      "WhatsApp integration",
      "voice agents",
      "LangSmith"
    ],
    "updatedAt": "2026-10-19",
    "context": "Sports Facility Management Platform"
  },
  {
    "slug": "savencia-causal-inference",
    "title": "Causal analysis for industrial decision-making",
    "engagementId": "savencia",
    "stage": "Analysis and recommendations",
    "summary": "The project investigated factors influencing lactoferrin production yield, with the aim of informing industrial process decisions.",
    "sections": [
      {
        "heading": "The need",
        "paragraphs": [
          "The project investigated factors influencing lactoferrin production yield, with the aim of informing industrial process decisions."
        ]
      },
      {
        "heading": "My contribution",
        "paragraphs": [
          "I led the causal-inference analysis, developed Databricks workflows and applied methods including Double Machine Learning and causal forests with DoWhy, EconML and related tools.",
          "I presented causal diagrams, analytical assumptions, findings and process recommendations to R&D and engineering teams."
        ]
      },
      {
        "heading": "Outcome",
        "paragraphs": [
          "The work produced an analysis and recommendations to inform manufacturing decisions."
        ]
      }
    ],
    "technologies": [
      "Causal inference",
      "Databricks",
      "DoWhy",
      "EconML",
      "Double Machine Learning",
      "causal forests"
    ],
    "updatedAt": "2026-10-19"
  }
];

export function getCaseStudy(slug: string) { return caseStudies.find(item => item.slug === slug); }
