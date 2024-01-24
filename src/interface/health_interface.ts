interface HealthData {
    id: string;
    alamat_laporan: string;
    created_at: number; // Assuming you're using Firestore Timestamp
    institusi_pelapor: string;
    keluhan: string;
    latitude: number;
    longitude: number;
    nama_pasien: string;
    nama_pelapor: string;
    nomor_telepon_pelapor: string;
    pemberi_bantuan?: string[]; // Array of string, add the actual type if needed
    skala_sakit: string;
    status: string;
    waktu_laporan: string; // Assuming you're using Firestore Timestamp
}

export default HealthData