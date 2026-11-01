export type PrdTemplate =
  | "Standar"
  | "Startup"
  | "Enterprise"
  | "Mobile"
  | "SaaS"
  | "Marketplace";

export type PrdInput = {
  title: string;
  description: string;
  targetUser: string;
  problem: string;
  features: string;
  timeline?: string;
  constraints?: string;
  metrics?: string;
  template?: PrdTemplate;
};

export type PrdSummary = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type PrdDetail = PrdSummary & {
  targetUser: string;
  problem: string;
  features: string;
  timeline: string | null;
  constraints: string | null;
  metrics: string | null;
  content: string;
  isPublic: boolean;
};

export type PrdVersionItem = {
  id: string;
  content: string;
  createdAt: string;
};

export type SharedPrd = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
  };
};
