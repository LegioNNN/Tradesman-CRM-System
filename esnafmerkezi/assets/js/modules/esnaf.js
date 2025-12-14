// assets/js/modules/esnaf.js
import { supabase } from './supabase.js';

export async function loadOneCikanEsnaf() {
    const esnafContainer = document.getElementById('oneCikanEsnaf');
    
    // Yükleniyor ikonu
    esnafContainer.innerHTML = '<div class="text-center w-100 p-4"><div class="spinner-border text-warning" role="status"></div></div>';

    try {
        // 1. En yüksek puanlı 3 esnafı çek
        const { data: esnaflar, error } = await supabase
            .from('esnaflar')
            .select('*')
            .eq('onay_durumu', true)
            .order('puan', { ascending: false }) // Puana göre azalan (Büyükten küçüğe)
            .limit(3); // Sadece 3 tane getir

        if (error) throw error;

        if (!esnaflar || esnaflar.length === 0) {
            esnafContainer.innerHTML = '<div class="col-12 text-center"><p>Henüz öne çıkan esnaf yok.</p></div>';
            return;
        }

        // Favorileri LocalStorage'dan çek
        const favoriler = JSON.parse(localStorage.getItem('esnafFavoriler')) || [];

        // 2. HTML'i Oluştur
        esnafContainer.innerHTML = esnaflar.map(esnaf => {
            const isFav = favoriler.includes(esnaf.id);
            const kalpIcon = isFav ? 'bi-heart-fill text-danger' : 'bi-heart text-white';
            
            // Eğer kampanya bilgisi yoksa varsayılan bir yazı göster
            const kampanyaText = esnaf.aciklama ? esnaf.aciklama.substring(0, 30) + '...' : 'Fırsatları kaçırmayın!';

            return `
            <div class="col-md-6 col-lg-4">
                <div class="card esnaf-card h-100 position-relative">
                    <button onclick="toggleFavori(${esnaf.id}, this)" class="btn position-absolute top-0 end-0 m-2 shadow-none" style="z-index: 10;">
                        <i class="bi ${kalpIcon} fs-4" style="text-shadow: 0 0 3px rgba(0,0,0,0.5);"></i>
                    </button>
                    
                    <span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
                        <i class="bi bi-star-fill"></i> Popüler
                    </span>

                    <img src="${esnaf.resim_url}" class="card-img-top" alt="${esnaf.ad}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 class="card-title">${esnaf.ad}</h5>
                                <small class="text-muted">${esnaf.kategori}</small>
                            </div>
                            <div class="text-end">
                                <div class="esnaf-rating text-warning"><i class="bi bi-star-fill"></i> ${esnaf.puan}</div>
                            </div>
                        </div>
                        <p class="card-text small">${esnaf.aciklama}</p>
                        
                        <div class="d-grid">
                            <a href="#esnaflar" class="btn btn-outline-primary btn-sm">Tümünü Gör</a>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Öne çıkanlar hatası:', err);
        esnafContainer.innerHTML = '<div class="alert alert-danger">Veriler yüklenirken hata oluştu.</div>';
    }
}