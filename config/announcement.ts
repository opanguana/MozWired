import type { Announcement } from '@/components/ui/AnnouncementBanner';

/**
 * Site-wide announcement configuration.
 *
 * Keep `enabled` false when no campaign should be displayed. Dates are optional
 * ISO 8601 values and are evaluated in the timezone included in each value.
 */
export const siteAnnouncement: Announcement = {
  id: 'electronics-store',
  enabled: true,
  message: 'Find the right electronics for work, home, and everyday life.',
  linkLabel: 'Shop all electronics',
  linkHref: '/products',
  tone: 'promotion',
  startsAt: null,
  endsAt: null,
};
