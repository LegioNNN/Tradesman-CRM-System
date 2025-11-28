// assets/js/modules/supabase.js

// Kendi proje bilgilerini buraya yapıştır
const SUPABASE_URL = 'https://nauikwtxhfpvxjyaziao.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdWlrd3R4aGZwdnhqeWF6aWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTc2MDgsImV4cCI6MjA3OTg5MzYwOH0.vDSkoEVCUHtXVLrYuvHWkqcaNbY-UwbkwdBUAe0K0kQ';

// Tek bir bağlantı oluşturup dışarı aktarıyoruz
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);