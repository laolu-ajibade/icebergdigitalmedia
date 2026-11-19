import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import { SiteSettings } from "@/models/SiteSettings";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const [siteSettings, reviewsList] = await Promise.all([
      SiteSettings.findOne(),
      Review.find(all ? {} : { featured: true }).sort({ order: 1, createdAt: -1 }),
    ]);

    const googlePlaceId =
      process.env.GOOGLE_PLACE_ID ||
      siteSettings?.googlePlaceId ||
      "ChIJvQSY9_iNOxARaGAAOwEgnZA";
    const googleReviewUrl = "https://g.page/r/CWhgADsBIJ2QEBM/review";
    const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`;

    const formattedReviews = reviewsList.map((r: any) => ({
      _id: r._id.toString(),
      id: r._id.toString(),
      authorName: r.authorName,
      authorImage: r.authorImage || "",
      authorPhoto: r.authorImage || "",
      rating: r.rating || 5,
      reviewDate: r.reviewDate || "Recently",
      relativeTimeDescription: r.reviewDate || "Recently",
      text: r.text,
      photos: r.photos || [],
      ownerResponse: r.responseFromOwner || "",
      responseFromOwner: r.responseFromOwner || "",
      responseDate: r.responseDate || "",
      isVerified: r.isVerified !== false,
      featured: r.featured !== false,
      order: r.order || 0,
      source: r.source || "google",
    }));

    const avgRating =
      formattedReviews.length > 0
        ? Number(
            (
              formattedReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
              formattedReviews.length
            ).toFixed(1)
          )
        : 5.0;

    const customRating = Number(siteSettings?.reviewsOverallRating) || 0;
    const effectiveRating =
      customRating > 0 && customRating <= 5 ? customRating : avgRating;
    const trustedCount = siteSettings?.reviewsTrustedCount || "500+";

    return NextResponse.json({
      rating: effectiveRating,
      calculatedRating: avgRating,
      customRating,
      trustedCount,
      totalReviews: formattedReviews.length,
      reviews: formattedReviews,
      isLive: false,
      isVerifiedRealData: true,
      googleReviewUrl,
      googleMapsUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { rating: 5.0, totalReviews: 0, reviews: [], error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    if (!data.authorName || !data.text) {
      return NextResponse.json(
        { error: "Author name and review text are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const created = await Review.create({
      authorName: data.authorName.trim(),
      authorImage: data.authorImage || "",
      rating: Number(data.rating) || 5,
      reviewDate: data.reviewDate || "Recently",
      text: data.text.trim(),
      photos: Array.isArray(data.photos) ? data.photos : [],
      responseFromOwner: (data.responseFromOwner || data.ownerResponse || "").trim(),
      responseDate: data.responseDate || (data.responseFromOwner ? "Recently" : ""),
      isVerified: data.isVerified !== false,
      featured: data.featured !== false,
      order: Number(data.order) || 0,
      source: data.source || "google",
    });

    return NextResponse.json({ review: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
