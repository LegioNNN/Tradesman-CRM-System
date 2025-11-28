// assets/js/modules/favoriler.js

export function initFavoriler() {
    
    // 1. Toast Konteynerini Oluştur (HTML'e elle eklemeye gerek kalmasın)
    // Bu yapı, bildirimlerin sayfanın sağ altında birikmesini sağlar.
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1055'; // Modal ve diğer elementlerin üzerinde görünsün
        document.body.appendChild(container);
    }

    // 2. Toast (Bildirim) Gösterme Yardımcı Fonksiyonu
    const showToast = (message, type) => {
        const container = document.querySelector('.toast-container');
        
        // Başarı için yeşil (success), silme için kırmızı (danger) renk
        const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
        const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-trash-fill';

        const toastHTML = `
            <div class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${icon} me-2"></i> ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Kapat"></button>
                </div>
            </div>
        `;

        // HTML'i konteynerin içine ekle
        container.insertAdjacentHTML('beforeend', toastHTML);

        // Son eklenen toast'ı bul ve Bootstrap ile başlat
        const toastEl = container.lastElementChild;
        // eslint-disable-next-line no-undef
        const toast = new bootstrap.Toast(toastEl, { delay: 2500 }); // 2.5 saniye ekranda kalır
        toast.show();

        // Kaybolduktan sonra DOM'dan tamamen sil (Performans için önemli)
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    };

    // 3. Global Favori Toggle Fonksiyonu
    window.toggleFavori = function(id, btnElement) {
        let favoriler = JSON.parse(localStorage.getItem('esnafFavoriler')) || [];
        const icon = btnElement.querySelector('i');
        
        const index = favoriler.indexOf(id);
        
        if (index > -1) {
            // Favoriden çıkar
            favoriler.splice(index, 1);
            icon.classList.remove('bi-heart-fill', 'text-danger');
            icon.classList.add('bi-heart', 'text-white');
            
            // Kırmızı bildirim göster
            showToast('Favorilerden çıkarıldı.', 'danger');
        } else {
            // Favoriye ekle
            favoriler.push(id);
            icon.classList.remove('bi-heart', 'text-white');
            icon.classList.add('bi-heart-fill', 'text-danger');
            
            // Yeşil bildirim göster
            showToast('Favorilere eklendi!', 'success');
        }
        
        localStorage.setItem('esnafFavoriler', JSON.stringify(favoriler));
    };
}