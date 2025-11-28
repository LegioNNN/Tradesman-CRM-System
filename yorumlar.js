// assets/js/modules/yorumlar.js

// 1. Ortak Supabase dosyasını çağır (Artık createClient yapmıyoruz)
import { supabase } from './supabase.js';

export function initYorumSistemi() {
    
    // Yorum Yapma Modalı Açma
    window.openYorumModal = async function(esnafId) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            alert('Yorum yapmak için lütfen önce giriş yapınız.');
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
            return;
        }

        const esnafInput = document.getElementById('yorumEsnafId');
        if(esnafInput) esnafInput.value = esnafId;
        
        const modal = new bootstrap.Modal(document.getElementById('yorumModal'));
        modal.show();
    };

    // Form Gönderme İşlemi
    const yorumForm = document.getElementById('yorumForm');
    if (yorumForm) {
        // Olay dinleyicisini temizleyip yeniden ekleyelim (Çift tıklamayı önler)
        const newForm = yorumForm.cloneNode(true);
        yorumForm.parentNode.replaceChild(newForm, yorumForm);

        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const esnafId = document.getElementById('yorumEsnafId').value;
            const puan = parseInt(document.getElementById('yorumPuan').value);
            const yorumMetni = document.getElementById('yorumMetni').value;
            
            const { data: { session } } = await supabase.auth.getSession();
            
            if(!session) return;
            const userEmail = session.user.email;

            try {
                const { error } = await supabase
                    .from('yorumlar')
                    .insert([{ esnaf_id: esnafId, user_email: userEmail, puan: puan, yorum_metni: yorumMetni }]);

                if (error) throw error;
                await puanOrtalamasiniGuncelle(esnafId);

                alert('Yorumunuz kaydedildi!');
                const modalEl = document.getElementById('yorumModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
                newForm.reset();
                window.location.reload(); // Puan güncellensin diye yenile
            } catch (err) {
                alert('Hata: ' + err.message);
            }
        });
    }
}

// Yorumları Listeleme Fonksiyonu (Global)
window.openYorumListesi = async function(esnafId) {
    const modalEl = document.getElementById('yorumListesiModal');
    if (!modalEl) { console.error("Modal HTML yok!"); return; }

    const modal = new bootstrap.Modal(modalEl);
    const container = document.getElementById('yorumlarIcerik');
    container.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary"></div></div>';
    modal.show();

    try {
        const { data: yorumlar, error } = await supabase
            .from('yorumlar')
            .select('*')
            .eq('esnaf_id', esnafId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!yorumlar || yorumlar.length === 0) {
            container.innerHTML = '<div class="alert alert-light text-center">Henüz yorum yok.</div>';
            return;
        }

        container.innerHTML = yorumlar.map(yorum => {
            const tarih = new Date(yorum.created_at).toLocaleDateString('tr-TR');
            const gizliEmail = yorum.user_email ? yorum.user_email.split('@')[0].substring(0, 3) + '***' : 'Anonim';
            return `
                <div class="list-group-item py-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0 fw-bold text-primary">${gizliEmail}</h6>
                        <small class="text-muted">${tarih}</small>
                    </div>
                    <div class="mb-2 text-warning small">${'⭐'.repeat(yorum.puan)}</div>
                    <p class="mb-0 text-dark">${yorum.yorum_metni}</p>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="text-danger p-3">Hata oluştu.</div>';
    }
};

async function puanOrtalamasiniGuncelle(esnafId) {
    const { data: yorumlar } = await supabase.from('yorumlar').select('puan').eq('esnaf_id', esnafId);
    if (yorumlar && yorumlar.length > 0) {
        const toplam = yorumlar.reduce((acc, curr) => acc + curr.puan, 0);
        const ortalama = (toplam / yorumlar.length).toFixed(1);
        await supabase.from('esnaflar').update({ puan: ortalama }).eq('id', esnafId);
    }
}