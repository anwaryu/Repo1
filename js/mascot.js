/* Rad Roots — Rad the Radish, drawn in SVG with a few moods */
'use strict';

/**
 * mascot(mood) → SVG string
 * moods: happy (default) · cheer · think · oops · wink
 */
function mascot(mood = 'happy', extraClass = '') {
  const ink = '#1F2B3A';
  const leaf = '#3FBF73', leafDeep = '#237A49';
  const body = '#FF5D8F', bodyDeep = '#D93E6E', bodyLight = '#FF8AB0';

  const eyesOpen = (lookX = 0, lookY = 0) => `
    <ellipse cx="47" cy="82" rx="9.5" ry="10.5" fill="#fff"/>
    <ellipse cx="73" cy="82" rx="9.5" ry="10.5" fill="#fff"/>
    <circle cx="${49 + lookX}" cy="${84 + lookY}" r="4.6" fill="${ink}"/>
    <circle cx="${75 + lookX}" cy="${84 + lookY}" r="4.6" fill="${ink}"/>
    <circle cx="${51 + lookX}" cy="${81.5 + lookY}" r="1.7" fill="#fff"/>
    <circle cx="${77 + lookX}" cy="${81.5 + lookY}" r="1.7" fill="#fff"/>`;

  const eyesClosedHappy = `
    <path d="M38 83q9-10 18 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M64 83q9-10 18 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;

  const eyesWink = `
    <ellipse cx="47" cy="82" rx="9.5" ry="10.5" fill="#fff"/>
    <circle cx="49" cy="84" r="4.6" fill="${ink}"/>
    <circle cx="51" cy="81.5" r="1.7" fill="#fff"/>
    <path d="M64 83q9-8 18 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;

  const eyesWide = `
    <ellipse cx="47" cy="82" rx="10.5" ry="12" fill="#fff"/>
    <ellipse cx="73" cy="82" rx="10.5" ry="12" fill="#fff"/>
    <circle cx="47" cy="84" r="4" fill="${ink}"/>
    <circle cx="73" cy="84" r="4" fill="${ink}"/>
    <circle cx="48.5" cy="82" r="1.4" fill="#fff"/>
    <circle cx="74.5" cy="82" r="1.4" fill="#fff"/>`;

  const mouths = {
    happy: `<path d="M48 101q12 12 24 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
    cheer: `<path d="M46 99q14 20 28 0z" fill="${ink}"/><path d="M52 106q8 6 16 0z" fill="#FF8AB0"/>`,
    think: `<path d="M50 105q10-5 20 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
    oops: `<ellipse cx="60" cy="104" rx="5" ry="6" fill="${ink}"/>`,
    wink: `<path d="M48 100q12 13 26-2" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
  };

  const brows = {
    think: `<path d="M38 68l14 4M68 70l14-6" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`,
    oops: `<path d="M38 66l14-2M68 64l14 2" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`,
  };

  const eyes = { happy: eyesOpen(), cheer: eyesClosedHappy, think: eyesOpen(2, -1), oops: eyesWide, wink: eyesWink }[mood] || eyesOpen();
  const sparkles = mood === 'cheer' ? `
    <g fill="#FFC53D">
      <path d="M14 30l2.2 5.8 5.8 2.2-5.8 2.2L14 46l-2.2-5.8L6 38l5.8-2.2z"/>
      <path d="M104 22l1.8 4.6 4.6 1.8-4.6 1.8-1.8 4.6-1.8-4.6-4.6-1.8 4.6-1.8z"/>
      <path d="M100 60l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z"/>
    </g>` : '';

  return `<svg class="rad rad--${mood} ${extraClass}" viewBox="0 0 120 160" role="img" aria-label="Rad the Radish, ${mood}" focusable="false">
    <!-- leaves -->
    <path d="M58 48C40 42 24 26 30 6c14 2 28 20 28 42z" fill="${leaf}"/>
    <path d="M62 48c18-6 34-22 28-42-14 2-28 20-28 42z" fill="${leaf}"/>
    <path d="M60 50C46 34 50 12 60 2c10 10 14 32 0 48z" fill="#4FD08A"/>
    <path d="M60 46V10M58 44C50 36 46 28 42 18M62 44c8-8 12-16 16-26" fill="none" stroke="${leafDeep}" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>
    <!-- body -->
    <path d="M60 40c24 0 40 18 38 44-2 24-18 42-36 58-1.2 1.2-2.8 1.2-4 0C40 126 24 108 22 84 20 58 36 40 60 40z" fill="${body}" stroke="${bodyDeep}" stroke-width="2.5" stroke-linejoin="round"/>
    <ellipse cx="42" cy="64" rx="7" ry="13" fill="#fff" opacity=".22" transform="rotate(-18 42 64)"/>
    <path d="M60 40c-10 0-18 3-24 8 6-2 14-3 24-3s18 1 24 3c-6-5-14-8-24-8z" fill="${bodyLight}" opacity=".6"/>
    <!-- tail root -->
    <path d="M58 143c2 6-2 9 2 15" fill="none" stroke="${bodyDeep}" stroke-width="2.4" stroke-linecap="round"/>
    <!-- cheeks -->
    <circle cx="37" cy="96" r="5.5" fill="#FF3D7A" opacity=".45"/>
    <circle cx="83" cy="96" r="5.5" fill="#FF3D7A" opacity=".45"/>
    ${brows[mood] || ''}
    ${eyes}
    ${mouths[mood] || mouths.happy}
    ${sparkles}
  </svg>`;
}
