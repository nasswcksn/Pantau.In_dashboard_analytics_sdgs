import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function GET(req: NextRequest) {
  try {
    // Ambil data dari sdgs_1
    const { data: rows, error } = await supabase.from("sdgs_1").select("*");
    if (error) throw new Error(error.message);

    // Ambil label
    const { data: labels } = await supabase
      .from("feature_label")
      .select("kode_kolom,nama_kolom,arti_data");

    const labelMap: Record<string, string> = {};
    labels?.forEach((l: any) => {
      labelMap[l.kode_kolom] = l.nama_kolom;
    });

    // Transformasi data agar readable
    const sample = (rows ?? []).slice(0, 8).map((row: any) => {
      const mapped: Record<string, any> = { nama_desa: row.nama_desa };
      Object.keys(row).forEach((k) => {
        if (k !== "nama_desa" && labelMap[k]) {
          mapped[labelMap[k]] = row[k];
        }
      });
      return mapped;
    });

    // Prompt insight
    const prompt = `
      Anda adalah analis data. Berikut contoh data SDG 1 (tanpa kemiskinan) untuk beberapa desa:
      ${JSON.stringify(sample, null, 2)}

      Buat ringkasan insight singkat (3-5 kalimat) mengenai kondisi kemiskinan berdasarkan data ini.
      Gunakan bahasa sederhana dan informatif.
    `;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return new Response(JSON.stringify({ insight: answer }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
