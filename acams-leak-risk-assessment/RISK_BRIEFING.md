# ACAMS Proprietary Content Leakage — Board Risk Briefing

*Prepared for the ACAMS Board of Directors · Internal / Confidential · Draft*

> **Framing.** This briefing measures and communicates the risk that ACAMS
> proprietary content is exposed outside authorized channels. It is a
> *defensive* assessment. It catalogs exposure — what has leaked, where, how
> severe, and what to do — and recommends a monitoring-and-response program.
> It does not reproduce, rehost, or redistribute leaked material, and the
> supporting assessment work uses public sources only, without circumventing
> ACAMS access controls.

---

## 1. Executive summary

ACAMS's core commercial asset is proprietary knowledge: CAMS and advanced
certification study materials, exam content, courseware, standards, white
papers, and conference sessions. Much of this is gated behind membership,
certification fees, or event registration.

Content of this kind predictably escapes its paywall through a handful of
well-understood channels. The questions for the Board are not *whether* some
exposure exists — for any organization selling study and certification
content, some always does — but **how much, through which channels, what it
costs us, and whether we are detecting and responding to it systematically.**

Today ACAMS has no continuous, measured view of this exposure. This briefing
proposes standing up a sanctioned detection-and-response program, and uses an
agentic-AI-driven assessment as the engine that makes it fast and repeatable.

**Recommendation:** authorize a formal content-exposure monitoring program
(detection + takedown + hardening), owned by Security/IP with Legal, and fund
an initial 90-day baseline assessment.

---

## 2. Why this matters to the Board

| Dimension | Risk if content leaks unchecked |
|---|---|
| **Revenue** | Study guides, courseware, and exam-prep are recurring revenue. Freely available pirated copies erode subscription, cert-prep, and renewal income. |
| **Credential integrity** | CAMS is trusted because the exam is hard to game. Leaked exam/question content lets candidates pass without competence, devaluing the credential with employers and regulators. |
| **Regulatory trust** | ACAMS certifies people in AML compliance. A credential that can be obtained with leaked answers undermines the very risk function it certifies. |
| **Brand & partner trust** | Employers, regulators, and chapters rely on ACAMS content being authoritative and controlled. Visible, widespread piracy signals weak stewardship. |
| **Legal posture** | Unaddressed infringement weakens future enforcement. A documented, consistent takedown record strengthens it. |
| **Competitive** | Competitors and unofficial "bootcamp" resellers repackage leaked ACAMS material into cheaper offerings. |

---

## 3. How ACAMS content leaks — the threat model

Content escapes through six recurring vectors. A credible assessment measures
each one.

1. **Credential sharing & bulk download.** Shared member/subscriber logins
   used to pull down gated libraries, then redistributed.
2. **User uploads to study-sharing platforms.** Candidates upload study guides,
   flashcards, and "exam dumps" to document- and flashcard-sharing sites. This
   is typically the single largest and most visible vector.
3. **Conference & training redistribution.** Slide decks, recordings, and
   handouts from paid events reshared by attendees.
4. **Scraping of gated content.** Automated extraction of member-only or
   preview content from ACAMS web properties.
5. **Ingestion into AI / LLM corpora.** Proprietary text absorbed into model
   training sets and surfaced through AI answer engines, often without
   attribution or licensing.
6. **Resale & file-locker distribution.** Material sold or posted on
   marketplaces, file lockers, and private messaging/forum channels.

---

## 4. Likelihood & impact (qualitative)

| Vector | Likelihood | Impact | Priority |
|---|---|---|---|
| Study-sharing platform uploads | High | High | **P1** |
| Exam/question content exposure | Medium | Critical | **P1** |
| AI/LLM ingestion | High | Medium | **P2** |
| Conference material resharing | Medium | Medium | **P2** |
| Gated-content scraping | Medium | High | **P2** |
| Marketplace/file-locker resale | Medium | Medium | **P3** |

*Likelihood and impact are qualitative placeholders to be replaced with
measured findings from the baseline assessment (Section 6).*

---

## 5. What an agentic-AI assessment contributes (the capability)

The reason to showcase agentic AI to the Board: it turns a slow, manual,
never-finished monitoring chore into a fast, repeatable, measured program.

- **Breadth.** Sweeps many public sources (search engines, study-sharing
  platforms, file hosts, marketplaces, social, AI answer engines) in one pass.
- **Classification.** Tags each finding by content type, leak vector, and
  severity using a consistent rubric instead of ad-hoc human judgment.
- **De-duplication & trend tracking.** Collapses reposts and tracks exposure
  over time, so the Board sees a trend line, not anecdotes.
- **Prioritization.** Scores findings so Legal/Security act on the highest-harm
  items first (e.g., exam content) rather than easiest-found.
- **Repeatability.** Runs on a cadence, producing a defensible, auditable
  record that strengthens enforcement.

Crucially, the output is an **exposure catalog** — metadata and pointers for
response — not a copy of the leaked material.

---

## 6. Recommended program & mitigation roadmap

**Detect**
- Stand up continuous public-source monitoring across the six vectors.
- Establish a severity rubric and a single exposure catalog of record.

**Respond**
- Build a DMCA / platform-takedown workflow with templated notices and routing.
- Track takedown status and recurrence per item.

**Harden**
- Watermark and fingerprint high-value materials so leaks are traceable to a
  source account/event.
- Review access controls, rate limits, and bot defenses on gated properties.
- Set an AI-ingestion posture: crawler directives, licensing stance, and
  opt-out/removal requests to major model and answer-engine providers.

**Deter & educate**
- Member/attendee terms and watermarked-copy reminders.
- Pursue repeat commercial infringers through Legal.

**Measure**
- Report exposure trend, takedown throughput, and recurrence to the Board
  quarterly.

---

## 7. Asks of the Board

1. Endorse a sanctioned content-exposure monitoring program owned by
   Security/IP with Legal.
2. Fund a 90-day baseline assessment to replace the qualitative estimates in
   Section 4 with measured findings.
3. Approve the detection → takedown → hardening operating model in Section 6.

---

## 8. Scope & guardrails for the assessment

- **Authorized and internal.** Run under ACAMS sanction with Legal sign-off.
- **Public sources only.** No circumvention of ACAMS or third-party access
  controls or paywalls.
- **Exposure, not redistribution.** The catalog records what/where/severity and
  drives takedowns; it does not store or re-serve leaked content.
- **Response-oriented.** Every finding maps to an action (monitor, takedown,
  harden, escalate).

*Sections 4 and 6 are the live decision points for the Board; Section 5 is the
capability demonstration requested.*
