const ACCOUNT_HASH = import.meta.env.VITE_CF_IMAGES_ACCOUNT_HASH;

export function getCloudflareProfileUrl(
  mediaId: string | null | undefined,
): string | null {
  if (!mediaId || !ACCOUNT_HASH) return null;

  return `https://imagedelivery.net/${ACCOUNT_HASH}/${encodeURIComponent(mediaId)}/profile`;
}
