<?php
// Halaman share per-post: render meta Open Graph di sisi server agar
// WhatsApp/Facebook menampilkan judul + gambar + ringkasan post yang benar
// (crawler tidak menjalankan JavaScript). Pengunjung manusia dialihkan ke homepage.

$SUPABASE_URL = 'https://gyofijyebgtxzbtwlwbw.supabase.co';
$SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5b2ZpanllYmd0eHpidHdsd2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2ODAzNDQsImV4cCI6MjA5NTI1NjM0NH0.4h8ZBSTHlJgag2V2Z-lSd_IgrcbcU5UmCfprzJpMQOo';
$SITE = 'https://gdr.my.id';

$id = isset($_GET['id']) ? trim($_GET['id']) : '';
if ($id === '' || !preg_match('/^[A-Za-z0-9\-]{1,64}$/', $id)) {
  header('Location: /');
  exit;
}

$endpoint = $SUPABASE_URL . '/rest/v1/news_posts?id=eq.' . urlencode($id)
  . '&status=eq.approved&select=title,content,author,image_url,category,created_at&limit=1';

$post = null;
$ch = curl_init($endpoint);
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
  if (is_array($arr) && count($arr) > 0) $post = $arr[0];
}

if (!$post) {
  header('Location: /');
  exit;
}

function gdr_clean($s) { return trim(preg_replace('/\s+/', ' ', (string)$s)); }
function gdr_excerpt($s, $n = 160) {
  $s = gdr_clean($s);
  if (mb_strlen($s) <= $n) return $s;
  return mb_substr($s, 0, $n - 1) . '…';
}

$title = gdr_clean($post['title'] ?? 'Berita Warga GDR');
$desc  = gdr_excerpt($post['content'] ?? '');
$img   = trim((string)($post['image_url'] ?? ''));
if ($img !== '' && stripos($img, 'http') !== 0) {
  $img = $SITE . '/' . ltrim($img, './');
}
$canonical = $SITE . '/post.php?id=' . urlencode($id);
$target = '/?post=' . urlencode($id);

$e = function ($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); };
?><!doctype html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= $e($title) ?> — GDR RT 09</title>
<meta name="description" content="<?= $e($desc) ?>">
<link rel="canonical" href="<?= $e($canonical) ?>">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Grand Depok Residence RT 09 RW 12">
<meta property="og:title" content="<?= $e($title) ?>">
<meta property="og:description" content="<?= $e($desc) ?>">
<meta property="og:url" content="<?= $e($canonical) ?>">
<?php if ($img !== ''): ?><meta property="og:image" content="<?= $e($img) ?>"><?php endif; ?>
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= $e($title) ?>">
<meta name="twitter:description" content="<?= $e($desc) ?>">
<?php if ($img !== ''): ?><meta name="twitter:image" content="<?= $e($img) ?>"><?php endif; ?>
<script>location.replace(<?= json_encode($target) ?>);</script>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:680px;margin:40px auto;padding:0 16px;color:#0f172a">
<?php if ($img !== ''): ?><img src="<?= $e($img) ?>" alt="" style="width:100%;border-radius:16px;margin-bottom:16px"><?php endif; ?>
<h1 style="line-height:1.25"><?= $e($title) ?></h1>
<p style="color:#475569;white-space:pre-line"><?= $e($desc) ?></p>
<p style="margin-top:24px"><a href="<?= $e($target) ?>" style="color:#15803d;font-weight:700">Buka di situs GDR →</a></p>
</body>
</html>
