import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string
);

interface SDGData {
  nama_desa: string;
  [key: string]: any;
}

// 🔢 Fungsi untuk skor numerik (semakin kecil makin baik)
function numericScore(value: number, max: number = 50): number {
  if (typeof value !== "number" || isNaN(value)) return 0;
  return Math.max(0, (1 - value / max)) * 100;
}

// 🔤 Fungsi untuk skor kategori (aman dari tipe non-string)
function categoryScore(key: string, value: any): number {
  if (value === null || value === undefined) return 0;
  const v = String(value).toLowerCase().trim(); // pastikan selalu string

  switch (key) {
    // Kejadian Kearawanan Pangan
    case "r711jk2":
      if (v.includes("tidak ada")) return 100;
      if (v.includes("ada")) return 0;
      return 50;

    // Penggalakan penggunaan pupuk organik
    case "r515c":
      if (v.includes("tidak ada")) return 0;
      if (v.includes("ada")) return 100;
      return 50;

    // Akses jalan pertanian
    case "r403c2":
      if (v.includes("sep sepanjang tahun")) return 100;
      if (v.includes("kecuali saat hujan")) return 80;
      if (v.includes("sep")) return 100; // fallback: kalau ada kata 'sep...' = sepanjang tahun
      return 50;

    default:
      return 0;
  }
}

// 🔍 Hitung rata-rata keberhasilan SDG 2
async function calculateSdg2Success(data: SDGData[]): Promise<number> {
  if (!data || data.length === 0) return 0;

  const total: number[] = [];
  for (const row of data) {
    const scores: number[] = [];

    // 🔢 Kolom numerik
    scores.push(numericScore(row["r709"])); // jumlah penderita gizi buruk
    scores.push(numericScore(row["r603"])); // luas areal pertanian terdampak bencana

    // 🔤 Kolom kategori
    scores.push(categoryScore("r711jk2", row["r711jk2"])); // kearawanan pangan
    scores.push(categoryScore("r515c", row["r515c"])); // pupuk organik
    scores.push(categoryScore("r403c2", row["r403c2"])); // akses jalan pertanian

    const validScores = scores.filter((s) => !isNaN(s));
    if (validScores.length > 0) {
      const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
      total.push(avg);
    }
  }

  const overall =
    total.length > 0
      ? total.reduce((a, b) => a + b, 0) / total.length
      : 0;

  return parseFloat(overall.toFixed(2));
}

// 🧩 Endpoint utama
export async function GET(): Promise<Response> {
  try {
    const { data: rows, error } = await supabase.from("sdgs_2").select("*");
    if (error) throw new Error(error.message);

    let successPercentage = 0;
    if (rows && rows.length > 0) {
      successPercentage = await calculateSdg2Success(rows);
    }

    return new Response(
      JSON.stringify({ goalNo: 2, successPercentage }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in sdg-success-2:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
