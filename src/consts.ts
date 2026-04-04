import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'ad.BLOG',
  description: "AnpyD's Website",
  href: 'https://anpydx.github.io',
  author: 'anpyd',
  locale: 'zh-CN',
  featuredPostCount: 2,
  postsPerPage: 4,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: '博客',
  },
  {
    href: '/about',
    label: '关于',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/anpydx',
    label: 'GitHub',
  },
  {
    href: 'mailto:anpyd@outlook.com',
    label: 'Email',
  }
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
