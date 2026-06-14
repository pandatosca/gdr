<?php
// Sitemap dinamis: homepage + semua berita approved (lewat post.php) agar
// Google bisa menemukan & mengindeks tiap post. Output XML standar sitemap.
header('Content-Type: application/xml; charset=UTF-8');

$SUPABASE_URL = 'https://gyofijyebgtxzbtwlwbw.supabase.co';
$SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5b2ZpanllYmd0eHpidHdsd2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2ODAzNDQsImV4cCI6MjA5NTI1NjM0NH0.4h8ZBSTHlJgag2V2Z-lSd_IgrcbcU5UmCfprzJpMQOo';
$SITE = 'https://gdr.my.id';

$posts = [];
$ch = curl_init($SUPABASE_URL . '/rest/v1/news_posts?status=eq.approved&select=id,created_at&order=created_at.desc&limit=500');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 8,
  CURLOPT_HTTPHEADER => [
    'apikey: ' . $SUPABASE_ANON_KEY,
    'Authorization: Bearer ' . $SUPABASE_ANON_KEY,
    'Accept: application/json',
  ],
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($resp !== false && $code === 200) {
  $arr = json_decode($resp, true);
  if (is_array($arr)) $posts = $arr;
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
echo "  <url><loc>$SITE/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n";
foreach ($posts as $p) {
  if (empty($p['id'])) continue;
  $id = htmlspecialchars($p['id'], ENT_QUOTES, 'UTF-8');
  $lastmod = !empty($p['created_at']) ? substr($p['created_at'], 0, 10) : '';
  $lm = $lastmod !== '' ? "<lastmod>$lastmod</lastmod>" : '';
  echo "  <url><loc>$SITE/post.php?id=$id</loc>$lm<changefreq>monthly</changefreq><priority>0.7</priority></url>\n";
}
echo '</urlset>' . "\n";
