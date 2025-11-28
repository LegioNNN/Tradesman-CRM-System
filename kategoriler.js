// assets/js/modules/kategoriler.js
import { supabase } from './supabase.js';

export async function loadKategoriler() {
    const kategorilerContainer = document.getElementById('kategoriler');
    
    // Kategori İkonları Tanımları (Veritabanında ikon tutmadığımız için buraya yazıyoruz)
    const kategoriIkonlari = {
        'Restoran': 'bi-shop',
        'Berber': 'bi-scissors',
        'Giyim': 'bi-person-badge',
        'Market': 'bi-basket',
        'Kafe': 'bi-cup-hot',
        'Diğer': 'bi-gem'
    };

    try {
        // 1. Veritabanından sadece kategori bilgisini çek
        const { data: esnaflar, error } = await supabase
            .from('esnaflar')
            .select('kategori')
            .eq('onay_durumu', true);

        if (error) throw error;

        // 2. Kategorileri Say (Örn: {Restoran: 5, Berber: 2})
        const kategoriSayilari = esnaflar.reduce((acc, curr) => {
            acc[curr.kategori] = (acc[curr.kategori] || 0) + 1;
            return acc;
        }, {});

        // 3. HTML Oluştur
        // Önce "Tümü" kartını ekle
        let htmlContent = `
            <div class="col-md-4 col-lg-2">
                <div class="card kategori-card text-center p-3 active-kategori" data-kategori="tumu"> 
                    <div class="kategori-icon"><i class="bi bi-grid"></i></div>
                    <h6>Tümü</h6>
                    <small class="text-muted">Tüm esnaflar</small>
                </div>
            </div>
        `;

        // Sonra diğer kategorileri döngüyle ekle
        for (const [kategoriAd, sayi] of Object.entries(kategoriSayilari)) {
            const ikon = kategoriIkonlari[kategoriAd] || 'bi-tag'; // Tanımlı değilse varsayılan ikon

            htmlContent += `
            <div class="col-md-4 col-lg-2">
                <div class="card kategori-card text-center p-3" data-kategori="${kategoriAd}">
                    <div class="kategori-icon"><i class="bi ${ikon}"></i></div>
                    <h6>${kategoriAd}</h6>
                    <small class="text-muted">${sayi} esnaf</small>
                </div>
            </div>
            `;
        }
        
        kategorilerContainer.innerHTML = htmlContent;

    } catch (err) {
        console.error('Kategori hatası:', err);
        kategorilerContainer.innerHTML = '<div class="alert alert-danger">Kategoriler yüklenemedi.</div>';
    }
}