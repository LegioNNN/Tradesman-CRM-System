// assets/js/modules/tumEsnaflar.js

// 1. Supabase Ayarları
const SUPABASE_URL = 'https://nauikwtxhfpvxjyaziao.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdWlrd3R4aGZwdnhqeWF6aWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTc2MDgsImV4cCI6MjA3OTg5MzYwOH0.vDSkoEVCUHtXVLrYuvHWkqcaNbY-UwbkwdBUAe0K0kQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export async function loadTumEsnaf() {
    const esnafContainer = document.getElementById('tumEsnaflarListesi');
    
    // Yükleniyor mesajı gösterelim
    esnafContainer.innerHTML = '<div class="text-center w-100 mt-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Esnaflar yükleniyor...</p></div>';

    try {
        // 2. Veritabanından Verileri Çek
        // 'onay_durumu' true olanları getir (Henüz onay sütunu eklemediysen .eq kısmını silebilirsin)
       // Sadece onaylanmış (true) olanları getir
let { data: esnaflar, error } = await supabase
    .from('esnaflar')
    .select('*')
    .eq('onay_durumu', true)
    .order('created_at', { ascending: false });

        if (error) throw error;

        if (!esnaflar || esnaflar.length === 0) {
            esnafContainer.innerHTML = '<div class="col-12 text-center"><div class="alert alert-info">Henüz kayıtlı esnaf bulunmuyor. İlk olmak ister misiniz?</div></div>';
            return;
        }

        // Favorileri LocalStorage'dan çek
        const favoriler = JSON.parse(localStorage.getItem('esnafFavoriler')) || [];
        const suanSaat = new Date().getHours();

        // 3. Gelen Veriyi HTML'e Dönüştür
        esnafContainer.innerHTML = esnaflar.map(esnaf => {
            // Veritabanı sütun isimlerini JS değişkenlerine eşle
            // Eğer veritabanında bu alanlar boşsa varsayılan değerler ata
            const acilisSaati = esnaf.acilis || 9;  // Veritabanında yoksa varsayılan 09:00
            const kapanisSaati = esnaf.kapanis || 22; // Veritabanında yoksa varsayılan 22:00
            const puan = esnaf.puan || 5.0; // Yeni esnafın puanı varsayılan 5 başlasın
            
            // Favori Kontrolü
            const isFav = favoriler.includes(esnaf.id); // Not: Veritabanı ID'si number veya string olabilir, dikkat.
            const kalpIcon = isFav ? 'bi-heart-fill text-danger' : 'bi-heart text-white';
            
            // Açık/Kapalı Kontrolü
            const acikMi = suanSaat >= acilisSaati && suanSaat < kapanisSaati;
            const durumBadge = acikMi 
                ? `<span class="badge bg-success position-absolute top-0 start-0 m-3">AÇIK</span>` 
                : `<span class="badge bg-danger position-absolute top-0 start-0 m-3">KAPALI</span>`;

            // Veritabanındaki resim URL'si yoksa varsayılan bir resim kullan
            const goruntuResmi = esnaf.resim_url ? esnaf.resim_url : 'https://source.unsplash.com/400x300/?shop,store';

            return `
            <div class="col-md-6 col-lg-4 esnaf-filtre-kart" data-kategori="${esnaf.kategori}" data-ad="${esnaf.ad.toLowerCase()}">
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <div class="card esnaf-card h-100 position-relative">
                                ${durumBadge}
                                
                                <button onclick="toggleFavori(${esnaf.id}, this)" class="btn position-absolute top-0 end-0 m-2 shadow-none" style="z-index: 10;">
                                    <i class="bi ${kalpIcon} fs-4" style="text-shadow: 0 0 3px rgba(0,0,0,0.5);"></i>
                                </button>

                                <img src="${goruntuResmi}" class="card-img-top" alt="${esnaf.ad}" style="height: 200px; object-fit: cover;">
                                <div class="card-body d-flex flex-column">
                                    <div class="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 class="card-title">${esnaf.ad}</h5>
                                            <small class="text-muted">${esnaf.kategori}</small>
                                        </div>
                                        <div class="text-end">
                                            <div class="esnaf-rating">
                                                <i class="bi bi-star-fill"></i> ${puan}
                                            </div>
                                        </div>
                                    </div>
                                    <p class="card-text">${esnaf.aciklama || 'Açıklama bulunmuyor.'}</p>
                                    <div class="mt-auto">
                                        <small class="text-primary d-block text-center">Detaylar için kartın üzerine gelin</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flip-card-back">
                            <div class="card esnaf-card h-100">
                                <div class="card-body d-flex flex-column justify-content-center p-4">
                                    <h5 class="card-title text-center mb-3">${esnaf.ad}</h5>
                                    <div class="alert alert-light text-dark text-center mb-3 py-1">
                                        <small><i class="bi bi-clock"></i> Çalışma Saatleri: ${acilisSaati}:00 - ${kapanisSaati}:00</small>
                                    </div>
                                    <ul class="list-unstyled mb-3">
                                        <li class="mb-2"><i class="bi bi-telephone-fill me-2"></i> ${esnaf.telefon || '-'}</li>
                                        <li class="mb-2"><i class="bi bi-geo-alt-fill me-2"></i> ${esnaf.adres || '-'}</li>
                                    </ul>
                                   <div class="d-grid gap-2 mt-auto">
    <button onclick="openYorumModal(${esnaf.id})" class="btn btn-warning">
        <i class="bi bi-star-fill"></i> Yorum Yap
    </button>
    
    <button onclick="openYorumListesi(${esnaf.id})" class="btn btn-light">
        <i class="bi bi-chat-text-fill"></i> Yorumları Oku
    </button>

    <a href="tel:${esnaf.telefon}" class="btn btn-outline-light mt-2">Ara</a>
</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `}).join('');

    } catch (err) {
        console.error('Veri çekme hatası:', err);
        esnafContainer.innerHTML = '<div class="alert alert-danger">Veriler yüklenirken bir hata oluştu.</div>';
    }
}