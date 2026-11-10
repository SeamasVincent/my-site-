// Temporary content for the production browser checks. Never publish these entries.
import fs from 'node:fs';
const fixtures = {
  "content/insights/qa-article.json": {
    "status": "published",
    "summary": "Verification introduction appears once.",
    "platformUrl": "https://example.com/watch",
    "image": "/uploads/ee-cover-art-y1-02.png",
    "publishedAt": "2026-11-10T00:00:00.000+01:00",
    "slug": "qa-article",
    "type": "article",
    "body": "First paragraph.\n\nSecond paragraph.",
    "title": "QA article",
    "previousSlugs": [
      "qa-article-old"
    ]
  },
  "content/insights/qa-no-article.json": {
    "status": "published",
    "summary": "Verification introduction appears once.",
    "platformUrl": "https://example.com/watch",
    "image": "/uploads/ee-cover-art-y1-02.png",
    "publishedAt": "2026-11-10T00:00:00.000+01:00",
    "slug": "qa-no-article",
    "type": "podcast",
    "body": "",
    "title": "QA podcast",
    "previousSlugs": [
      "qa-no-article-old"
    ]
  },
  "content/insights/qa-video.json": {
    "status": "published",
    "summary": "Verification introduction appears once.",
    "platformUrl": "https://example.com/watch",
    "image": "/uploads/ee-cover-art-y1-02.png",
    "publishedAt": "2026-11-10T00:00:00.000+01:00",
    "slug": "qa-video",
    "type": "video",
    "body": "## A formatted heading\n\nA paragraph with **emphasis** and [a link](https://example.com).\n\n- First point\n- Second point",
    "title": "QA video",
    "previousSlugs": [
      "qa-video-old"
    ]
  },
  "content/projects/qa-archived.json": {
    "title": "QA Business programme qa-archived",
    "slug": "qa-archived",
    "basics": {
      "organisation": "Example organisation",
      "description": "A temporary case study to verify the full layout.",
      "role": "Programme strategy and facilitation",
      "categories": [
        "Strategy",
        "Education"
      ],
      "year": "2026",
      "location": "Abuja, Nigeria",
      "startDate": "2026-01-01"
    },
    "visuals": {
      "cover": "/uploads/ee-cover-art-y1-02.png",
      "coverAlt": "Temporary project cover",
      "gallery": [
        {
          "image": "/uploads/eepodcast-yt-1-.png",
          "alt": "Workshop example",
          "caption": "Temporary gallery caption"
        }
      ]
    },
    "story": {
      "overview": "An overview with **formatted text**.",
      "challenge": "## The starting point\n\nA challenge to address.",
      "contribution": "I designed the programme and facilitated the workshops.",
      "approach": "- Research\n- Facilitation\n\n[Reference](https://example.com)",
      "results": "The team delivered the programme. This is temporary test content.",
      "lessons": "A lesson from the work."
    },
    "metrics": [
      {
        "value": "24",
        "label": "Participants",
        "context": "Temporary QA figure, not a real project claim."
      }
    ],
    "testimonial": {
      "quote": "A temporary quotation for layout verification.",
      "name": "Example person",
      "attribution": "Programme lead"
    },
    "externalLinks": [
      {
        "label": "Example reference",
        "url": "https://example.com"
      }
    ],
    "publication": {
      "status": "archived",
      "featured": true,
      "order": 2
    },
    "previousSlugs": [
      "qa-archived-old"
    ]
  },
  "content/projects/qa-draft.json": {
    "title": "QA Business programme qa-draft",
    "slug": "qa-draft",
    "basics": {
      "organisation": "Example organisation",
      "description": "A temporary case study to verify the full layout.",
      "role": "Programme strategy and facilitation",
      "categories": [
        "Strategy",
        "Education"
      ],
      "year": "2026",
      "location": "Abuja, Nigeria",
      "startDate": "2026-01-01"
    },
    "visuals": {
      "cover": "/uploads/ee-cover-art-y1-02.png",
      "coverAlt": "Temporary project cover",
      "gallery": [
        {
          "image": "/uploads/eepodcast-yt-1-.png",
          "alt": "Workshop example",
          "caption": "Temporary gallery caption"
        }
      ]
    },
    "story": {
      "overview": "An overview with **formatted text**.",
      "challenge": "## The starting point\n\nA challenge to address.",
      "contribution": "I designed the programme and facilitated the workshops.",
      "approach": "- Research\n- Facilitation\n\n[Reference](https://example.com)",
      "results": "The team delivered the programme. This is temporary test content.",
      "lessons": "A lesson from the work."
    },
    "metrics": [
      {
        "value": "24",
        "label": "Participants",
        "context": "Temporary QA figure, not a real project claim."
      }
    ],
    "testimonial": {
      "quote": "A temporary quotation for layout verification.",
      "name": "Example person",
      "attribution": "Programme lead"
    },
    "externalLinks": [
      {
        "label": "Example reference",
        "url": "https://example.com"
      }
    ],
    "publication": {
      "status": "draft",
      "featured": true,
      "order": 2
    },
    "previousSlugs": [
      "qa-draft-old"
    ]
  },
  "content/projects/qa-hidden.json": {
    "title": "QA Business programme qa-hidden",
    "slug": "qa-hidden",
    "basics": {
      "organisation": "Example organisation",
      "description": "A temporary case study to verify the full layout.",
      "role": "Programme strategy and facilitation",
      "categories": [
        "Strategy",
        "Education"
      ],
      "year": "2026",
      "location": "Abuja, Nigeria",
      "startDate": "2026-01-01"
    },
    "visuals": {
      "cover": "/uploads/ee-cover-art-y1-02.png",
      "coverAlt": "Temporary project cover",
      "gallery": [
        {
          "image": "/uploads/eepodcast-yt-1-.png",
          "alt": "Workshop example",
          "caption": "Temporary gallery caption"
        }
      ]
    },
    "story": {
      "overview": "An overview with **formatted text**.",
      "challenge": "## The starting point\n\nA challenge to address.",
      "contribution": "I designed the programme and facilitated the workshops.",
      "approach": "- Research\n- Facilitation\n\n[Reference](https://example.com)",
      "results": "The team delivered the programme. This is temporary test content.",
      "lessons": "A lesson from the work."
    },
    "metrics": [
      {
        "value": "24",
        "label": "Participants",
        "context": "Temporary QA figure, not a real project claim."
      }
    ],
    "testimonial": {
      "quote": "A temporary quotation for layout verification.",
      "name": "Example person",
      "attribution": "Programme lead"
    },
    "externalLinks": [
      {
        "label": "Example reference",
        "url": "https://example.com"
      }
    ],
    "publication": {
      "status": "hidden",
      "featured": true,
      "order": 2
    },
    "previousSlugs": [
      "qa-hidden-old"
    ]
  },
  "content/projects/qa-project-two.json": {
    "title": "QA Business programme qa-project-two",
    "slug": "qa-project-two",
    "basics": {
      "organisation": "Example organisation",
      "description": "A temporary case study to verify the full layout.",
      "role": "Programme strategy and facilitation",
      "categories": [
        "Operations"
      ],
      "year": "2026",
      "location": "Abuja, Nigeria",
      "startDate": "2026-01-01"
    },
    "visuals": {
      "cover": "/uploads/ee-cover-art-y1-02.png",
      "coverAlt": "Temporary project cover"
    },
    "story": {
      "overview": "An overview with **formatted text**.",
      "challenge": "## The starting point\n\nA challenge to address.",
      "contribution": "I designed the programme and facilitated the workshops.",
      "approach": "- Research\n- Facilitation\n\n[Reference](https://example.com)",
      "results": "The team delivered the programme. This is temporary test content."
    },
    "externalLinks": [
      {
        "label": "Example reference",
        "url": "https://example.com"
      }
    ],
    "publication": {
      "status": "published",
      "featured": false,
      "order": 2
    },
    "previousSlugs": [
      "qa-project-two-old"
    ]
  },
  "content/projects/qa-project.json": {
    "title": "QA Business programme",
    "slug": "qa-project",
    "basics": {
      "organisation": "Example organisation",
      "description": "A temporary case study to verify the full layout.",
      "role": "Programme strategy and facilitation",
      "categories": [
        "Strategy",
        "Education"
      ],
      "year": "2026",
      "location": "Abuja, Nigeria",
      "startDate": "2026-01-01"
    },
    "visuals": {
      "cover": "/uploads/ee-cover-art-y1-02.png",
      "coverAlt": "Temporary project cover",
      "gallery": [
        {
          "image": "/uploads/eepodcast-yt-1-.png",
          "alt": "Workshop example",
          "caption": "Temporary gallery caption"
        }
      ]
    },
    "story": {
      "overview": "An overview with **formatted text**.",
      "challenge": "## The starting point\n\nA challenge to address.",
      "contribution": "I designed the programme and facilitated the workshops.",
      "approach": "- Research\n- Facilitation\n\n[Reference](https://example.com)",
      "results": "The team delivered the programme. This is temporary test content.",
      "lessons": "A lesson from the work."
    },
    "metrics": [
      {
        "value": "24",
        "label": "Participants",
        "context": "Temporary QA figure, not a real project claim."
      }
    ],
    "testimonial": {
      "quote": "A temporary quotation for layout verification.",
      "name": "Example person",
      "attribution": "Programme lead"
    },
    "externalLinks": [
      {
        "label": "Example reference",
        "url": "https://example.com"
      }
    ],
    "publication": {
      "status": "published",
      "featured": true,
      "order": 2
    },
    "previousSlugs": [
      "qa-project-old"
    ]
  }
};
const cleanup = process.argv.includes('--remove');
for (const [file, data] of Object.entries(fixtures)) {
 if (cleanup) { if (fs.existsSync(file)) fs.unlinkSync(file); }
 else { if (fs.existsSync(file)) throw new Error('Refusing to overwrite '+file); fs.writeFileSync(file, JSON.stringify(data, null, 2)+'\n'); }
}
console.log(cleanup ? 'Temporary fixtures removed' : 'Temporary fixtures created');
