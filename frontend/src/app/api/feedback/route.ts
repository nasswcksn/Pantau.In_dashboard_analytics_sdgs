import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";

function hasEnv() {
  return Boolean(url && key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validasi input
    const { sdg_goal, problem_title, problem_description, location_lat, location_lon, reporter_name, reporter_contact, theme } = body;

    if (!sdg_goal || !problem_title || !problem_description || !reporter_name) {
      return NextResponse.json(
        { error: "sdg_goal, problem_title, problem_description, dan reporter_name wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi SDG goal (1-17)
    const goalNum = parseInt(sdg_goal, 10);
    if (isNaN(goalNum) || goalNum < 1 || goalNum > 17) {
      return NextResponse.json(
        { error: "sdg_goal harus berupa angka antara 1-17" },
        { status: 400 }
      );
    }

    // Validasi koordinat jika ada
    if (location_lat !== undefined && location_lon !== undefined) {
      const lat = parseFloat(location_lat);
      const lon = parseFloat(location_lon);
      if (!isFinite(lat) || !isFinite(lon)) {
        return NextResponse.json(
          { error: "Koordinat lokasi tidak valid" },
          { status: 400 }
        );
      }
    }

    // Fallback jika env kosong
    if (!hasEnv()) {
      return NextResponse.json(
        {
          message: "Feedback berhasil disimpan (demo mode)",
          data: {
            sdg_goal: goalNum,
            problem_title,
            problem_description,
            reporter_name,
            status: "Diajukan",
          },
        },
        { status: 201 }
      );
    }

    // Koneksi ke Supabase
    const supabase = createClient(url, key);

    // Siapkan data untuk disimpan
    const feedbackData = {
      sdg_goal: goalNum,
      problem_title,
      problem_description,
      location_lat: location_lat ? parseFloat(location_lat) : null,
      location_lon: location_lon ? parseFloat(location_lon) : null,
      reporter_name,
      reporter_contact: reporter_contact || null,
      status: "Diajukan",
      theme: theme || null,
    };

    // Insert ke tabel feedback_sdgs
    const { data, error } = await supabase
      .from("feedback_sdgs")
      .insert([feedbackData])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Gagal menyimpan feedback: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Feedback berhasil disimpan",
        data: data?.[0] || feedbackData,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

// GET endpoint untuk mengambil semua feedback atau filter berdasarkan SDG goal
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const goalStr = searchParams.get("goal");

    if (!hasEnv()) {
      // Demo data
      return NextResponse.json([
        {
          id: "demo-1",
          sdg_goal: 1,
          problem_title: "Kemiskinan di Desa A",
          problem_description: "Tingkat kemiskinan masih tinggi",
          location_lat: -7.806,
          location_lon: 112.017,
          reporter_name: "Budi",
          status: "Diajukan",
        },
      ]);
    }

    const supabase = createClient(url, key);
    let query = supabase.from("feedback_sdgs").select("*");

    if (goalStr) {
      const goalNum = parseInt(goalStr, 10);
      if (!isNaN(goalNum) && goalNum >= 1 && goalNum <= 17) {
        query = query.eq("sdg_goal", goalNum);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Gagal mengambil feedback: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
