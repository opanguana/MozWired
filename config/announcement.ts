import type { Announcement } from '@/components/ui/AnnouncementBanner';

/**
 * Site-wide announcement configuration.
 *
 * Keep `enabled` false when no campaign should be displayed. Dates are optional
 * ISO 8601 values and are evaluated in the timezone included in each value.
 */
export const siteAnnouncement: Announcement = {
  id: 'workplace-specialist',
  enabled: true,
  message: 'Build a safer, faster workplace with one technology partner.',
  linkLabel: 'Talk to a specialist',
  linkHref: '#support',
  tone: 'promotion',
  startsAt: null,
  endsAt: null,
};
