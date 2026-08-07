import { Injectable } from '@nestjs/common';
import { IAiProvider, AiProjectContext, AiProjectAnalysis } from '../interfaces/ai-provider.interface';

@Injectable()
export class MockAiProvider implements IAiProvider {
  readonly name = 'MOCK_LOCAL_PROVIDER';

  async generateSummary(context: AiProjectContext): Promise<string> {
    const { project, issues, pullRequests } = context;
    const openIssuesCount = issues.filter((i) => i.state === 'open').length;
    const openPrsCount = pullRequests.filter((pr) => pr.state === 'open').length;

    return (
      `Project Summary for ${project.fullName}:\n` +
      `- Language: ${project.language || 'Unspecified'}\n` +
      `- Stats: ${project.stars} stars, ${project.forks} forks.\n` +
      `- Health Snapshot: ${issues.length} tracked issue(s) (${openIssuesCount} open), ` +
      `${pullRequests.length} pull request(s) (${openPrsCount} open).`
    );
  }

  async generateAnalysis(context: AiProjectContext): Promise<AiProjectAnalysis> {
    const { project, issues, pullRequests, activities = [] } = context;

    const openIssues = issues.filter((i) => i.state === 'open');
    const closedIssues = issues.filter((i) => i.state === 'closed');
    const openPrs = pullRequests.filter((pr) => pr.state === 'open');
    const mergedPrs = pullRequests.filter((pr) => pr.state === 'closed' || pr.state === 'merged');

    const recommendations: string[] = [];
    if (openIssues.length > 10) {
      recommendations.push('High open issue count detected. Consider triaging bug reports.');
    }
    if (openPrs.length > 5) {
      recommendations.push('Multiple pull requests pending review. Prioritize code reviews.');
    }
    if (activities.length === 0) {
      recommendations.push('No recent project activity logged. Sync repository data.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Repository metrics look healthy. Continue regular maintainer workflows.');
    }

    return {
      overview: `${project.fullName} is a ${project.language || 'multi-language'} repository currently tracking ${issues.length} total issues and ${pullRequests.length} pull requests.`,
      issueSummary: `Total Issues: ${issues.length} | Open: ${openIssues.length} | Closed: ${closedIssues.length}`,
      pullRequestSummary: `Total Pull Requests: ${pullRequests.length} | Open: ${openPrs.length} | Merged/Closed: ${mergedPrs.length}`,
      activitySummary: `Total Recorded Activities: ${activities.length}. Latest activity: ${activities[0]?.title || 'None recorded'}.`,
      recommendations,
    };
  }

  async answerQuestion(context: AiProjectContext, question: string): Promise<string> {
    const lowerQ = question.toLowerCase();
    const { project, issues, pullRequests } = context;

    if (lowerQ.includes('issue') || lowerQ.includes('bug')) {
      const open = issues.filter((i) => i.state === 'open');
      return `There are currently ${issues.length} total issues recorded for ${project.name} (${open.length} open). Top issues include: ${issues.slice(0, 3).map((i) => `"${i.title}"`).join(', ') || 'None'}.`;
    }

    if (lowerQ.includes('pr') || lowerQ.includes('pull request')) {
      const openPrs = pullRequests.filter((pr) => pr.state === 'open');
      return `There are currently ${pullRequests.length} pull requests (${openPrs.length} open). Recent PRs: ${pullRequests.slice(0, 3).map((p) => `"${p.title}"`).join(', ') || 'None'}.`;
    }

    return `Project ${project.fullName} has ${project.stars} stars, ${project.forks} forks, ${issues.length} issues, and ${pullRequests.length} pull requests recorded in the database.`;
  }
}