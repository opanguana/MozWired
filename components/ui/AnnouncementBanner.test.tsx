import { render, screen } from '@testing-library/react';

import { siteAnnouncement } from '@/config/announcement';

import { AnnouncementBanner, type Announcement, isAnnouncementActive } from './AnnouncementBanner';

const activeAnnouncement: Announcement = {
  id: 'test-campaign',
  enabled: true,
  message: 'Support the campaign.',
  linkLabel: 'Donate now',
  linkHref: '/donate',
  tone: 'donation',
};

describe('AnnouncementBanner', () => {
  it('uses electronics-store messaging for the active site announcement', () => {
    render(<AnnouncementBanner announcement={siteAnnouncement} />);

    expect(
      screen.getByText('Find the right electronics for work, home, and everyday life.')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shop all electronics' })).toHaveAttribute(
      'href',
      '#services'
    );
  });

  it('renders an enabled announcement', () => {
    render(<AnnouncementBanner announcement={activeAnnouncement} />);

    expect(screen.getByRole('complementary', { name: 'Site announcement' })).toHaveClass(
      'ribbon',
      'ribbon-donation'
    );
    expect(screen.getByRole('link', { name: 'Donate now' })).toHaveAttribute('href', '/donate');
  });

  it('uses the dark ribbon theme for promotions', () => {
    render(<AnnouncementBanner announcement={{ ...activeAnnouncement, tone: 'promotion' }} />);

    expect(screen.getByRole('complementary', { name: 'Site announcement' })).toHaveClass(
      'ribbon',
      'theme-dark'
    );
  });

  it('renders nothing when disabled', () => {
    const { container } = render(
      <AnnouncementBanner announcement={{ ...activeAnnouncement, enabled: false }} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('honors the configured campaign window', () => {
    const scheduled: Announcement = {
      ...activeAnnouncement,
      startsAt: '2026-08-01T00:00:00+02:00',
      endsAt: '2026-08-31T23:59:59+02:00',
    };

    expect(isAnnouncementActive(scheduled, new Date('2026-07-31T20:00:00Z'))).toBe(false);
    expect(isAnnouncementActive(scheduled, new Date('2026-08-15T10:00:00Z'))).toBe(true);
    expect(isAnnouncementActive(scheduled, new Date('2026-09-01T00:00:00Z'))).toBe(false);
  });

  it('fails closed when a configured date is invalid', () => {
    expect(
      isAnnouncementActive(
        { ...activeAnnouncement, startsAt: 'not-a-date' },
        new Date('2026-08-15T10:00:00Z')
      )
    ).toBe(false);
  });
});
