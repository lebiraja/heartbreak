# 🚀 Stellar Resolve — Story-First Game Design Document
*A Dreamlike Narrative Space Shooter*

---

## 🎮 Game Overview

**Title:** Stellar Resolve  
**Genre:** Story-Heavy Space Shooter (Solo Player)  
**Platform:** Web (Browser-first)  
**Engine:** Phaser 3  
**Language:** TypeScript  
**Narrative Density:** ~70% Story / ~30% Combat  
**Visual Style:** 60% Skeuomorphism + 40% Neo-Brutalism  
**Tone:** Dreamlike, introspective, emotional, surreal  
**Rating Direction:** Realistic damage effects (non-graphic but impactful)

---

## 🧑‍🚀 Protagonist

**Name:** Stark  
**Gender:** Male  
**Age:** 18  

**Character Core:**  
A young pilot drifting through fractured dreamscapes after a painful breakup. The journey home is symbolic — it is not merely physical, but psychological. Each level represents an emotional confrontation, realization, or transformation.

---

## 💔 Narrative Premise

Stark’s girlfriend is **gone** after a breakup.  
The game unfolds inside a **dreamlike mental universe**, where memories distort into enemies, environments fracture, and emotional states reshape reality.

The player is not just flying through space — they are navigating Stark’s subconscious.

---

## 🎭 Narrative Style

**Chosen Format:**  
✔ First-person introspective tone *(Option A)*  
✔ Short vignette storytelling  
✔ Sprite-animated + full-motion 2D cutscenes  
✔ Text-based dialogue & reflections  

**Story Delivery Layers:**

1. **Opening Cinematic**
2. **Level Intro Vignette**
3. **In-Level Symbolism**
4. **Mid-Level Whisper Events**
5. **End-Level Reflection**
6. **Branch Choice (5 major points total)**

---

## 🧠 Narrative Structure

The game is **branching**, but ends with a **single resolution**.

**Branching Purpose:**  
Choices alter Stark’s internal reflections, tone of later scenes, visual atmosphere, and emotional interpretation — **not the final destination**.

---

## 🗺 Level Philosophy

Each level is:

✔ A dream  
✔ A psychological metaphor  
✔ A lesson  
✔ A story vignette  
✔ Increasing difficulty  

---

## 📜 Quotes → Emotional Arc

| Level | Quote | Emotional Theme |
|------|------|----------------|
| 1 | We learn from history that we do not learn anything from history. | Repetition & denial |
| 2 | People get lost in thought because it is unfamiliar territory. | Fear of introspection |
| 3 | If only I could be respected without having to be respectable. | Identity vs validation |
| 4 | All wise men share one trait in common: the ability to listen. | Listening inward |
| 5 | Put your trust in those who are worthy. | Trust & boundaries |
| 6 | All I ask of life is a constant and exaggerated sense of my own importance. | Ego vs worth |
| 7 | The more things change, the more they stay insane. | Chaos & acceptance |
| 8 | There will be big changes for you, but you will be happy. | Hope & transition |
| 9 | Due to circumstances beyond your control... captain of your soul. | Agency |
| 10 | Among the lucky, you are the chosen one. | Resolution |

---

# 🌌 LEVEL DESIGN + STORY

---

## **LEVEL 1 — Echoes of Yesterday**

**Environment:**  
Floating debris, shattered photographs, distorted stars.

**Intro Vignette:**  
Stark drifts through fragments of repeated memories. He recognizes patterns but resists change.

**Gameplay Focus:**  
Basic controls, slow enemies.

**Narrative Mechanic:**  
Destroyed enemies dissolve into memory echoes.

**Reflection:**  
“I thought I was moving forward… but I kept reliving the same goodbye.”

---

## **LEVEL 2 — Mind Maze**

**Environment:**  
Nebula corridors forming labyrinthine paths.

**Story Theme:**  
Fear of thinking deeply.

**New Mechanic:**  
Fog zones distort controls.

**Narrative Event:**  
Whispers question Stark’s avoidance.

**Reflection:**  
“My thoughts feel like a place I don’t know how to survive.”

---

## **LEVEL 3 — Facade Mirrors**

**Environment:**  
Reflective crystalline asteroids.

**Story Theme:**  
Self-image vs others’ perception.

**New Mechanic:**  
Mirror enemies mimic player actions.

**Reflection:**  
“Was I trying to be loved… or just approved?”

---

## **LEVEL 4 — Quiet Signals**

**Environment:**  
Silent space, faint glowing pulses.

**Story Theme:**  
Learning to listen.

**New Mechanic:**  
Audio/visual cue-based enemy attacks.

**Reflection:**  
“The noise faded. My own voice remained.”

---

## **LEVEL 5 — Trust Bridge** *(CHOICE POINT 1)*

**Environment:**  
Broken cosmic bridge.

**Story Theme:**  
Trust & boundaries.

**Choice:**  
Help a fragile drifting entity OR ignore.

**Impact:**  
Alters Stark’s empathy tone later.

**Reflection:**  
“Trust is not blindness. It is selection.”

---

## **LEVEL 6 — Ego Engine**

**Environment:**  
Massive abandoned warship.

**Story Theme:**  
Ego vs insecurity.

**Mechanic:**  
Overpowered weapon drains shield.

**Reflection:**  
“I mistook attention for importance.”

---

## **LEVEL 7 — Chaos Current** *(CHOICE POINT 2)*

**Environment:**  
Shifting unstable reality waves.

**Story Theme:**  
Acceptance of chaos.

**Choice:**  
Fight aggressively OR flow defensively.

**Impact:**  
Changes Stark’s later dialogue style.

---

## **LEVEL 8 — New Growth**

**Environment:**  
Birth of stars, luminous colors.

**Story Theme:**  
Hope & transformation.

**Mechanic:**  
Large empowering boosts.

**Reflection:**  
“Change stopped feeling like loss.”

---

## **LEVEL 9 — Helm of Fate** *(CHOICE POINT 3 & 4)*

**Environment:**  
Approaching home system.

**Story Theme:**  
Agency.

**Mechanic:**  
Strategic boss encounter.

**Choices:**  
Mercy vs destruction  
Risk vs caution

---

## **LEVEL 10 — Homecoming** *(CHOICE POINT 5)*

**Environment:**  
Dream dissolves → clarity.

**Story Theme:**  
Resolution & self-selection.

**Final Choice:**  
Cling to memory OR release.

**Ending:**  
Single resolution — Stark lands home, stronger, clear-minded.

**Final Reflection:**  
“I was never abandoned. I was becoming.”

---

# 🎯 GAMEPLAY SYSTEMS

---

## 🚀 Player Mechanics
- Twin-stick movement (WASD + mouse)
- Primary & charged fire
- Shield / Health energy system
- Realistic hit feedback (camera shake + impact sound)

---

## 👾 Enemies
- Symbolic inner demons
- Environmental hazards
- Dream distortions
- Mini-bosses & final boss

---

## 🏆 Score & High Score
- Combos
- Accuracy bonus
- Memory Shards
- Local leaderboard (default)

---

## 📖 Journal System (Read-Only)
- Unlock reflections automatically
- No typing (per requirement)

---

# 🎨 VISUAL DESIGN

---

## Skeuomorphic Elements (60%)
✔ Cockpit overlay  
✔ Analog health/shield gauges  
✔ Mechanical toggles  
✔ Metallic textures  

## Neo-Brutalist Elements (40%)
✔ Bold menu blocks  
✔ Heavy typography  
✔ Hard shadows  
✔ Minimalist brutalist cards  

---

# 🔊 AUDIO DESIGN

- Emotional adaptive soundtrack
- Dream ambience
- Tactile UI sounds
- Subtle whisper layers

---

# ♿ ACCESSIBILITY

✔ Full screen reader support  
✔ Reduced motion toggle  
✔ High contrast mode  
✔ Subtitles everywhere  
✔ Audio sliders  
✔ Remappable controls  

---

# 🧱 TECHNICAL ARCHITECTURE

**Scenes:**
- Boot
- Title
- Level Select
- Level Scene
- UI Scene
- Journal
- Settings
- Ending

**Persistence:**
- IndexedDB / localStorage
- Versioned save schema

---

# 🚀 DEPLOYMENT

**Phase 1:** Static Web App  
**Phase 2 (Later):** Edge optimization / CDN  

---

# 🧭 PRODUCTION PRIORITIES

1. Core movement & shooting
2. Narrative framework
3. Level scripting system
4. UI/UX hybrid style
5. Accessibility layer
6. Cutscenes
7. Polish

---

# 🎬 ENDING EXPERIENCE

Final landing → cockpit fades → dream dissolves → quiet music → last reflection.

No triumph fanfare.  
Just peace.

---

# ✅ NEXT DELIVERABLES I CAN CREATE

Choose what you want next:

A️⃣ Phaser + TypeScript boilerplate  
B️⃣ Full narrative scripts (cutscene text + reflections)  
C️⃣ Level JSON configs  
D️⃣ UI component specification  
E️⃣ Asset & art brief  
F️⃣ Audio direction sheet  

---

**This is no longer just a shooter.  
It is Stark’s emotional odyssey.**
