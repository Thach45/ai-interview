import { z } from 'zod';
import { DashboardDateRange } from '../enum/dashboard.enum';

export const getDashboardStatsSchema = z.object({
  query: z
    .object({
      dateRange: z.nativeEnum(DashboardDateRange).optional().default(DashboardDateRange.SEVEN_DAYS),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .refine(
      (data) => {
        // Nếu chọn custom thì phải truyền đủ startDate và endDate
        if (data.dateRange === DashboardDateRange.CUSTOM) {
          return !!data.startDate && !!data.endDate;
        }
        return true;
      },
      {
        message: "Vui lòng cung cấp startDate và endDate khi chọn dateRange là 'custom'",
        path: ['dateRange'],
      },
    ),
});

export type GetDashboardStatsQuery = z.infer<typeof getDashboardStatsSchema>['query'];

// DTO cho dữ liệu trả về (Response)
export const dashboardStatsResponseSchema = z.object({
  cards: z.object({
    revenue: z.object({ value: z.number(), trend: z.string() }),
    newUsers: z.object({ value: z.number(), trend: z.string() }),
    completedInterviews: z.object({ value: z.number(), trend: z.string() }),
    aiCost: z.object({ value: z.number(), trend: z.string() }),
  }),
  revenueChart: z.array(
    z.object({
      date: z.string(),
      amount: z.number(),
    }),
  ),
  recentTransactions: z.array(
    z.object({
      id: z.string(),
      user: z.string(),
      date: z.string(),
      amount: z.string(),
      credits: z.number(),
    }),
  ),
  recentInterviews: z
    .array(
      z.object({
        id: z.string(),
        user: z.string(),
        jobTitle: z.string(),
        date: z.string(),
        score: z.number(),
      }),
    )
    .optional(),
  interviewStats: z.object({
    voice: z.number(),
    text: z.number(),
  }),
  tokenChart: z
    .array(
      z.object({
        date: z.string(),
        input: z.number(),
        output: z.number(),
      }),
    )
    .optional(),
});

export type DashboardStatsResponse = z.infer<typeof dashboardStatsResponseSchema>;
