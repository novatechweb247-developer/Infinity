export type SocialPlatformKey = 'facebook' | 'instagram' | 'tiktok' | 'twitter';

export interface SocialPlatformConfig {
  key: SocialPlatformKey;
  name: string;
  shortName: string;
  baseUrl: string;
  placeholder: string;
  ariaLabel: string;
  defaultHandle: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    key: 'facebook',
    name: 'Facebook',
    shortName: 'FB',
    baseUrl: 'https://facebook.com/',
    placeholder: 'https://www.facebook.com/share/1F9F3yRg5R/',
    ariaLabel: 'Follow Infinity Furnitures on Facebook',
    defaultHandle: 'https://www.facebook.com/share/1F9F3yRg5R/',
  },
  {
    key: 'instagram',
    name: 'Instagram',
    shortName: 'IG',
    baseUrl: 'https://instagram.com/',
    placeholder: 'https://www.instagram.com/infinity.furnitur?stkn=MW9tNW85Ynp3MXN0aQ==',
    ariaLabel: 'Follow Infinity Furnitures on Instagram',
    defaultHandle: 'https://www.instagram.com/infinity.furnitur?stkn=MW9tNW85Ynp3MXN0aQ==',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    shortName: 'TT',
    baseUrl: 'https://tiktok.com/@',
    placeholder: 'https://vm.tiktok.com/ZS9D8Aah89WGw-Njpxl/',
    ariaLabel: 'Follow Infinity Furnitures on TikTok',
    defaultHandle: 'https://vm.tiktok.com/ZS9D8Aah89WGw-Njpxl/',
  },
];

/**
 * Normalizes user input (raw handle '@name', name, or full URL) into a secure, valid HTTPS link.
 */
export function formatSocialUrl(platform: SocialPlatformKey, rawInput?: string): string {
  if (!rawInput || typeof rawInput !== 'string') return '';
  const trimmed = rawInput.trim();
  if (!trimmed) return '';

  // If already starts with http/https
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Remove leading @ or slashes
  const clean = trimmed.replace(/^@+/, '').replace(/^\/+/, '').trim();
  if (!clean) return '';

  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${clean}`;
    case 'tiktok':
      return `https://tiktok.com/@${clean}`;
    case 'facebook':
      return `https://facebook.com/${clean}`;
    case 'twitter':
      return `https://x.com/${clean}`;
    default:
      return `https://${clean}`;
  }
}

/**
 * Formats a clean display handle (e.g. @infinityfurnitures) from a full URL or handle.
 */
export function extractDisplayHandle(platform: SocialPlatformKey, urlOrHandle?: string): string {
  if (!urlOrHandle || typeof urlOrHandle !== 'string') return '';
  const trimmed = urlOrHandle.trim();
  if (!trimmed) return '';

  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const pathname = url.pathname.replace(/^\/+|\/+$/g, '');
      if (pathname) {
        return pathname.startsWith('@') ? pathname : `@${pathname}`;
      }
      return `@${url.hostname.replace(/^www\./, '')}`;
    }
  } catch (e) {
    // Fall back to string parsing
  }

  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}
