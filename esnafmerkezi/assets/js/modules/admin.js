// assets/js/modules/admin.js

// 1. Ortak dosyadan Supabase'i çek
import { supabase } from './supabase.js';

// 2. GÜVENLİK KONTROLÜ (Sayfa yüklenir yüklenmez çalışır)
(async function guvenlikKontrolu() {
    // Giriş yapmış kullanıcı var mı?
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // Giriş yapmamışsa anasayfaya at
        alert('Bu sayfaya erişim yetkiniz yok!');
        window.location.href = 'index.html';
        return;
    }

    // Kullanıcının e-postası senin e-postan mı?
    // BURAYA KENDİ E-POSTA ADRESİNİ YAZMALISIN! 👇
    const ADMIN_EMAIL = 'despmedya@gmail.com'; 

    if (session.user.email !== ADMIN_EMAIL) {
        // Giriş yapmış ama yönetici değilse (başka bir üyeyse)
        alert('Bu panel sadece site yöneticisi içindir.');
        window.location.href = 'index.html';
        return;
    }

    // Buraya geldiyse sorun yok, yönetici sensin.
    // Başvuruları yüklemeye başla...
    loadBasvurular();
})();

// ... (Buradan aşağısı senin eski loadBasvurular, onayla, reddet fonksiyonların olacak) ...
// DİKKAT: Eski kodundaki "document.addEventListener('DOMContentLoaded', loadBasvurular);" satırını silmelisin.
// Çünkü artık yukarıdaki güvenlik fonksiyonu çağırdığı için otomatik çalışacak.
// Sayfa yüklenince başvuruları çek
document.addEventListener('DOMContentLoaded', loadBasvurular);

async function loadBasvurular() {
    const liste = document.getElementById('basvuruListesi');
    liste.innerHTML = '<tr><td colspan="6" class="text-center">Yükleniyor...</td></tr>';

    // Sadece onaysız (false) olanları getir
    const { data: esnaflar, error } = await supabase
        .from('esnaflar')
        .select('*')
        .eq('onay_durumu', false) 
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    if (esnaflar.length === 0) {
        liste.innerHTML = '<tr><td colspan="6" class="text-center p-4">Bekleyen başvuru yok. Her şey güncel! 🎉</td></tr>';
        return;
    }

    liste.innerHTML = esnaflar.map(esnaf => `
        <tr>
            <td>
                <img src="${esnaf.resim_url}" alt="Resim" class="rounded" style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td>
                <h6 class="mb-0">${esnaf.ad}</h6>
                <small class="text-muted">${esnaf.adres.substring(0, 20)}...</small>
            </td>
            <td><span class="badge bg-info text-dark">${esnaf.kategori}</span></td>
            <td>${esnaf.telefon}</td>
            <td><span class="badge bg-warning">Bekliyor</span></td>
            <td>
                <button onclick="onayla(${esnaf.id})" class="btn btn-success btn-sm">
                    <i class="bi bi-check-lg"></i> Onayla
                </button>
                <button onclick="reddet(${esnaf.id})" class="btn btn-danger btn-sm ms-1">
                    <i class="bi bi-trash"></i> Sil
                </button>
            </td>
        </tr>
    `).join('');
}

// Global fonksiyonlar (HTML'den çağrılabilmesi için window'a atıyoruz)
window.onayla = async function(id) {
    if(!confirm('Bu esnafı yayınlamak istediğinize emin misiniz?')) return;

    // Durumu TRUE yap
    const { error } = await supabase
        .from('esnaflar')
        .update({ onay_durumu: true })
        .eq('id', id);

    if (error) {
        alert('Hata: ' + error.message);
    } else {
        alert('Esnaf onaylandı ve yayına alındı!');
        loadBasvurular(); // Listeyi yenile
    }
};

window.reddet = async function(id) {
    if(!confirm('Bu başvuruyu tamamen silmek istediğinize emin misiniz?')) return;

    // Kaydı sil
    const { error } = await supabase
        .from('esnaflar')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Hata: ' + error.message);
    } else {
        loadBasvurular(); // Listeyi yenile
    }
};