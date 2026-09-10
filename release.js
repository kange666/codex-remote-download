// 版本、下载地址和完整校验值统一从同目录清单读取。
async function loadRelease() {
  try {
    const response = await fetch('release.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('版本清单读取失败');
    const release = await response.json();
    if (release.version !== '0.4.10') throw new Error('版本不一致');
    const safeUrl = (value) => {
      const url = new URL(value);
      if (url.origin !== 'https://github.com' || !url.pathname.startsWith('/kange666/codex-remote-download/releases/')) throw new Error('下载地址不正确');
      return url.href;
    };
    for (const type of ['installer', 'portable']) {
      const asset = release[type];
      if (!/^[A-Fa-f0-9]{64}$/.test(asset.sha256)) throw new Error('校验值不完整');
      document.getElementById(type + 'Download').href = safeUrl(asset.url);
      document.getElementById(type + 'Size').textContent = asset.sizeText + ' · Windows x64';
      document.getElementById(type + 'Hash').textContent = asset.sha256;
    }
    document.querySelectorAll('[data-version]').forEach(node => { node.textContent = release.version; });
    document.getElementById('sourceDownload').href = safeUrl(release.source.url);
    document.getElementById('checksumsDownload').href = safeUrl(release.checksumsUrl);
    document.getElementById('releaseLink').href = safeUrl(release.releaseUrl);
    document.getElementById('releaseStatus').textContent = '0.4.10 Windows 版 · 安装包与便携版包含本地识别资源';
  } catch {
    document.getElementById('releaseStatus').textContent = '版本信息读取失败，请打开 GitHub 版本说明查看下载与校验值。';
  }
}
loadRelease();