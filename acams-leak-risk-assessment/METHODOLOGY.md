# Content-Exposure Detection Methodology (Defensive Playbook)

*How a sanctioned agentic-AI assessment discovers and catalogs leaked ACAMS
content — using public sources only, for the purpose of takedown and
hardening.*

> This is a monitoring-and-response playbook for the rights holder. It is
> deliberately scoped to **public-source discovery and defensive response**. It
> does not include, and the program must not perform, paywall circumvention,
> access-control bypass, anti-bot evasion, or any unauthorized access to ACAMS
> or third-party systems.

---

## 0. Authorization gate (run this first)

Before any assessment runs:

- Confirm written ACAMS sanction and Legal sign-off for the scope and period.
- Confirm sources are limited to publicly accessible content.
- Confirm the catalog stores **metadata and pointers**, not copied content.
- Name an owner (Security/IP) and an escalation path (Legal).

If any box is unchecked, stop.

---

## 1. Discovery sources

Sweep the public surfaces where study/certification content typically surfaces:

- **General search engines**, using title, edition, ISBN, and distinctive
  phrase queries.
- **Study-sharing platforms** — document-sharing and flashcard sites where
  candidates upload guides, notes, and "exam dumps."
- **File hosts & lockers** where bulk materials are posted.
- **Marketplaces & resellers** offering cut-price "ACAMS prep."
- **Social & community** — forums, groups, messaging-channel indexes that are
  publicly listed.
- **AI answer engines** — test whether proprietary passages are reproduced
  verbatim on prompting (ingestion signal).

---

## 2. What to match on (fingerprints)

To distinguish genuine ACAMS material from generic AML content:

- Official titles, edition numbers, and ISBNs of ACAMS study materials.
- Distinctive, low-frequency phrasings unique to ACAMS courseware.
- Document structure markers (module/section naming conventions).
- Any existing watermarks or copyright/attribution strings.

Maintain a controlled fingerprint list internally; treat it as sensitive.

---

## 3. Classification

Tag each finding:

- **Content type:** study guide · flashcards/question bank · exam/question
  content · courseware/slides · recording · standard/white paper.
- **Leak vector** (Section 3 of the briefing): credential-share · user-upload ·
  conference-reshare · scraping · AI-ingestion · resale.
- **Access:** openly downloadable · preview-only · behind third-party paywall ·
  sale listing.

---

## 4. Severity scoring

Score each finding **Critical / High / Medium / Low**:

| Factor | Raises severity |
|---|---|
| Content sensitivity | Exam/question content > study guide > marketing excerpt |
| Completeness | Full copy > substantial excerpt > fragment |
| Reach | High-traffic platform / for-sale > obscure / single post |
| Freshness | Current edition > superseded edition |
| Attribution harm | Stripped/false attribution > intact |

Exam or question-bank content is treated as **Critical by default**.

---

## 5. Catalog schema (exposure record)

Each entry stores metadata and a pointer, never the content:

```
id                – internal identifier
content_type      – see Section 3
title_or_material – which ACAMS material (best match)
leak_vector       – see Section 3
platform_category – e.g. "document-sharing site", not a live pirate link in the deck
source_ref        – internal reference to the located item (for takedown use)
access_level      – openly downloadable / preview / paywalled / for-sale
severity          – Critical / High / Medium / Low
first_seen        – date
status            – new / triaged / takedown-filed / removed / recurring
recommended_action– monitor / takedown / harden / escalate-legal
```

For a Board deck, show `platform_category` and counts — not working links to
infringing copies.

---

## 6. Response playbook

1. **Triage** by severity; Critical (exam content) escalates to Legal same day.
2. **Takedown** via the hosting platform's notice process; log the notice.
3. **Track** status to removal; flag recurrence.
4. **Harden** the implicated vector (e.g., watermark gap, exposed preview,
   shared-credential pattern).
5. **Report** rolled-up metrics to the Board quarterly.

---

## 7. Cadence & tooling

- **Baseline:** one deep 90-day sweep to establish the exposure picture.
- **Ongoing:** scheduled lighter sweeps (e.g., monthly) plus event-triggered
  runs after new releases or conferences.
- **Agent role:** the agentic tool performs discovery, classification, scoring,
  de-duplication, and catalog updates; humans own authorization, takedown
  decisions, and Legal escalation.

---

## 8. Guardrails (what the program must not do)

- No circumventing paywalls or access controls (ACAMS or third-party).
- No anti-bot / CAPTCHA evasion or credentialed scraping.
- No storing or redistributing leaked content; metadata and pointers only.
- No action outside the authorized scope and period.

These guardrails keep the program defensible and its enforcement record clean.
