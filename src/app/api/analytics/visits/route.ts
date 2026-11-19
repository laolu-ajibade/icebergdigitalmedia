import { NextResponse } from "next/server";
import { connectDB, memoryStore } from "@/lib/db";
import { VisitLog } from "@/models/VisitLog";
import { ensureSeeded } from "@/lib/seed";

export async function GET() {
  try {
    await ensureSeeded();
    const currentMonthKey = new Date().toISOString().slice(0, 7);

    const db = await connectDB();
    if (db) {
      const logs = await VisitLog.find().sort({ monthKey: -1 }).limit(12);
      const currentMonth = logs.find((l) => l.monthKey === currentMonthKey) || {
        monthKey: currentMonthKey,
        hits: memoryStore.monthlyVisits[currentMonthKey] || 1480,
        uniqueVisitors: 920,
      };

      return NextResponse.json({
        currentMonthKey,
        currentMonthHits: currentMonth.hits,
        currentMonthUniques: (currentMonth as any).uniqueVisitors || Math.round(currentMonth.hits * 0.65),
        history: logs,
      });
    }

    const hits = memoryStore.monthlyVisits[currentMonthKey] || 1480;
    return NextResponse.json({
      currentMonthKey,
      currentMonthHits: hits,
      currentMonthUniques: Math.round(hits * 0.65),
      history: [
        { monthKey: currentMonthKey, hits, uniqueVisitors: Math.round(hits * 0.65) },
        { monthKey: "2026-10", hits: 1320, uniqueVisitors: 840 },
        { monthKey: "2026-09", hits: 1190, uniqueVisitors: 750 },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    await ensureSeeded();
    const currentMonthKey = new Date().toISOString().slice(0, 7);

    const db = await connectDB();
    if (db) {
      const log = await VisitLog.findOneAndUpdate(
        { monthKey: currentMonthKey },
        {
          $inc: { hits: 1 },
          $set: { lastVisited: new Date() },
        },
        { new: true, upsert: true }
      );
      return NextResponse.json({ success: true, hits: log.hits });
    }

    memoryStore.monthlyVisits[currentMonthKey] = (memoryStore.monthlyVisits[currentMonthKey] || 1480) + 1;
    return NextResponse.json({ success: true, hits: memoryStore.monthlyVisits[currentMonthKey] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
