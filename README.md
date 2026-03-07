# PaperPal

**One-click research paper formatting, powered by open-source LLMs.**

Upload a `.docx`, `.txt`, or `.tex` file, pick a citation style, and get a publication-ready LaTeX PDF in under a minute. No manual formatting. No copy-pasting into Overleaf. No fighting with margins at 3 AM.

<<<<<<< Updated upstream
<<<<<<< Updated upstream
![PaperPal Hero](./docs/screenshots/hero.png)
<!-- Replace with an actual screenshot of the landing page -->
=======
![PaperPal Hero](./images/hero.png)
>>>>>>> Stashed changes
=======
![PaperPal Hero](./images/hero.png)
>>>>>>> Stashed changes

---

## Table of Contents

- [Why PaperPal?](#why-paperpal)
- [Demo](#demo)
- [Supported Formats](#supported-formats)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Team](#team)
- [License](#license)

---

## Why PaperPal?

Every student has been there — the paper is done, the content is solid, but now you need to reformat it for APA. Or IEEE. Or Vancouver. Manually adjusting margins, citation styles, heading levels, and reference lists eats hours that could go toward actual research.

PaperPal fixes this. Drop in your document, select a format, and the system produces LaTeX output that follows the exact typographic and structural rules of your chosen style. The generated PDF is ready to submit.

---

## Demo

<<<<<<< Updated upstream
<<<<<<< Updated upstream
| Landing Page | Format Selection | Upload & Parse |
|:---:|:---:|:---:|
| ![Landing](./docs/screenshots/landing.png) | ![Formats](./docs/screenshots/formats.png) | ![Upload](./docs/screenshots/upload.png) |

| Live Conversion | Editor + Preview | PDF Output |
|:---:|:---:|:---:|
| ![Converting](./docs/screenshots/converting.png) | ![Editor](./docs/screenshots/editor.png) | ![PDF](./docs/screenshots/pdf-output.png) |

<!-- Replace all placeholder paths above with real screenshots -->
=======
=======
>>>>>>> Stashed changes
| Landing Page | Format Selection |
|:---:|:---:|
| ![Landing](./images/hero.png) | ![Formats](./images/formats.png) |

| Upload & Parse | Editor + Preview |
|:---:|:---:|
| ![Upload](./images/upload_paper.png) | ![Editor](./images/split_Screen.png) |

| PDF Download |
|:---:|
| ![PDF](./images/download_pdf.png) |
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

---

## Supported Formats

| Format | Full Name | Typical Fields |
|--------|-----------|---------------|
| **APA** | American Psychological Association (7th ed.) | Psychology, Education, Social Sciences |
| **MLA** | Modern Language Association (9th ed.) | Humanities, Literature, Arts |
| **Chicago** | Chicago Manual of Style (Notes & Bibliography) | History, Publishing, General Academic |
| **Harvard** | Harvard Referencing | Business, Social Sciences, General Use |
| **IEEE** | IEEE Conference / Journal | Engineering, Computer Science, Electronics |
| **AMA** | American Medical Association | Medicine, Health, Biological Sciences |
| **Vancouver** | Vancouver (ICMJE) | Biomedical Journals, Clinical Research |
| **ACS** | American Chemical Society | Chemistry, Biochemistry, Materials Science |
| **CSE** | Council of Science Editors | Biology, Earth Sciences, Natural Sciences |
| **Custom** | User-Defined | Any — define your own rules |

Each format has a dedicated **master prompt** that describes the exact visual and structural expectations (fonts, spacing, heading hierarchy, citation mechanics, reference list formatting). The LLM doesn't guess — it follows a specification.

---

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│   Frontend   │────▶│  /api/parse      │────▶│  Document Parser     │
│  (Next.js)   │     │  (extract text)  │     │  mammoth / plaintext │
└──────┬───────┘     └──────────────────┘     └──────────────────────┘
       │
       │  SSE stream
       ▼
┌──────────────────┐     ┌─────────────────────────────────┐
│  /api/convert    │────▶│  Token Pool (round-robin)       │
│  (LaTeX gen)     │     │  5 HF tokens × 5 model tiers    │
└──────┬───────────┘     │  auto-fallback on 429/503/404   │
       │                 └─────────────────────────────────┘
       │                          │
       ▼                          ▼
┌──────────────────┐     ┌─────────────────────────────────┐
│  Assemble LaTeX  │     │  HuggingFace Inference API      │
│  + code-based    │     │  Qwen 72B → Llama 3.3 70B →     │
│  reference fmt   │     │  Qwen Coder 32B → Mixtral 8x7B  │
└──────┬───────────┘     │  → Gemma 2 2B (fallback chain)  │
       │                 └─────────────────────────────────┘
       ▼
┌──────────────────┐
│  Browser Preview │
│  + PDF export    │
└──────────────────┘
```

**Key design decisions:**

- **Token round-robin** — 5 HuggingFace API tokens are rotated to avoid per-token rate limits. If a token gets rate-limited (429) or a model returns 503, the pool automatically moves to the next token and model tier.
- **Model fallback chain** — Qwen 72B is tried first for best quality. If unavailable, it falls through Llama 3.3 70B, Qwen Coder 32B, Mixtral 8x7B, and finally Gemma 2 2B.
- **Code-based references** — References/bibliography entries are parsed and formatted programmatically (not by the LLM) to eliminate hallucinated citations.
- **Chunked processing** — Long documents are split into ~2000-character chunks and processed in parallel batches of 3, then stitched together.
- **Anti-hallucination guards** — Strict grounding rules in every prompt ensure the LLM reformats existing content without inventing text, fake authors, or placeholder references.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, React 19) |
| Language | TypeScript 5.7 |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://motion.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Document Parsing | [Mammoth](https://github.com/mwilliamson/mammoth.js) (DOCX → text) |
| LLM Inference | [HuggingFace Inference API](https://huggingface.co/docs/api-inference/) |
| Auth | [MongoDB Atlas](https://www.mongodb.com/atlas) + [JWT](https://jwt.io/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| PDF Generation | Browser print dialog (Save as PDF) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x ([download](https://nodejs.org/))
- **npm** >= 9.x (comes with Node)
- **5 HuggingFace API tokens** — free tier works. ([create tokens here](https://huggingface.co/settings/tokens))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/PaperPal.git
cd PaperPal

# Install dependencies
npm install
```

### Environment Variables

Copy the example env file and fill in your HuggingFace tokens:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
HF_TOKEN_1=hf_your_first_token_here
HF_TOKEN_2=hf_your_second_token_here
HF_TOKEN_3=hf_your_third_token_here
HF_TOKEN_4=hf_your_fourth_token_here
HF_TOKEN_5=hf_your_fifth_token_here

MONGODB_URI=mongodb+srv://user:password@your-cluster.mongodb.net/paperpal
JWT_SECRET=some-random-secret-string-at-least-32-chars
```

**How to create a HuggingFace token:**

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click **Create new token**
3. Select **Fine-grained** token type
4. Check the **"Make calls to Inference Providers"** permission
5. Generate and copy the token

You can use fewer than 5 tokens — the system will work with as few as 1, but rate limits will be hit more often.

**MongoDB Atlas setup:**

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user with read/write permissions
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Copy the connection string and paste it as `MONGODB_URI` — replace `<db_password>` with your actual password and append `/paperpal` as the database name

### Running Locally

```bash
# Development server (hot reload)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Production build
npm run build
npm start
```

---

## How It Works

1. **Pick a format** — Choose from 10 citation styles on the format selection page. Each tile shows the style's full name, typical fields of use, and a citation example.

2. **Upload your document** — Drag and drop (or browse) a `.docx`, `.txt`, or `.tex` file. The server-side parser extracts the title, abstract, body sections, and raw references using Mammoth (for DOCX) or plain text processing.

3. **AI conversion begins** — The extracted text is chunked and sent to HuggingFace LLMs via Server-Sent Events (SSE). You see real-time progress: which model is processing, which chunk is being converted, and the overall percentage.

4. **LaTeX assembly** — The preamble is generated first (document class, packages, formatting commands specific to the chosen style). Then each body chunk is converted. Finally, references are formatted by code — not by the LLM — to prevent hallucinated citations.

5. **Preview and edit** — A split-pane editor shows the raw LaTeX on the left and a rendered preview on the right. You can switch between code-only, preview-only, or split view. Zoom controls let you inspect the output closely.

6. **Download as PDF** — Click "Download PDF" to open a print-ready view in a new tab. Use your browser's "Save as PDF" to get the final file.

---

## Project Structure

```
PaperPal/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── route.ts         # Unified signin/signup endpoint
│   │   │   │   ├── signin/route.ts  # Dedicated signin endpoint
│   │   │   │   ├── signup/route.ts  # Dedicated signup endpoint
│   │   │   │   ├── me/route.ts      # Token verification (GET /api/auth/me)
│   │   │   │   └── logout/route.ts  # Logout + cookie clear
│   │   │   ├── convert/route.ts     # LaTeX generation (SSE streaming)
│   │   │   └── parse/route.ts       # Document parsing (DOCX/TXT/TEX)
│   │   ├── auth/page.tsx            # Full-page sign in / sign up
│   │   ├── editor/page.tsx          # Split-pane LaTeX editor + preview
│   │   ├── formats/page.tsx         # Format selection grid
│   │   ├── upload/page.tsx          # File upload + format picker
│   │   ├── page.tsx                 # Landing page
│   │   ├── globals.css              # Tailwind + custom styles
│   │   └── layout.tsx               # Root layout (AuthProvider, fonts)
│   ├── components/
│   │   ├── GlowCard.tsx             # Hover-glow card component
│   │   ├── Navbar.tsx               # Top nav with user menu + logout
│   │   ├── PageTransition.tsx       # Route transition wrapper
│   │   └── TextReveal.tsx           # Scroll-triggered text animation
│   ├── context/
│   │   └── AuthContext.tsx           # React context for auth state + JWT
│   └── lib/
│       ├── constants.ts             # Format options (IDs, names, colors)
│       ├── db.ts                    # MongoDB connection (cached singleton)
│       ├── jwt.ts                   # JWT sign/verify/extract helpers
│       ├── models.ts                # LLM model tiers + format master prompts
│       ├── token-pool.ts            # HF token rotation + fallback logic
│       └── user.ts                  # Mongoose User schema + bcrypt
├── .env.example                     # Environment variable template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Roadmap

- [x] Multi-model LLM pipeline with round-robin token distribution
- [x] 10 citation format support (APA, MLA, Chicago, Harvard, IEEE, AMA, Vancouver, ACS, CSE, Custom)
- [x] Format-specific master prompts for accurate LaTeX generation
- [x] Real-time SSE progress tracking during conversion
- [x] Anti-hallucination grounding rules
- [x] Code-based reference formatting (no LLM-generated citations)
- [x] Split-pane LaTeX editor with live preview
- [x] PDF export via browser print
- [x] **MongoDB + JWT authentication** — user registration, login, profile management with bcrypt password hashing
- [ ] Figure and table extraction from DOCX
- [ ] Direct PDF download (server-side LaTeX compilation)
- [ ] Batch conversion (multiple papers at once)
- [ ] Custom format builder UI

---

## Team

Built during a hackathon by a team of 5. Each member contributed a HuggingFace API token to the shared pool — that's how the multi-token architecture was born.

<!-- 
| Name | Role | GitHub |
|------|------|--------|
| Member 1 | Frontend / UI | [@handle](https://github.com/handle) |
| Member 2 | LLM Pipeline | [@handle](https://github.com/handle) |
| Member 3 | Document Parsing | [@handle](https://github.com/handle) |
| Member 4 | Prompt Engineering | [@handle](https://github.com/handle) |
| Member 5 | Integration / Testing | [@handle](https://github.com/handle) |
-->

---

## License

This project is for academic and educational use. See [LICENSE](./LICENSE) for details.

<!-- Add a LICENSE file if needed (MIT recommended) -->
