// assets/js/modules/esnafBasvuru.js

// 1. Supabase Bağlantısı (Kendi proje bilgilerini buraya girmelisin)
const SUPABASE_URL = 'https://nauikwtxhfpvxjyaziao.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdWlrd3R4aGZwdnhqeWF6aWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTc2MDgsImV4cCI6MjA3OTg5MzYwOH0.vDSkoEVCUHtXVLrYuvHWkqcaNbY-UwbkwdBUAe0K0kQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('esnafBasvuruForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = 'İşleniyor...';

    // Form verilerini al
    const ad = document.getElementById('dukkanAd').value;
    const kategori = document.getElementById('kategori').value;
    const aciklama = document.getElementById('aciklama').value;
    const telefon = document.getElementById('telefon').value;
    const adres = document.getElementById('adres').value;
    const resimDosyasi = document.getElementById('resimDosyasi').files[0];

    try {
        // --- ADIM A: RESMİ YÜKLE ---
        if (!resimDosyasi) throw new Error('Lütfen bir resim seçin.');

        // Dosya ismini benzersiz yap (çakışmayı önlemek için)
        const dosyaAdi = `esnaf_${Date.now()}_${resimDosyasi.name}`;
        
        // 'esnaf-resimleri' adında bir bucket oluşturduğunu varsayıyoruz
        const { data: resimData, error: resimError } = await supabase
            .storage
            .from('esnaf-resimleri') 
            .upload(dosyaAdi, resimDosyasi);

        if (resimError) throw resimError;

        // Yüklenen resmin herkese açık URL'ini al
        const { data: urlData } = supabase
            .storage
            .from('esnaf-resimleri')
            .getPublicUrl(dosyaAdi);
            
        const publicResimUrl = urlData.publicUrl;

        // --- ADIM B: VERİTABANINA KAYDET ---
        const { data: dbData, error: dbError } = await supabase
            .from('esnaflar') // SQL tablomuzun adı
            .insert([
                { 
                    ad: ad,
                    kategori: kategori,
                    aciklama: aciklama,
                    telefon: telefon,
                    adres: adres,
                    resim_url: publicResimUrl, // Resmin linkini kaydediyoruz
                    onay_durumu: false // Varsayılan olarak onaysız
                }
            ]);

        if (dbError) throw dbError;

        alert('Başvurunuz başarıyla alındı! Yönetici onayından sonra yayınlanacaktır.');
        window.location.href = 'index.html'; // Ana sayfaya yönlendir

    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu: ' + error.message);
        btn.disabled = false;
        btn.innerText = 'Başvuruyu Tamamla';
    }
});