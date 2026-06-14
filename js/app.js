// ============================================
// GDR APP - FULL CLEAN VERSION
// ============================================

// === CONFIG ===
const STORAGE_CONFIG = {
  bucket: "gdr-media",
  maxBucketMB: 500,
  warningThreshold: 0.8,
  criticalThreshold: 0.95,
  blockThreshold: 0.98,
};

// ============================================
// SUPABASE CLIENT
// ============================================

function getClient() {
  return initSupabaseClient();
}

// ============================================
// IMAGE HELPERS
// ============================================

// ✅ CDN + optimize
function getOptimizedImageUrl(path) {
  const client = getClient();
  if (!client) return path;

  const { data } = client.storage
    .from(STORAGE_CONFIG.bucket)
    .getPublicUrl(path);

  return `${data.publicUrl}?width=800&quality=70&format=webp`;
}

// ✅ Lazy load helper (pakai di HTML)
function createLazyImage(url, className = "") {
  return `<img src="${url}" loading="lazy" class="${className}" />`;
}

// ============================================
// HASH (DEDUP)
// ============================================

async function generateFileHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isDuplicate(file) {
  const client = getClient();
  if (!client) return false;

  const hash = await generateFileHash(file);

  const { data } = await client
    .from("image_hashes")
    .select("hash")
    .eq("hash", hash)
    .maybeSingle();

  return data ? true : false;
}

async function saveHash(hash) {
  const client = getClient();
  if (!client) return;

  await client.from("image_hashes").insert({ hash });
}

// ============================================
// STORAGE MONITOR (AKURAT)
// ============================================

async function getAllFiles() {
  const client = getClient();
  if (!client) return [];

  let all = [];
  let offset = 0;

  while (true) {
    const { data, error } = await client.storage
      .from(STORAGE_CONFIG.bucket)
      .list("posts", { limit: 100, offset });

    if (error) break;
    if (!data || data.length === 0) break;

    all = all.concat(data);
    offset += 100;
  }

  return all;
}

async function checkStorageUsage() {
  const files = await getAllFiles();
  if (!files) return null;

  const totalBytes = files.reduce(
    (sum, f) => sum + (f.metadata?.size || 0),
    0
  );

  const usedMB = totalBytes / (1024 * 1024);
  const percent = usedMB / STORAGE_CONFIG.maxBucketMB;

  console.log(
    `[Storage] ${usedMB.toFixed(1)}MB / ${STORAGE_CONFIG.maxBucketMB}MB`
  );

  if (percent >= STORAGE_CONFIG.criticalThreshold) {
    showGlobalAlert("⚠️ Storage hampir penuh!", "warning");
    await autoCleanupOldPosts(6);
  }

  return {
    used: usedMB,
    total: STORAGE_CONFIG.maxBucketMB,
    percent,
  };
}

// ============================================
// BLOCK UPLOAD
// ============================================

async function canUpload() {
  const status = await checkStorageUsage();
  if (!status) return true;

  return status.percent < STORAGE_CONFIG.blockThreshold;
}

// ============================================
// EXTRACT PATH
// ============================================

function extractPath(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const idx = parts.indexOf("posts");
    return parts.slice(idx + 1).join("/");
  } catch {
    return null;
  }
}

// ============================================
// CLEANUP
// ============================================

async function autoCleanupOldPosts(months = 6) {
  const client = getClient();
  if (!client) return;

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);

  try {
    const { data: posts } = await client
      .from("news_posts")
      .select("id,image_url,images,created_at")
      .lt("created_at", cutoff.toISOString())
      .limit(50);

    if (!posts?.length) return;

    for (const post of posts) {
      let paths = [];

      if (post.image_url) {
        const p = extractPath(post.image_url);
        if (p) paths.push(`posts/${p}`);
      }

      if (Array.isArray(post.images)) {
        post.images.forEach((img) => {
          const p = extractPath(img);
          if (p) paths.push(`posts/${p}`);
        });
      }

      if (paths.length) {
        await client.storage
          .from(STORAGE_CONFIG.bucket)
          .remove(paths);
      }
    }

    const ids = posts.map((p) => p.id);

    await client.from("news_posts").delete().in("id", ids);

    console.log(`[Cleanup] ${posts.length} post dihapus`);

  } catch (err) {
    console.error("[Cleanup]", err);
  }
}

// ============================================
// MANUAL CLEANUP
// ============================================

async function manualCleanup(months = 6) {
  if (!confirm(`Hapus postingan > ${months} bulan?`)) return;

  await autoCleanupOldPosts(months);

  showToast("✅ Cleanup selesai");

  if (typeof loadRemoteData === "function") {
    await loadRemoteData();
  }

  if (typeof renderNews === "function") {
    renderNews();
  }
}

// ============================================
// UPLOAD WRAPPER (SAFE)
// ============================================

async function handleUpload(file) {
  // ✅ block
  if (!(await canUpload())) {
    showToast("Storage penuh. Upload ditolak.");
    return null;
  }

  // ✅ dedup
  if (await isDuplicate(file)) {
    showToast("Gambar sudah pernah diupload.");
    return null;
  }

  const hash = await generateFileHash(file);

  // lanjut upload kamu sendiri di sini...

  // ✅ simpan hash
  await saveHash(hash);

  return true;
}

// ============================================
// INIT (MERGE SAFE)
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (typeof loadLocalState === "function") {
      loadLocalState();
    }

    if (typeof applySettings === "function") {
      applySettings();
    }

    if (typeof loadRemoteData === "function") {
      await loadRemoteData();
    }

    if (typeof applySettings === "function") {
      applySettings();
    }

    console.log("GDR app initialized");

    // Auto-buka detail post jika dibuka dari link share (?post=<id>)
    const sharedPostId = new URLSearchParams(window.location.search).get("post");
    if (sharedPostId && typeof window.openDetailDialog === "function") {
      window.openDetailDialog(sharedPostId);
    }

    // Laporan keuangan
    if (typeof window.loadFinanceReports === "function") {
      window.loadFinanceReports();
    }

    // ✅ storage check awal
    setTimeout(() => {
      checkStorageUsage();
    }, 3000);

    // ✅ monitoring continue
    setInterval(() => {
      checkStorageUsage();
    }, 60000);

  } catch (err) {
    console.error("Init error:", err);
  }
});