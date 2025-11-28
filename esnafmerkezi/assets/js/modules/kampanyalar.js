// assets/js/modules/kampanyalar.js

// Supabase Ayarları
const SUPABASE_URL = 'https://nauikwtxhfpvxjyaziao.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdWlrd3R4aGZwdnhqeWF6aWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTc2MDgsImV4cCI6MjA3OTg5MzYwOH0.vDSkoEVCUHtXVLrYuvHWkqcaNbY-UwbkwdBUAe0K0kQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export async function loadKampanyalar() {
    const kampanyalarContainer = document.getElementById('kampanyalarListesi');

    try {
        // Yükleniyor ikonu
        kampanyalarContainer.innerHTML = '<div class="text-center w-100 p-4"><div class="spinner-border text-secondary" role="status"></div></div>';

        // Veritabanından verileri çek
        // select içindeki kısım çok önemli: kampanyalar tablosundaki her şeyi al (*)
        // VE esnaflar tablosundan da dükkanın adını (ad) al.
        let { data: kampanyalar, error } = await supabase
            .from('kampanyalar')
            .select('*, esnaflar(ad, resim_url)');

        if (error) throw error;

        if (!kampanyalar || kampanyalar.length === 0) {
            kampanyalarContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Şu an aktif kampanya bulunmuyor.</p></div>';
            return;
        }

        kampanyalarContainer.innerHTML = kampanyalar.map(kampanya => {
            // Eğer esnaf silinmişse veya veri yoksa hata vermesin diye kontrol
            const esnafAdi = kampanya.esnaflar ? kampanya.esnaflar.ad : 'Bilinmeyen Esnaf';

            return `
            <div class="col-md-6 col-lg-4">
                <div class="card kampanya-card h-100 shadow-sm border-0">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h6 class="card-title mb-1 fw-bold">${kampanya.baslik}</h6>
                                <small class="text-primary"><i class="bi bi-shop"></i> ${esnafAdi}</small>
                            </div>
                            <span class="badge bg-warning text-dark fs-6">${kampanya.indirim}</span>
                        </div>
                        <p class="card-text text-muted small">${kampanya.aciklama}</p>
                        
                        <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                            <small class="text-muted"><i class="bi bi-calendar-event"></i> ${kampanya.gecerlilik || 'Süresiz'}</small>
                            <button class="btn btn-sm btn-outline-primary">Detay</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Kampanya hatası:', err);
        kampanyalarContainer.innerHTML = '<div class="alert alert-danger">Kampanyalar yüklenirken hata oluştu.</div>';
    }
}