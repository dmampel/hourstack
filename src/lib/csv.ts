import Papa from 'papaparse';
import { format } from 'date-fns';
import { Session } from '../types';
import { Project } from '../types';

/**
 * Exports sessions to a CSV file and triggers a browser download.
 */
export function exportSessionsToCSV(
  sessions: Session[],
  projects: Project[]
): void {
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const rows = sessions.map((session) => {
    const project = projectMap.get(session.projectId);
    const durationHours = session.duration / 3600;

    return {
      Project: project?.name ?? 'Unknown',
      Client: project?.client ?? 'Unknown',
      Date: format(new Date(session.startTime), 'yyyy-MM-dd'),
      'Duration (h)': durationHours.toFixed(2),
      Description: session.description,
      Earnings: session.earnings.toFixed(2),
    };
  });

  const csv = Papa.unparse(rows);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `hourstack-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
