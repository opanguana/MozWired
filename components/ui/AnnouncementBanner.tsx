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

const toneClasses: Record<NonNullable<Announcement['tone']>, string> = {
  info: 'bg-[#171719] text-white/75',
  promotion: 'bg-[#171719] text-white/75',
  donation: 'bg-store-cyan text-black/75',
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
      className={`border-t border-white/10 px-5 py-3 text-center text-[11px] ${toneClasses[tone]}`}
    >
      {announcement.message}
      {hasLink && (
        <>
          {' '}
          <Link
            href={announcement.linkHref!}
            className={
              tone === 'donation'
                ? 'font-semibold text-black hover:underline focus-ring'
                : 'text-store-cyan hover:underline focus-ring'
            }
          >
            {announcement.linkLabel}
          </Link>
        </>
      )}
    </aside>
  );
}
