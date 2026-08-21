export const QUEUE_DEFINITIONS = [
  {
    name: 'analysisCvQueue',
    label: 'Phân tích CV',
    businessGroup: 'CV',
    concurrency: 5,
  },
  {
    name: 'optimizeCvQueue',
    label: 'Tối ưu CV',
    businessGroup: 'CV',
    concurrency: 5,
  },
  {
    name: 'interviewTimerQueue',
    label: 'Hẹn giờ phỏng vấn',
    businessGroup: 'Interview',
    concurrency: 10,
  },
  {
    name: 'interviewAnalysisQueue',
    label: 'Chấm điểm phỏng vấn',
    businessGroup: 'Interview',
    concurrency: 2,
  },
  {
    name: 'emailQueue',
    label: 'Email',
    businessGroup: 'Email',
    concurrency: 50,
  },
  {
    name: 'notificationQueue',
    label: 'Thông báo',
    businessGroup: 'Notification',
    concurrency: 1,
  },
] as const;

export const QUEUE_NAMES = QUEUE_DEFINITIONS.map((queue) => queue.name);

export type QueueName = (typeof QUEUE_NAMES)[number];
export type QueueBusinessGroup =
  (typeof QUEUE_DEFINITIONS)[number]['businessGroup'];
