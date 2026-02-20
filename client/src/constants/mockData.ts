import type { ITask } from '../types';

export const MOCK_TASKS: ITask[] = [
    {
        id: 1,
        title: 'Complete Math Assignment',
        description: 'Solve exercises 1-10 from the calculus textbook and submit them via the student portal.',
        status: 'New',
        createdAt: '2026-02-19T09:00:00Z',
        updatedAt: '2026-02-19T10:00:00Z',
    },
    {
        id: 2,
        title: 'Physics Lab Report',
        description: 'Draft the experiment results for the optics lab and include graphs.',
        status: 'Ready for Implementation',
        createdAt: '2026-02-19T10:30:00Z',
        updatedAt: '2026-02-19T11:30:00Z',
    },
    {
        id: 3,
        title: 'History Presentation Review',
        description: 'The teacher has assigned the peer review for the ancient civilizations project.',
        status: 'Assigned',
        createdAt: '2026-02-19T11:00:00Z',
        updatedAt: '2026-02-19T12:00:00Z',
    },
    {
        id: 4,
        title: 'Project Code Refactoring',
        description: 'Working on improving the logic for the DBMS individual project.',
        status: 'In Progress',
        createdAt: '2026-02-19T13:45:00Z',
        updatedAt: '2026-02-19T14:45:00Z',
    },
    {
        id: 5,
        title: 'English Essay Submission',
        description: 'The essay on Shakespeare is ready for checking by the grammar assistant.',
        status: 'Moved to QA',
        createdAt: '2026-02-19T15:20:00Z',
        updatedAt: '2026-02-19T16:20:00Z',
    },
    {
        id: 6,
        title: 'Computer Science Quiz Prep',
        description: 'Self-test failed on the data structures module; need to restudy binary trees.',
        status: 'QA Failed',
        createdAt: '2026-02-19T17:15:00Z',
        updatedAt: '2026-02-20T09:15:00Z',
    },
    {
        id: 7,
        title: 'Final Thesis Defense Prep',
        description: 'Slides are approved and ready for the mock defense session.',
        status: 'QA Pass Ready for Stage',
        createdAt: '2026-02-19T18:00:00Z',
        updatedAt: '2026-02-20T10:00:00Z',
    },
    {
        id: 8,
        title: 'Reading List Update',
        description: 'Add new research papers to the bibliography for the sociology term paper.',
        status: 'New',
        createdAt: '2026-02-20T10:00:00Z',
        updatedAt: '2026-02-20T11:00:00Z',
    }
];
