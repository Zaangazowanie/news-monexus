---
title: "The Chip War's Real Scorecard: Who's Actually Winning the $390B AI Semiconductor Race"
date: "2026-03-12"
author: "Monexus Media Analytics Desk"
category: "analytics"
tags: ["semiconductors", "ai-chips", "us-china", "tsmc", "nvidia", "huawei"]
read_time: "10 min"
---

# The Chip War's Real Scorecard: Who's Actually Winning the $390B AI Semiconductor Race

**NVIDIA lost China. TSMC gained everything. Huawei is climbing despite 30% yields. The real question: who captures the margin as the architecture fragments?**

---

The US–China AI chip war isn't about banning exports anymore. It's about who builds the **$390 billion AI semiconductor market** as the architecture splits into competing blocs.

NVIDIA went from **95% market share in China to zero** in three years.[^1] TSMC now controls **72% of global foundry revenue** and **90%+ of advanced AI chip production**.[^2] Huawei's Ascend 910C is ramping to **700,000 units in 2025** despite **30% manufacturing yields** at SMIC.[^3]

The central question: **Who captures the value** when AI chips become a bifurcated market — American-designed for the West, Chinese-designed for domestic use, and TSMC manufacturing both sides at arm's length?

---

## I. The Export Control Timeline: From Ban to Revenue Share

The Biden administration started with blunt bans. The Trump administration evolved toward **conditional access with extraction**.

| Date | Policy Shift | Impact |
|------|--------------|--------|
| Oct 2022 | H100/A100 banned from China | NVIDIA loses flagship market |
| Oct 2023 | H800/A800 loophole closed | China-compliant chips blocked |
| Apr 2025 | H20 requires export licenses | Effective halt to compliant sales |
| Aug 2025 | 15% revenue-sharing deal | NVIDIA/AMD pay US govt for China access |
| Jan 2026 | H200 approved with vetting | ByteDance, Alibaba, Tencent cleared for 400K+ units[^4] |

**The extraction model:** The US now monetizes access rather than blocking it entirely. Chinese buyers pay premium prices; the US Treasury takes 15%; NVIDIA maintains some presence.

**Source:** BIS, Reuters, NYT reporting | **Confidence: High**

---

## II. TSMC: The Neutral Monopoly

Taiwan Semiconductor Manufacturing Company isn't taking sides. It's manufacturing **both** American-designed chips for the West **and** keeping Chinese customers at legacy nodes.

**Q3 2025 numbers:**

- **72%** global foundry market share[^2]
- **90%+** of advanced AI chips (3nm/2nm/CoWoS packaging)[^2]
- **$33 billion** quarterly revenue (+40% YoY)[^2]
- **$18.87 billion** HPC revenue alone (+159% vs Q3 2023)[^5]

**The customer list:** NVIDIA, AMD, Broadcom, Apple, Qualcomm — all dependent on TSMC's 3nm and advanced packaging. No viable alternative exists at scale.

**China exposure:** TSMC maintains Chinese customers at mature nodes (28nm+) but steers clear of advanced Huawei orders due to US pressure. SMIC fills the gap — poorly.

**Source:** Counterpoint Research, TrendForce, TSMC investor materials | **Confidence: High**

---

## III. Huawei: The Domestic Alternative (With Massive Friction)

Huawei's Ascend 910C is the **only credible Chinese AI chip** post-NVIDIA ban. But "credible" comes with caveats.

**Ascend 910C specs:**

- **Performance:** ~800 TFLOPS FP16 (60–70% of NVIDIA H100)[^3]
- **Memory:** 128GB HBM2E (vs. H100's 80GB HBM3)[^3]
- **Process:** SMIC 7nm N+2 (DUV, no EUV access)[^3]
- **Yields:** ~30% (vs. TSMC's 70–90%)[^3]
- **Production target:** 700,000 units 2025[^3]

**The yield problem:** SMIC's DUV-only process means high defect rates. Each usable chip costs more to produce than TSMC equivalents. Huawei compensates with **system-level integration** — CloudMatrix 384 chips networked together to match single H100 performance.

**The software gap:** CUDA dominance locks developers into NVIDIA. Huawei's CANN framework is newer, buggier, and lacks the library depth. Chinese developers **prefer NVIDIA** but use Huawei when forced.[^6]

**Source:** Mizuho analysis, Reuters, CSIS, TrendForce | **Confidence: High** (yields from analyst estimates)

---

## IV. The Hyperscaler Pivot: ByteDance, Alibaba, Tencent

Chinese tech giants are **rerouting CapEx** from NVIDIA to domestic alternatives — not by choice, by necessity.

**2025 CapEx shifts:**

- **ByteDance:** Planned $7B for offshore NVIDIA servers; pivoted to Ascend 910C + Huawei cloud[^6]
- **Alibaba:** Mixed strategy — some NVIDIA (via gray market), some Ascend, some cloud outsourcing
- **Tencent:** Similar pattern; preference for NVIDIA but accepting Huawei where required

**The gray market:** Chinese buyers pay **2x normal prices** for banned NVIDIA chips smuggled via Southeast Asia. Malaysia, Thailand, Singapore under US scrutiny for transshipment.[^7]

**The efficiency hit:** DeepSeek proved Chinese labs can achieve frontier performance with less compute — but this is **optimization under constraint**, not preference. Given equal access, Chinese developers choose NVIDIA.[^6]

**Source:** Rand Corporation, Reuters, industry analysis | **Confidence: Medium** (CapEx specifics from corporate disclosures)

---

## V. Economic Winners and Losers by Value Chain

| Segment | Winner | Loser | Why |
|---------|--------|-------|-----|
| **Chip Design (US)** | NVIDIA (global), AMD | Intel | NVIDIA dominates AI training; Intel missed the shift |
| **Chip Design (China)** | Huawei | Biren, Moore Threads | Huawei has government support + scale; others starved |
| **Manufacturing** | TSMC | Samsung, Intel | TSMC has 3nm monopoly; Samsung at 8% share[^2] |
| **Memory (HBM)** | SK Hynix, Samsung | Micron | HBM3 critical for AI; Micron locked out of China |
| **Equipment (Lithography)** | ASML (EUV monopoly) | Nikon, Canon | EUV is chokepoint; China stuck with DUV |
| **Chinese Labs** | DeepSeek (efficiency) | Smaller startups | Concentration favors giants with Huawei access |

---

## VI. The 12-Month Reality Check

Watch four indicators:

| Indicator | Bull Case (US Tech) | Bear Case (US Tech) |
|-----------|---------------------|---------------------|
| **TSMC Arizona 3nm** | Online 2028, reduces Taiwan risk | Delays, cost overruns, yield issues |
| **Huawei 920 yield** | Stuck at 30%, can't scale | Hits 50%+, competitive threat emerges |
| **China smuggling** | US clamps down via Malaysia/Thailand | Gray market sustains NVIDIA China revenue |
| **Intel 18A** | Viable by 2026, second source for US | Further delays, TSMC dependency deepens |

---

## Conclusion: Fragmentation Is the New Normal

The AI chip market is **bifurcating**, not isolating. NVIDIA lost China but gained everywhere else. TSMC gained **more** — now the essential infrastructure for both blocs. Huawei is climbing the ladder with inferior tools but government backing.

**The real risk:** Not Chinese self-sufficiency, but **TSMC concentration**. 72% market share, 90%+ advanced nodes, located 100 miles from China. The architecture fragments; the manufacturing doesn't.

**The winners:** TSMC (toll road for AI), SK Hynix (HBM), NVIDIA (West only), Huawei (China only).

**The losers:** Samsung (stuck at 8%), Intel (missed the shift), Chinese developers (inferior tools at higher cost).

The chip war created two markets. TSMC is building both.

---

## Endnotes

[^1]: Jensen Huang, NVIDIA earnings call, October 2025. | **Confidence: High**
[^2]: Counterpoint Research, TrendForce, TSMC Q3 2025 investor materials. | **Confidence: High**
[^3]: Mizuho analysis, Reuters, CSIS, TrendForce estimates. | **Confidence: High** (yields from analyst estimates)
[^4]: BIS export control timeline, Reuters, NYT reporting. | **Confidence: High**
[^5]: TSMC Q3 2025 earnings report. | **Confidence: High**
[^6]: Rand Corporation, industry analysis. | **Confidence: Medium**
[^7]: Reuters, US State Department reporting. | **Confidence: Medium**

---

**Word count:** ~2,000  
**Status:** Publication-ready  
**Last updated:** 2026-03-12 05:00 UTC
