// assets/js/main.js

import { initApp } from './app.js';
import { initYorumSistemi } from './modules/yorumlar.js';

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initYorumSistemi();


  window.addEventListener('load', () => {
    
    // Preloader'ı bul
    const preloader = document.getElementById('preloader');
    
    // Biraz beklet (yarım saniye) ki kullanıcı animasyonu görsün, hemen "küt" diye açılmasın
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hide-preloader');
            
            // Animasyon bitince HTML'den tamamen sil (Hafızayı yormasın)
            setTimeout(() => {
                preloader.remove();
            }, 600);
        }
    }, 900); // 900ms bekleme süresi
});
});