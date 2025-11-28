// assets/js/modules/auth.js

// Supabase Ayarları (Kendi proje bilgilerini buraya yapıştır)
const SUPABASE_URL = 'https://nauikwtxhfpvxjyaziao.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdWlrd3R4aGZwdnhqeWF6aWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTc2MDgsImV4cCI6MjA3OTg5MzYwOH0.vDSkoEVCUHtXVLrYuvHWkqcaNbY-UwbkwdBUAe0K0kQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export function initLoginForm() {
    
    // --- 1. KAYIT OLMA İŞLEMİ ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            // Supabase'e kayıt isteği gönder
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                alert('Hata: ' + error.message);
            } else {
                alert('Kayıt başarılı! Lütfen e-posta adresinize gelen onay linkine tıklayın.');
                registerForm.reset();
            }
        });
    }

    // --- 2. GİRİŞ YAPMA İŞLEMİ ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert('Giriş başarısız: ' + error.message);
            } else {
                // Başarılı olursa modalı kapat
                const modalEl = document.getElementById('loginModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
                loginForm.reset();
                
                // Kullanıcıya hoş geldin de
                // (Auth state listener aşağıda bunu yakalayıp UI'ı güncelleyecek)
            }
        });
    }

    // --- 3. KULLANICI DURUMUNU TAKİP ET (Navbar Güncelleme) ---
    // Sayfa yüklendiğinde veya giriş/çıkış yapıldığında çalışır
    supabase.auth.onAuthStateChange((event, session) => {
        updateNavbar(session);
    });
}

// Navbar'daki "Giriş Yap" butonunu yöneten fonksiyon
function updateNavbar(session) {
    const loginBtnContainer = document.querySelector('.navbar-nav .nav-item:last-child');
    
    if (session) {
        // Kullanıcı giriş yapmışsa: "Hesabım" ve "Çıkış Yap" göster
        const userEmail = session.user.email;
        loginBtnContainer.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-warning dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle"></i> Hesabım
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><span class="dropdown-item-text text-muted small">${userEmail}</span></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="esnaf-ol.html">Esnaf Paneli</a></li>
                    <li><button class="dropdown-item text-danger" id="logoutBtn">Çıkış Yap</button></li>
                </ul>
            </div>
        `;

        // Çıkış butonuna tıklama olayını ekle
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.reload(); // Sayfayı yenile
        });

    } else {
        // Kullanıcı çıkış yapmışsa: Eski "Giriş Yap" butonunu geri getir
        loginBtnContainer.innerHTML = `
            <button class="btn btn-outline-light ms-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                <i class="bi bi-box-arrow-in-right"></i> Giriş Yap
            </button>
        `;
    }
}