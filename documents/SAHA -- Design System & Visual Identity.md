SAHA -- Design System & Visual Identity
======================================

> This document defines the visual identity of SAHA.
>
> It is the single source of truth for:
>
> -   colors
> -   fonts
> -   icons
> -   component usage
> -   overall UI philosophy

This is not for marketing.

This is for **engineering and product consistency**.

* * * * *

1\. Brand Direction
-------------------

SAHA is a **career productivity system**.

The UI must feel:

-   modern
-   serious
-   calm
-   focused
-   not playful
-   not academic boring
-   not "AI startup"

Keywords:

> modern - career - productivity - trust - clarity

* * * * *

2\. Icon System (Locked)
------------------------

**Only one icon system is allowed in SAHA:**

### Phosphor Icons

Implementation:

```
npm install react-icons

```

Usage:

```
import {
PiBriefcase,
PiFileText,
PiBrain,
PiUser,
PiChartLine
}from"react-icons/pi"

```

Rules:

-   Never mix icon libraries
-   No Lucide
-   No Heroicons
-   No custom SVG packs
-   No emoji icons

Phosphor icons give:

-   modern SaaS feel
-   professional tone
-   consistency across UI

* * * * *

3\. Color System -- "Career Modern"
----------------------------------

This theme avoids:

-   AI blue
-   crypto neon
-   all-white UIs
-   corporate dullness

It sits in the same family as:

Linear / Vercel / Raycast.

* * * * *

### 3.1 Light Theme (Primary)

| Token | Purpose | Hex |
| --- | --- | --- |
| background | App background | `#F7F7F8` |
| surface | Cards, panels | `#FFFFFF` |
| primary | Main buttons, headings | `#1C1C1E` |
| secondary | Secondary text | `#4B5563` |
| accent | Highlight / CTA | `#E76F51` |
| accent-2 | Success / progress | `#2A9D8F` |
| text | Main text | `#111827` |
| text-muted | Helper text | `#6B7280` |
| border | Dividers | `#E5E7EB` |
| success | Success states | `#2A9D8F` |
| warning | Warning states | `#F4A261` |
| error | Error states | `#E63946` |

This feels:

-   modern
-   neutral
-   serious
-   not AI-branded

* * * * *

### 3.2 Dark Theme (Optional)

Not hacker dark. Not gamer dark.

This is **modern SaaS dark**.

| Token | Hex |
| --- | --- |
| background | `#0E0E11` |
| surface | `#16161A` |
| primary | `#F9FAFB` |
| secondary | `#9CA3AF` |
| accent | `#E76F51` |
| accent-2 | `#2A9D8F` |
| text | `#E5E7EB` |
| border | `#27272A` |

* * * * *

4\. shadcn/ui Token Mapping
---------------------------

These values plug directly into shadcn.

```
:root {
--background:247247248;
--foreground:172439;

--primary:282830;
--primary-foreground:255255255;

--secondary:758599;
--secondary-foreground:255255255;

--accent:23111181;
--accent-foreground:255255255;

--muted:229231235;
--border:229231235;
}

```

Result:

-   all shadcn buttons look correct
-   alerts look correct
-   modals look correct
-   dark mode works automatically

No custom component theming needed.

* * * * *

5\. Typography System (SAHA Fonts)
----------------------------------

This is the **official font stack**.

### Headings → PT Mono

### Body → Cause

You already defined it perfectly:

```
@import url('<https://fonts.googleapis.com/css?family=PT%20Mono:700|Cause:400>');

body {
font-family:'Cause';
font-weight:400;
}

h1,h2,h3,h4,h5 {
font-family:'PT Mono';
font-weight:700;
}

```

* * * * *

### 5.1 Type Scale (Locked)

```
html {font-size:100%; }/* 16px */

h1 {font-size:4.210rem; }/* 67px */
h2 {font-size:3.158rem; }/* 50px */
h3 {font-size:2.369rem; }/* 38px */
h4 {font-size:1.777rem; }/* 28px */
h5 {font-size:1.333rem; }/* 21px */
small {font-size:0.750rem; }/* 12px */

```

This scale feels:

-   editorial
-   confident
-   serious
-   not startup fluff

PT Mono gives:

-   analytical vibe
-   system tool feel
-   "career software" energy

Cause keeps body:

-   soft
-   readable
-   human

* * * * *

6\. Component Philosophy (Very Important)
-----------------------------------------

### Buttons

-   Always use shadcn Button
-   No custom gradients
-   No glow effects
-   Rounded but not pill

### Cards

-   White surface on gray background
-   Subtle border
-   No heavy shadows

### Inputs

-   Neutral
-   No neon focus rings
-   Clean labels

### Layout

-   Lots of breathing space
-   No cramped dashboards
-   Calm spacing > dense data

* * * * *

7\. Accent Usage Rules
----------------------

Accent color `#E76F51` is **not a theme color**.

It is a **signal color**.

Use accent only for:

-   active tab
-   progress bar
-   match score
-   primary CTA
-   status badge

Never use accent for:

-   full page backgrounds
-   big sections
-   long text blocks

It should feel:

> "important highlight", not decoration.

* * * * *

8\. Visual Identity Summary
---------------------------

SAHA should look like:

| Yes | No |
| --- | --- |
| Career tool | AI demo |
| Modern SaaS | Crypto dashboard |
| Calm | Flashy |
| Neutral | Gimmicky |
| Trustworthy | Trendy |

* * * * *

9\. One-line Design Rule
------------------------

When designing any screen, ask:

> Would this UI still look professional inside a real company's internal tool?

If yes → correct.

If it looks like a Dribbble shot → wrong.

* * * * *

10\. Brand Memory Anchor
------------------------

This is how people should remember SAHA visually:

> "Black + soft gray + warm coral + mono headings + clean icons."

That combination is:

-   rare
-   distinctive
-   not AI-coded
-   and very hard to accidentally ruin.
> This document defines the visual identity of SAHA.
>
> It is the single source of truth for:
>
> -   colors
> -   fonts
> -   icons
> -   component usage
> -   overall UI philosophy

This is not for marketing.
