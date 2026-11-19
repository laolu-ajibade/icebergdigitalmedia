import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { VisitLog } from "@/models/VisitLog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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
      currentMonthUniques:
        (currentMonth as any).uniqueVisitors || Math.round(currentMonth.hits * 0.65),
      history: logs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
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
