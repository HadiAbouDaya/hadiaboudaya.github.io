export interface SkillGroup {
  id: string;
  title: string;
  purpose: string;
  skills: string[];
  caseStudySlugs: string[];
}

/** Delivery capabilities supported by the linked cases, rather than a tool inventory. */
export const skillGroups: SkillGroup[] = [
  {
    id: "agents-and-integrations",
    title: "Agents and business integrations",
    purpose: "Connect conversational agents to the tools and workflows people already use.",
    skills: ["LangGraph", "Python / FastMCP", "Salesforce integration", "Tool calling", "A2A"],
    caseStudySlugs: ["salesforce-agent-mcp", "aws-agentic-platform-pilot"],
  },
  {
    id: "reliability-and-evaluation",
    title: "Reliability and evaluation",
    purpose: "Make agent behaviour usable through permissions, human review, recovery and evaluation.",
    skills: ["User permissions", "Human approvals", "State and memory", "Failure recovery", "LangSmith evaluations"],
    caseStudySlugs: ["salesforce-agent-mcp", "sports-booking-agents"],
  },
  {
    id: "knowledge-access",
    title: "Knowledge access",
    purpose: "Prepare business documents and retrieve useful context for grounded answers.",
    skills: ["RAG", "Hybrid retrieval", "Vector search", "Knowledge graphs", "Document preprocessing"],
    caseStudySlugs: ["towardschange-enterprise-knowledge", "mopo-conversational-ai"],
  },
  {
    id: "cloud-and-delivery",
    title: "Cloud and delivery",
    purpose: "Take an architecture through implementation, deployment and production maintenance.",
    skills: ["AWS ECS", "Amazon Bedrock / AgentCore", "Terraform", "Docker", "CI/CD"],
    caseStudySlugs: ["mopo-conversational-ai", "aws-agentic-platform-pilot"],
  },
  {
    id: "machine-learning",
    title: "Machine learning and causal analysis",
    purpose: "Translate industrial questions into analytical workflows and explain assumptions for decisions.",
    skills: ["Causal inference", "Databricks", "Double Machine Learning", "Causal forests", "DoWhy / EconML"],
    caseStudySlugs: ["savencia-causal-inference"],
  },
  {
    id: "consulting-and-architecture",
    title: "Consulting and architecture",
    purpose: "Work backwards from user needs to prioritise use cases, define architecture and plan delivery.",
    skills: ["Client discovery", "Use-case prioritisation", "Solution architecture", "Access and data governance", "Delivery planning"],
    caseStudySlugs: ["minervahub-portal-advisory", "mopo-conversational-ai"],
  },
];
