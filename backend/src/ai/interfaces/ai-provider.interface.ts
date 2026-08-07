export interface AiProjectContext {
  project: {
    id: string;
    name: string;
    fullName: string;
    description?: string | null;
    language?: string | null;
    stars: number;
    forks: number;
    openIssues: number;
  };
  issues: Array<{
    title: string;
    state: string;
    author?: string | null;
  }>;
  pullRequests: Array<{
    title: string;
    state: string;
    author?: string | null;
  }>;
  activities?: Array<{
    type: string;
    title: string;
    createdAt: Date;
  }>;
}

export interface AiProjectAnalysis {
  overview: string;
  issueSummary: string;
  pullRequestSummary: string;
  activitySummary: string;
  recommendations: string[];
}

export interface IAiProvider {
  readonly name: string;
  generateSummary(context: AiProjectContext): Promise<string>;
  generateAnalysis(context: AiProjectContext): Promise<AiProjectAnalysis>;
  answerQuestion(context: AiProjectContext, question: string): Promise<string>;
}