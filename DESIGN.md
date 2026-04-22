# 犟爸书房 — Design System

## Philosophy

父母基本功读书会的视觉设计理念：温暖、有质感、不急躁。
设计应让人感觉像走进一间精心打理的书房，而不是一个功能堆叠的 App。

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#E85D04` | CTA buttons, active states, progress bars |
| Gold | `#C9A961` | Accents, borders, secondary buttons, streak badges |
| Background | `#FAF7F2` | Page background — warm cream |
| Surface | `#FFFFFF` | Cards, modals, elevated surfaces |
| Text Primary | `#2D2D2D` | Headings, body text |
| Text Secondary | `#666666` | Captions, metadata |
| Border | `rgba(201, 169, 97, 0.3)` | Card borders, dividers |

## Typography

- **Font Family:** Noto Serif SC, PingFang SC, Microsoft YaHei, serif
- **H1:** 24px, weight 700, line-height 1.3
- **H2:** 18px, weight 600, line-height 1.4
- **H3:** 16px, weight 600, line-height 1.4
- **Body:** 14px, weight 400, line-height 1.6
- **Caption:** 12px, weight 400, line-height 1.5

## Spacing

- **Page padding:** 20px horizontal
- **Section gap:** 24px
- **Card padding:** 16px
- **Card radius:** 1rem (16px)
- **Button radius:** 0.75rem (12px)
- **Small radius:** 0.5rem (8px)

## Components

### Card
- White background
- 1px border with gold at 30% opacity
- 16px border-radius
- Subtle shadow: `0 1px 3px rgba(0,0,0,0.04)`

### Button Primary
- Background: #E85D04
- Text: white
- Padding: 10px 16px
- Border-radius: 12px
- Shadow: subtle

### Button Secondary (Gold)
- Background: #C9A961
- Text: white
- Same sizing as primary

### Progress Bar
- Track: #F0F0F0
- Fill: #E85D04
- Height: 6px
- Border-radius: full

### Navigation (Bottom Tab)
- 4 tabs: 书架 / 疗愈 / 打卡 / 我的
- Active: #E85D04 with icon
- Inactive: #999999

## Layout Patterns

### Mobile-First
All designs are mobile-first (375px base). The app is designed for parents reading on their phones.

### Home Page Structure
1. Header: Brand + tagline
2. Quick Actions: 继续阅读 + 今日打卡 + streak badge
3. Current Book Card: Cover + progress + chapter info
4. Past Books Grid: 2-column grid
5. Bottom Nav

## Animation

- **Page transitions:** Subtle fade, 200ms
- **Button press:** Scale 0.97, 100ms
- **Progress bar:** Width transition 300ms ease-out
- **Card hover (desktop):** Shadow deepen, 150ms

## Assets

- Book covers: SVG illustrations (3 variants)
- Logo: Custom SVG
- Icons: Lucide React (consistent 16px/20px sizing)

## Accessibility

- Minimum touch target: 44px
- Color contrast ratio: 4.5:1 minimum
- Semantic HTML headings
- Alt text for all images
