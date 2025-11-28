// assets/js/modules/slider.js
import { supabase } from './supabase.js';

export async function initSlider() {
    const sliderContainer = document.getElementById('sliderIcerik');

    // 1. KONTROL: Eğer HTML'de bu ID yoksa işlemi durdur (Hata vermesin)
    if (!sliderContainer) {
        console.error("HATA: index.html içinde 'sliderIcerik' id'li element bulunamadı!");
        return;
    }

    // 2. HEMEN VARSAYILANI YÜKLE (Spinner'ı yok et)
    const defaultHTML = `
        <div class="carousel-item active">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1600" class="d-block w-100" style="height: 500px; object-fit: cover; filter: brightness(0.6);">
            <div class="carousel-caption d-md-block text-start">
                <span class="badge bg-warning text-dark mb-2">Esnaf Merkezi</span>
                <h2 class="display-3 fw-bold">Yerel Esnafını Keşfet</h2>
                <p class="lead fs-4">Mahallenizin en güvenilir dükkanları ve güncel fırsatları burada.</p>
                <a href="#esnaflar" class="btn btn-primary btn-lg mt-3">Esnafları İncele</a>
            </div>
        </div>
    `;
    
    // Spinner yerine bunu basıyoruz
    sliderContainer.innerHTML = defaultHTML;

    // 3. ŞİMDİ VERİTABANINA GİTMEYİ DENE (Arka planda)
    try {
        const { data: kampanyalar, error } = await supabase
            .from('kampanyalar')
            .select('*, esnaflar(ad, resim_url)')
            .limit(5);

        if (error) throw error;

        // Eğer veritabanından kampanya geldiyse, varsayılanı sil ve yenileri ekle
        if (kampanyalar && kampanyalar.length > 0) {
            const yeniHTML = kampanyalar.map((kamp, index) => {
                const activeClass = index === 0 ? 'active' : '';
                const bgImage = kamp.esnaflar?.resim_url || "https://source.unsplash.com/1600x600/?shop";
                const esnafAdi = kamp.esnaflar?.ad || 'Fırsat';
                
                return `
                <div class="carousel-item ${activeClass}">
                    <img src="${bgImage}" class="d-block w-100" alt="${kamp.baslik}" style="height: 500px; object-fit: cover; filter: brightness(0.5);">
                    <div class="carousel-caption d-md-block text-start">
                        <span class="badge bg-warning text-dark mb-2">${esnafAdi}</span>
                        <h1 class="display-3 fw-bold">${kamp.baslik}</h1>
                        <p class="lead fs-4">${kamp.aciklama}</p>
                        <p class="fw-bold text-warning fs-5"><i class="bi bi-tag-fill"></i> İndirim: ${kamp.indirim}</p>
                        <a href="#esnaflar" class="btn btn-primary btn-lg mt-3">Fırsatı Yakala</a>
                    </div>
                </div>
                `;
            }).join('');
            
            // İçeriği güncelle
            sliderContainer.innerHTML = yeniHTML;
        }

    } catch (err) {
        // Hata olsa bile kullanıcıya hissettirme (zaten varsayılan resim ekranda)
        console.log('Veritabanı slider hatası (Önemli değil, varsayılan gösteriliyor):', err);
    }
}