// assets/js/app.js

import { loadKategoriler } from './modules/kategoriler.js';
import { loadOneCikanEsnaf } from './modules/esnaf.js';
import { loadKampanyalar } from './modules/kampanyalar.js';
import { initLoginForm } from './modules/auth.js';
import { loadTumEsnaf } from './modules/tumEsnaflar.js';
import { initFiltreleme } from './modules/filtreleme.js';
import { initFavoriler } from './modules/favoriler.js'; 
import { initYorumSistemi } from './modules/yorumlar.js';
import { initSlider } from './modules/slider.js';      // YENİ
import { loadIstatistikler } from './modules/istatistik.js'; // YENİ

export function initApp() {
    loadKategoriler();
    loadOneCikanEsnaf();
    loadTumEsnaf();
    loadKampanyalar();
    initLoginForm();
    initFiltreleme();
    initFavoriler(); // YENİ BAŞLATICI
    initSlider();       // YENİ: Slider'ı başlat
    loadIstatistikler(); // YENİ: İstatistikleri yükle
    
    // Smooth scroll (Mevcut kod aynen kalıyor)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}