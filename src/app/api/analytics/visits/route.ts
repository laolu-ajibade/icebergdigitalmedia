import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { VisitLog } from "@/models/VisitLog";
import { getAdminSession } from "@/lib/auth";
import { checkRateLimit, getClientIp, recordFailedAttempt } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const MAX_VISITS_PER_WINDOW = 10;
const VISIT_WINDOW_MS = 10 * 60 * 1000;

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const currentMonthKey = new Date().toISOString().slice(0, 7);
    const logs = await VisitLog.find().sort({ monthKey: -1 }).limit(12);
    const currentMonth = logs.find((l) => l.monthKey === currentMonthKey) || {
      monthKey: currentMonthKey,
      hits: 0,
      uniqueVisitors: 0,
    };

    return NextResponse.json({
      currentMonthKey,
      currentMonthHits: currentMonth.hits,
      currentMonthUniques: Number((currentMonth as any).uniqueVisitors) || 0,
      history: logs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `visit-log:${ip}`;
    const { allowed } = checkRateLimit(rateLimitKey, MAX_VISITS_PER_WINDOW);
    if (!allowed) {
      return NextResponse.json({ success: true, rateLimited: true });
    }
    recordFailedAttempt(rateLimitKey, VISIT_WINDOW_MS);

    await connectDB();
    const currentMonthKey = new Date().toISOString().slice(0, 7);
    const log = await VisitLog.findOneAndUpdate(
      { monthKey: currentMonthKey },
      {
        $inc: { hits: 1 },
        $set: { lastVisited: new Date() },
      },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, hits: log.hits });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
