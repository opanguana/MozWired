import Link from 'next/link';

export type Announcement = {
  id: string;
  enabled: boolean;
  message: string;
  linkLabel?: string;
  linkHref?: string;
  tone?: 'info' | 'promotion' | 'donation';
  startsAt?: string | null;
  endsAt?: string | null;
};

export function isAnnouncementActive(announcement: Announcement, now = new Date()): boolean {
  if (!announcement.enabled) return false;

  const currentTime = now.getTime();
  const startsAt = announcement.startsAt ? Date.parse(announcement.startsAt) : null;
  const endsAt = announcement.endsAt ? Date.parse(announcement.endsAt) : null;

  if (startsAt !== null && (Number.isNaN(startsAt) || currentTime < startsAt)) return false;
  if (endsAt !== null && (Number.isNaN(endsAt) || currentTime > endsAt)) return false;

  return true;
}

export function AnnouncementBanner({
  announcement,
  now,
}: {
  announcement: Announcement;
  now?: Date;
}) {
  if (!isAnnouncementActive(announcement, now)) return null;

  const tone = announcement.tone ?? 'info';
  const hasLink = Boolean(announcement.linkLabel && announcement.linkHref);

  return (
    <aside
      aria-label="Site announcement"
      data-announcement-id={announcement.id}
      data-tone={tone}
      className={`ribbon ${tone === 'donation' ? 'ribbon-donation' : 'theme-dark'}`}
    >
      <div className="ribbon-content-wrapper">
        <div className="ribbon-content">
          {announcement.message}
          {hasLink && (
            <>
              {' '}
              <Link href={announcement.linkHref!} className="ribbon-link">
                {announcement.linkLabel}
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
