import dayjs from 'dayjs';
import { GetDashboardStatsQuery } from '../../validations/dashboard-admin.validation';
import prisma from '../../config/prisma';
import { encode } from 'gpt-tokenizer';

export class DashboardService {
  private getDateBounds(params: GetDashboardStatsQuery) {
    let start: dayjs.Dayjs;
    let end: dayjs.Dayjs;
    let prevStart: dayjs.Dayjs;
    let prevEnd: dayjs.Dayjs;

    const now = dayjs();

    switch (params.dateRange) {
      case '7days':
        start = now.subtract(6, 'day').startOf('day');
        end = now.endOf('day');
        prevStart = start.subtract(7, 'day');
        prevEnd = start.subtract(1, 'millisecond');
        break;
      case 'this_month':
        start = now.startOf('month');
        end = now.endOf('day');
        prevStart = now.subtract(1, 'month').startOf('month');
        prevEnd = now.subtract(1, 'month').endOf('month');
        break;
      case 'last_month':
        start = now.subtract(1, 'month').startOf('month');
        end = now.subtract(1, 'month').endOf('month');
        prevStart = now.subtract(2, 'month').startOf('month');
        prevEnd = now.subtract(2, 'month').endOf('month');
        break;
      case 'custom':
        start = dayjs(params.startDate).startOf('day');
        end = dayjs(params.endDate).endOf('day');
        const diff = end.diff(start, 'day') + 1;
        prevStart = start.subtract(diff, 'day');
        prevEnd = start.subtract(1, 'millisecond');
        break;
      default:
        start = now.subtract(6, 'day').startOf('day');
        end = now.endOf('day');
        prevStart = start.subtract(7, 'day');
        prevEnd = start.subtract(1, 'millisecond');
    }

    return {
      start: start.toDate(),
      end: end.toDate(),
      prevStart: prevStart.toDate(),
      prevEnd: prevEnd.toDate(),
    };
  }

  private calculateTrend(current: number, previous: number) {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const diff = current - previous;
    const percent = Math.round((diff / previous) * 100);
    return percent >= 0 ? `+${percent}%` : `${percent}%`;
  }

  async getDashboardStats(params: GetDashboardStatsQuery) {
    const { start, end, prevStart, prevEnd } = this.getDateBounds(params);

    // 1. Doanh thu (Tổng tiền từ các giao dịch SUCCESS)
    const [currentTransactions, previousTransactions] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS', createdAt: { gte: start, lte: end } },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS', createdAt: { gte: prevStart, lte: prevEnd } },
      }),
    ]);
    const currentRevenue = currentTransactions._sum.amount || 0;
    const prevRevenue = previousTransactions._sum.amount || 0;
    const revenueTrend = this.calculateTrend(currentRevenue, prevRevenue);

    // 2. Người dùng mới
    const [currentUsers, prevUsers] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.user.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
    ]);
    const usersTrend = this.calculateTrend(currentUsers, prevUsers);

    // 3. Phỏng vấn hoàn thành
    const [currentSessions, prevSessions] = await Promise.all([
      prisma.interviewSession.count({
        where: { status: 'COMPLETED', createdAt: { gte: start, lte: end } },
      }),
      prisma.interviewSession.count({
        where: { status: 'COMPLETED', createdAt: { gte: prevStart, lte: prevEnd } },
      }),
    ]);
    const sessionsTrend = this.calculateTrend(currentSessions, prevSessions);

    // 4. Chi phí AI (Ước tính: Text = 500đ, Video = 2000đ)
    const currentCompletedSessionsList = await prisma.interviewSession.findMany({
      where: { status: 'COMPLETED', createdAt: { gte: start, lte: end } },
      select: { mode: true },
    });
    const prevCompletedSessionsList = await prisma.interviewSession.findMany({
      where: { status: 'COMPLETED', createdAt: { gte: prevStart, lte: prevEnd } },
      select: { mode: true },
    });

    const calculateAICost = (sessions: { mode: string }[]) => {
      return sessions.reduce((total, session) => {
        return total + (session.mode === 'VIDEO' ? 2000 : 500);
      }, 0);
    };

    const currentAICost = calculateAICost(currentCompletedSessionsList);
    const prevAICost = calculateAICost(prevCompletedSessionsList);
    const aiCostTrend = this.calculateTrend(currentAICost, prevAICost);

    // 5. Biểu đồ doanh thu (Nhóm theo ngày)
    const transactionsInRange = await prisma.transaction.findMany({
      where: { status: 'SUCCESS', createdAt: { gte: start, lte: end } },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const chartData: Record<string, number> = {};
    let currDay = dayjs(start);
    const endDay = dayjs(end);
    while (currDay.isBefore(endDay) || currDay.isSame(endDay, 'day')) {
      chartData[currDay.format('YYYY-MM-DD')] = 0;
      currDay = currDay.add(1, 'day');
    }

    transactionsInRange.forEach((tx) => {
      const dateKey = dayjs(tx.createdAt).format('YYYY-MM-DD');
      if (chartData[dateKey] !== undefined) {
        chartData[dateKey] += tx.amount;
      }
    });

    const revenueChart = Object.keys(chartData).map((date) => ({
      date,
      amount: chartData[date],
    }));

    // 6. Giao dịch mới nhất (Top 10)
    const recentTransactions = await prisma.transaction.findMany({
      where: { status: 'SUCCESS' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { fullName: true, email: true } },
      },
    });

    // 7. Thống kê tỷ lệ Voice/Text
    const totalVoice = currentCompletedSessionsList.filter((s) => s.mode === 'VIDEO').length;
    const totalText = currentCompletedSessionsList.filter((s) => s.mode === 'TEXT').length;

    // 8. Phiên phỏng vấn gần đây
    const recentInterviews = await prisma.interviewSession.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { fullName: true, email: true } },
        result: { select: { overallScore: true } },
      },
    });

    // 9. Tính toán Token Chart
    const messages = await prisma.interviewMessage.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        role: true,
        content: true,
        createdAt: true,
      },
    });

    const tokenChartData: Record<string, { input: number; output: number }> = {};
    let currentTokenDay = dayjs(start);
    while (currentTokenDay.isBefore(end) || currentTokenDay.isSame(end, 'day')) {
      tokenChartData[currentTokenDay.format('YYYY-MM-DD')] = { input: 0, output: 0 };
      currentTokenDay = currentTokenDay.add(1, 'day');
    }

    for (const msg of messages) {
      const dateStr = dayjs(msg.createdAt).format('YYYY-MM-DD');
      if (tokenChartData[dateStr]) {
        const tokens = encode(msg.content || '').length;
        if (msg.role === 'USER') {
          tokenChartData[dateStr].input += tokens;
        } else if (msg.role === 'AI') {
          tokenChartData[dateStr].output += tokens;
        }
      }
    }

    const tokenChart = Object.keys(tokenChartData).map((date) => ({
      date,
      input: tokenChartData[date].input,
      output: tokenChartData[date].output,
    }));

    return {
      cards: {
        revenue: { value: currentRevenue, trend: revenueTrend },
        newUsers: { value: currentUsers, trend: usersTrend },
        completedInterviews: { value: currentSessions, trend: sessionsTrend },
        aiCost: { value: currentAICost, trend: aiCostTrend },
      },
      revenueChart,
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id,
        user: tx.user.fullName || tx.user.email,
        date: dayjs(tx.createdAt).format('HH:mm DD/MM/YYYY'),
        amount: `${tx.amount.toLocaleString()} đ`,
        credits: tx.creditsAdded,
      })),
      recentInterviews: recentInterviews.map((session) => ({
        id: session.id,
        user: session.user.fullName || session.user.email,
        jobTitle: session.jobTitle,
        date: dayjs(session.createdAt).format('HH:mm DD/MM/YYYY'),
        score: session.result?.overallScore || 0,
      })),
      interviewStats: {
        voice: totalVoice,
        text: totalText,
      },
      tokenChart,
    };
  }
}

export const dashboardService = new DashboardService();
