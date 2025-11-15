export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const base = `${url.protocol}//${url.host}`;

    // Menambahkan permintaan untuk SDG 9 hingga SDG 17
    const [res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11, res12, res13, res14, res15, res16, res17] = await Promise.all([
      fetch(`${base}/api/sdg-success-1`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-2`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-3`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-4`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-5`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-6`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-7`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-8`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-9`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-10`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-11`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-12`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-13`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-14`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-15`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-16`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-17`, { cache: "no-store" }),
    ]);

    // Mengambil JSON untuk setiap SDG
    const sdg1 = await res1.json();
    const sdg2 = await res2.json();
    const sdg3 = await res3.json();
    const sdg4 = await res4.json();
    const sdg5 = await res5.json();
    const sdg6 = await res6.json();
    const sdg7 = await res7.json();
    const sdg8 = await res8.json();
    const sdg9 = await res9.json();
    const sdg10 = await res10.json();
    const sdg11 = await res11.json();
    const sdg12 = await res12.json();
    const sdg13 = await res13.json();
    const sdg14 = await res14.json();
    const sdg15 = await res15.json();
    const sdg16 = await res16.json();
    const sdg17 = await res17.json();

    // Menggabungkan semua data dalam satu array
    const result = [
      sdg1, sdg2, sdg3, sdg4, sdg5, sdg6, sdg7, sdg8,
      sdg9, sdg10, sdg11, sdg12, sdg13, sdg14, sdg15, sdg16, sdg17
    ];

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    console.error("Aggregator error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

