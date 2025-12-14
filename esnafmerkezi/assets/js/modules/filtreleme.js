let guncelKategori = 'tumu';
let guncelAramaTerimi = '';

function uygulaFiltreler() {
    const esnafKartlari = document.querySelectorAll('.esnaf-filtre-kart');
    esnafKartlari.forEach(kart => {
        const kartKategori = kart.dataset.kategori;
        const kartAd = kart.dataset.ad; 
        const kategoriGecerli = (guncelKategori === 'tumu' || kartKategori === guncelKategori);
        const aramaGecerli = kartAd.includes(guncelAramaTerimi);
        
        if (kategoriGecerli && aramaGecerli) {
            kart.style.display = 'block'; 
        } else {
            kart.style.display = 'none'; 
        }
    });
}

function initKategoriFiltreleme() {
    const kategoriContainer = document.getElementById('kategoriler');
    kategoriContainer.addEventListener('click', (e) => {
        const tiklananKart = e.target.closest('.kategori-card');
        if (!tiklananKart) return; 

        kategoriContainer.querySelectorAll('.kategori-card').forEach(kart => {
            kart.classList.remove('active-kategori');
        });
        tiklananKart.classList.add('active-kategori');
        
        guncelKategori = tiklananKart.dataset.kategori;
        uygulaFiltreler();
        
        document.getElementById('esnaflar').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function initAramaFiltreleme() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', (e) => {
        guncelAramaTerimi = e.target.value.toLowerCase().trim();
        uygulaFiltreler();
        document.getElementById('esnaflar').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function initFooterFiltreleme() {
    const footerLinkler = document.querySelectorAll('.footer-kategori');
    
    footerLinkler.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Sayfanın zıplamasını engelle
            
            // 1. Kategori ismini al (Örn: Restoran)
            const secilenKategori = link.dataset.kategori;
            
            // 2. Global değişkeni güncelle
            guncelKategori = secilenKategori;
            
            // 3. Filtreyi uygula
            uygulaFiltreler();
            
            // 4. Yukarıdaki Büyük Kartların Görünümünü de Güncelle (Senkronize olsun)
            const ustKartlar = document.querySelectorAll('.kategori-card');
            ustKartlar.forEach(kart => {
                kart.classList.remove('active-kategori');
                if(kart.dataset.kategori === secilenKategori) {
                    kart.classList.add('active-kategori');
                }
            });

            // 5. Esnaflar bölümüne kaydır
            const hedef = document.getElementById('esnaflar');
            if(hedef) hedef.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

export function initFiltreleme() {
    initKategoriFiltreleme();
    initAramaFiltreleme();
    initFooterFiltreleme(); // <-- Bunu eklemeyi unutma!
}