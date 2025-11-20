import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { BusinessItem, BusinessMetrics } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeBusinessData = async (
  items: BusinessItem[], 
  metrics: BusinessMetrics, 
  userQuery: string
): Promise<string> => {
  if (!apiKey) {
    return "API Key Gemini tidak ditemukan. Mohon pastikan environment variable API_KEY telah diatur.";
  }

  const dataContext = JSON.stringify({
    summary: metrics,
    inventory_sample: items.slice(0, 20).map(item => ({
      name: item.name,
      stock: item.stock,
      buy: item.capitalPrice,
      sell: item.sellingPrice,
      margin: item.sellingPrice - item.capitalPrice
    }))
  });

  const systemPrompt = `
    Anda adalah konsultan bisnis ahli untuk UMKM (Usaha Mikro Kecil Menengah) di Indonesia.
    Tugas anda adalah membantu pemilik bisnis menganalisis data stok dan keuangan mereka.
    
    Konteks Data Bisnis Saat Ini (JSON):
    ${dataContext}
    
    Instruksi:
    1. Jawab pertanyaan pengguna berdasarkan data di atas.
    2. Berikan saran taktis untuk meningkatkan keuntungan, mengelola stok mati, atau strategi harga.
    3. Gunakan Bahasa Indonesia yang profesional namun mudah dipahami (ramah).
    4. Format jawaban dengan rapi (gunakan bullet points jika perlu).
    5. Jika data kosong, berikan saran umum untuk memulai bisnis.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'user', parts: [{ text: userQuery }] }
      ],
    });

    return response.text || "Maaf, saya tidak dapat menghasilkan analisa saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI. Coba lagi nanti.";
  }
};
