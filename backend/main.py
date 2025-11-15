from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import pickle
from pathlib import Path
from supabase_utils import supabase_update

app = FastAPI(title="SDGs Clustering API")

# 🔐 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run-clustering")
async def run_clustering(request: Request):
    body = await request.json()
    sdg_number = body.get("sdg_number")
    data = body.get("data", [])

    if not sdg_number or not data:
        return {"error": "sdg_number dan data wajib diisi"}

    df = pd.DataFrame(data)
    model_path = Path(f"models/model_sdg{sdg_number}.pkl")

    if not model_path.exists():
        return {"error": f"Model SDG {sdg_number} belum tersedia. Tambahkan file {model_path.name} ke folder /models."}

    # 🔹 Load model
    try:
        model = pickle.load(open(model_path, "rb"))
        model_type = type(model).__name__
        print(f"🧠 Model SDG {sdg_number} terdeteksi: {model_type}")
    except Exception as e:
        return {"error": f"Gagal memuat model: {str(e)}"}

    # 🔹 Load fitur & indeks kategori
    features_path = Path(f"models/features_sdg{sdg_number}.pkl")
    cat_idx_path = Path(f"models/cat_idx_sdg{sdg_number}.pkl")

    if not features_path.exists() or not cat_idx_path.exists():
        return {"error": f"File fitur atau indeks kategori tidak ditemukan untuk SDG {sdg_number}."}

    try:
        features = pickle.load(open(features_path, "rb"))
        cat_idx = pickle.load(open(cat_idx_path, "rb"))
    except Exception as e:
        return {"error": f"Gagal memuat file fitur/indeks kategori: {str(e)}"}

    # 🔹 Siapkan data prediksi
    try:
        df_for_predict = df[features].copy()
    except KeyError as e:
        return {"error": f"Kolom hilang di data input: {str(e)}"}

    num_cols = [features[i] for i in range(len(features)) if i not in cat_idx]
    cat_cols = [features[i] for i in cat_idx]

    for c in cat_cols:
        df_for_predict[c] = df_for_predict[c].astype(str)

    X_predict = df_for_predict.to_numpy()

    # 🔹 Prediksi cluster (otomatis deteksi jenis model)
    try:
        if hasattr(model, "predict"):
            # 1️⃣ Jika model K-Prototypes
            if "categorical" in model.predict.__code__.co_varnames:
                df["cluster"] = model.predict(X_predict, categorical=cat_idx)
            # 2️⃣ Jika model K-Means (sklearn)
            elif "kmodes" not in model_type.lower():
                df["cluster"] = model.predict(X_predict)
            # 3️⃣ Jika model KModes
            else:
                df["cluster"] = model.predict(X_predict, categorical=cat_idx)
        else:
            raise ValueError("Model tidak memiliki fungsi predict()")
    except Exception as e:
        return {"error": f"Gagal melakukan prediksi: {str(e)}"}

    # 🔢 Pemetaan arti_cluster
    arti_maps = {
        1: {0: "Desa Prioritas Penanganan Kemiskinan", 1: "Desa dengan Kemiskinan Terdata Rendah"},
        2: {0: "Rentan Pangan", 1: "Sedang", 2: "Tahan Pangan"},
        3: {0: "Rendah Kesehatan", 1: "Menengah", 2: "Sehat"},
        4: {0: "Akses Pendidikan Rendah", 1: "Cukup", 2: "Tinggi"},
        5: {0: "Ketimpangan Gender Tinggi", 1: "Sedang", 2: "Setara"},
        6: {0: "Kualitas Air Buruk", 1: "Sedang", 2: "Baik"},
        7: {0: "Energi Tidak Terjangkau", 1: "Sedang", 2: "Terjangkau dan Bersih"},
        8: {0: "Ekonomi Rendah", 1: "Berkembang", 2: "Inklusif dan Berkelanjutan"},
        9: {0: "Infrastruktur Lemah", 1: "Sedang", 2: "Inovatif & Berdaya Saing"},
        10: {0: "Ketimpangan Tinggi", 1: "Sedang", 2: "Inklusif"},
        11: {0: "Kota Tidak Layak Huni", 1: "Layak", 2: "Berkelanjutan"},
        12: {0: "Konsumsi Tidak Bertanggungjawab", 1: "Sedang", 2: "Bertanggungjawab"},
        13: {0: "Respon Iklim Rendah", 1: "Menengah", 2: "Adaptif terhadap Iklim"},
        14: {0: "Laut Terancam", 1: "Sedang", 2: "Sehat dan Terlindungi"},
        15: {0: "Ekosistem Rusak", 1: "Sedang", 2: "Lestari"},
        16: {0: "Institusi Lemah", 1: "Sedang", 2: "Kuat dan Damai"},
        17: {0: "Kemitraan Lemah", 1: "Sedang", 2: "Kuat dan Kolaboratif"},
    }

    arti_map = arti_maps.get(int(sdg_number), {0: "Tertinggal", 1: "Menengah", 2: "Maju"})
    df["arti_cluster"] = df["cluster"].map(arti_map)

    # 🔹 Update hasil ke Supabase
    updated = supabase_update(sdg_number, df)

    # 🔹 Kembalikan hasil ke frontend
    result_data = df.to_dict(orient="records")

    return {
        "message": f"Clustering berhasil untuk SDG {sdg_number}",
        "count": updated,
        "results": result_data
    }


# 🚀 Jalankan backend
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)

