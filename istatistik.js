// assets/js/modules/istatistik.js
import { supabase } from './supabase.js';

export async function loadIstatistikler() {
    // Önce bu HTML'i "Popüler Kategoriler"in hemen üstüne ekleyeceğiz
    const istatistikHTML = `
        <section class="py-5 bg-primary text-white">
            <div class="container">
                <div class="row text-center">
                    <div class="col-4">
                        <h2 class="display-4 fw-bold" id="statEsnaf">0</h2>
                        <p class="lead">Kayıtlı Esnaf</p>
                    </div>
                    <div class="col-4 border-start border-end border-white">
                        <h2 class="display-4 fw-bold" id="statYorum">0</h2>
                        <p class="lead">Gerçek Yorum</p>
                    </div>
                    <div class="col-4">
                        <h2 class="display-4 fw-bold" id="statKampanya">0</h2>
                        <p class="lead">Aktif Kampanya</p>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // HTML'i sayfaya (main etiketinin içine, en başa değil ortaya bir yere) yerleştir
    // "Popüler Kategoriler" bölümünden hemen ÖNCE ekliyoruz
    const kategorilerSection = document.getElementById('kategoriler').closest('section');
    kategorilerSection.insertAdjacentHTML('beforebegin', istatistikHTML);

    // Verileri Çek
    try {
        const { count: esnafSayisi } = await supabase.from('esnaflar').select('*', { count: 'exact', head: true }).eq('onay_durumu', true);
        const { count: yorumSayisi } = await supabase.from('yorumlar').select('*', { count: 'exact', head: true });
        const { count: kampanyaSayisi } = await supabase.from('kampanyalar').select('*', { count: 'exact', head: true });

        // Animasyonlu Sayı Artırma (0'dan yukarı doğru sayar)
        animateValue("statEsnaf", 0, esnafSayisi || 15, 2000);
        animateValue("statYorum", 0, yorumSayisi || 120, 2000);
        animateValue("statKampanya", 0, kampanyaSayisi || 5, 2000);

    } catch (err) {
        console.error(err);
    }
}

// Sayı artırma animasyonu
function animateValue(id, start, end, duration) {
    if (start === end) return;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    const obj = document.getElementById(id);
    const timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current + "+";
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}