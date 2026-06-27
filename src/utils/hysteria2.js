const HYSTERIA2_LINK_RE = /^(hysteria2|hy2):\/\//i;

function splitSourceEntries(source) {
  return String(source || "")
    .split(/\r?\n|\|/)
    .map(item => item.trim())
    .filter(Boolean);
}

function isHysteria2Link(value) {
  return HYSTERIA2_LINK_RE.test(value);
}

function looksLikeIpHost(host) {
  const cleanHost = String(host || "").replace(/^\[/, "").replace(/\]$/, "");
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(cleanHost) || cleanHost.includes(":");
}

function decodeHashName(hash, fallback) {
  if (!hash) {
    return fallback;
  }

  try {
    return decodeURIComponent(hash.replace(/^#/, "")) || fallback;
  } catch (error) {
    return hash.replace(/^#/, "") || fallback;
  }
}

function getDesiredHysteria2Name(name) {
  if (!name) {
    return "";
  }
  if (/(^|[-_\s])hy2$/i.test(name) || /hysteria2/i.test(name)) {
    return name;
  }
  return `${name}-hy2`;
}

function normalizeHysteria2Entry(entry) {
  if (!isHysteria2Link(entry)) {
    return entry;
  }

  try {
    const parsedUrl = new URL(entry);
    const fallbackName = [parsedUrl.hostname, parsedUrl.port].filter(Boolean).join(":");
    const name = decodeHashName(parsedUrl.hash, fallbackName);
    const sni = parsedUrl.searchParams.get("sni") ||
      parsedUrl.searchParams.get("peer") ||
      parsedUrl.searchParams.get("servername");

    if (!parsedUrl.searchParams.get("alpn")) {
      parsedUrl.searchParams.set("alpn", "h3");
    }
    if (looksLikeIpHost(parsedUrl.hostname) && !sni) {
      parsedUrl.searchParams.set("insecure", "1");
    }
    parsedUrl.hash = encodeURIComponent(getDesiredHysteria2Name(name));
    return parsedUrl.toString();
  } catch (error) {
    return entry;
  }
}

function normalizeHysteria2SourceForDefaultExport(source) {
  return splitSourceEntries(source)
    .map(normalizeHysteria2Entry)
    .join("|");
}

function hasHysteria2Source(source) {
  return splitSourceEntries(source).some(isHysteria2Link);
}

module.exports = {
  hasHysteria2Source,
  normalizeHysteria2SourceForDefaultExport
};
