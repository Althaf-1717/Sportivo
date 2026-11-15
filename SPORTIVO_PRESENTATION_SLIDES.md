# SPORTIVO — PROJECT PRESENTATION SLIDES & SPEAKER SCRIPT

**Course Code:** INT257 — Modern Web Application Development  
**Assessment:** Continuous Assessment 3 (Spring 2025)  
**Project Name:** Sportivo (Athletic Academy Management Platform)  
**Live Application:** [https://sportivo-flax.vercel.app](https://sportivo-flax.vercel.app)  
**GitHub Repository:** [https://github.com/Althaf-1717/Sportivo.git](https://github.com/Althaf-1717/Sportivo.git)  

---

### Team Members & Role Distribution

| Presenter | Registration No. | Assigned Project Ownership & Presentation Scope |
| :--- | :---: | :--- |
| **Shaik Althaf** | **12406252** | **UI/UX Engineering, Responsive Layouts, Attendance Workspace** |
| **Y. V. V. Tirumala Tanay** | **12407797** | **Full-Stack Architecture, Auth.js v5, Database & API Integration** |
| **Sane Praneeth Kumar Reddy** | **12404540** | **Dashboard Analytics, Role Verification & Cloud Deployment** |

---

## Slide 1: Title Slide
* **Presenter:** Joint Introduction (Led by Shaik Althaf)
* **Visual / Layout:** Sportivo Academy Logo with orange accent branding (`#EA580C`), clean cream-and-navy backdrop, live URL badges.
* **Slide Content:**
  * **Project Title:** SPORTIVO — Athletic Academy Management Platform
  * **Tagline:** Empowering Athletes, Streamlining Field Coaching, & Automating Academy Governance
  * **Course Details:** INT257: Modern Web Application Development (CA3)
  * **Team Contributors:**
    * Shaik Althaf (12406252) — *UI/UX Engineering & Attendance Workspace*
    * Y. V. V. Tirumala Tanay (12407797) — *Full-Stack Architecture & Auth.js v5 Integration*
    * Sane Praneeth Kumar Reddy (12404540) — *Dashboard Analytics & Cloud Deployment*
  * **Live Production:** `https://sportivo-flax.vercel.app`
* **Speaker Script (Althaf):**
  > "Good morning respected faculty and fellow classmates. Today, our team is proud to present **Sportivo**, a production-ready, cloud-native Athletic Academy Management Platform engineered using the modern Next.js 16 App Router, React 19, Auth.js v5, and MongoDB Atlas. In this presentation, we will walk you through the end-to-end engineering of the system, divided into Full-Stack Architecture by Tanay, UI/UX Engineering and the Attendance Workspace by me, and Analytics, Role Verification, and Cloud Deployment by Praneeth."

---

## Slide 2: Problem Statement & Motivation
* **Presenter:** Shaik Althaf
* **Visual / Layout:** Split comparison graphic: Traditional Academy Challenges (Paper/Excel/WhatsApp) vs. The Sportivo Solution.
* **Slide Content:**
  * **The Problem in Traditional Academies:**
    * Manual paper registers leading to lost session data and inaccurate attendance rates.
    * Fragmented communication across WhatsApp groups and spreadsheets.
    * Opaque membership tracking, unverified payments, and zero visibility for athletes into their skill progression.
  * **The Sportivo Solution:**
    * **Single Source of Truth:** Centralized database unifying students, coaches, and administrators.
    * **Instant Digital Attendance:** Coaches take pitch-side attendance in under 5 seconds with zero layout shift.
    * **Self-Service Student Hub:** Real-time visibility into attendance percentages, coach reviews, and training schedules.
* **Speaker Script (Althaf):**
  > "Most athletic academies and training squads still rely on physical sign-in sheets or informal messaging groups. This creates massive friction: attendance records get misplaced, coaches spend training time managing rosters, and students have no structured view of their athletic growth. We designed Sportivo to completely modernize this ecosystem with dedicated, role-isolated portals for students, coaches, and administrators."

---

## Slide 3: High-Level System Architecture & Technology Stack
* **Presenter:** Y. V. V. Tirumala Tanay
* **Visual / Layout:** 3-tier architectural diagram showing Client Layer -> Edge Middleware & Server Components -> Persistent Data Layer & External Cloud APIs.
* **Slide Content:**
  * **Frontend & Presentation:** Next.js 16.3.6 (App Router), React 19, Tailwind CSS 3.4, Lucide Icons.
  * **Authentication & Identity:** Auth.js v5 (NextAuth.js) + Google Cloud Console OAuth 2.0 (OIDC) + bcryptjs (12 rounds).
  * **Backend & API Layer:** Next.js Server Actions, Route Handlers, Edge Proxy Middleware (`proxy.js`).
  * **Database & Persistence:** MongoDB Atlas Replica Set via Mongoose 8.x ODM with compound indexing.
  * **Visualization & Analytics:** Recharts for responsive SVG performance trends.
  * **Cloud Infrastructure:** Vercel Global Edge Network with CI/CD automated deployment.
* **Speaker Script (Tanay):**
  > "Moving to the technical foundation: Sportivo is built on a high-concurrency, serverless architecture. We selected Next.js 16 App Router and React 19 to leverage React Server Components, which fetch data directly on the server without shipping bulky client-side JavaScript. For our persistent layer, we utilize MongoDB Atlas through Mongoose ODM, while routing and role protection are handled right at the edge using our custom Next.js middleware."

---

## Slide 4: Database Schemas & Data Modeling
* **Presenter:** Y. V. V. Tirumala Tanay
* **Visual / Layout:** Entity-Relationship (ER) Diagram highlighting User, Coach, Sport, Enrollment, Attendance, Progress, and Payment collections.
* **Slide Content:**
  * **Mongoose Document Models:**
    * `User`: Multi-role schema (`student`, `coach`, `admin`), unique email index, sparse `studentId` index (auto-incremented from `10001`).
    * `Sport`: Program metadata, category tags, skill milestones, squad schedules.
    * `Enrollment`: Many-to-many junction binding athlete, chosen coach, sport discipline, and membership duration.
    * `Attendance`: Compound unique index `{ student: 1, enrollment: 1, date: 1 }` ensuring strict audit consistency per training day.
    * `Progress`: Coach evaluations tracking skill levels (`Beginner`, `Intermediate`, `Advanced`, `Professional`) and drill scores.
    * `Payment`: Transaction reference auditing with status verification.
* **Speaker Script (Tanay):**
  > "In designing our data layer, relational integrity within a NoSQL database was critical. For example, our Attendance collection utilizes a compound unique index on student, enrollment, and date. This guarantees that an athlete cannot have duplicate attendance logged on the same training day. Furthermore, student athletes receive an auto-incrementing student ID starting at 10001, allowing administrators to audit members with clean, human-readable IDs."

---

## Slide 5: Auth.js v5 & Real Google Cloud OAuth 2.0 Integration
* **Presenter:** Y. V. V. Tirumala Tanay
* **Visual / Layout:** Sequence diagram showing OAuth 2.0 handshake between User Browser -> Google Accounts -> Sportivo Callback -> MongoDB.
* **Slide Content:**
  * **OAuth 2.0 Client Credentials:**
    * Provisioned in Google Cloud Console (`PAS-GPT` / `Sportivo Web`).
    * Authorized Origins: `https://sportivo-flax.vercel.app` & `http://localhost:3000`.
    * Authorized Redirect URI: `/api/auth/callback/google`.
  * **Key OAuth Engineering Highlights:**
    * **`prompt: "select_account"`:** Enforces the browser to display all signed-in Google accounts on that device.
    * **Stateless JWT Sessions:** Eliminates database session bloat; cryptographically signed session tokens stored in secure, HTTP-only cookies.
    * **Auto-Onboarding in `signIn` Callback:** First-time Google logins automatically create a new Student record, assign an incremental student ID, and grant instant access.
* **Speaker Script (Tanay):**
  > "For authentication, we transitioned from mock simulations to official Google Cloud OAuth 2.0. By configuring `prompt: 'select_account'` in Auth.js, Sportivo invokes the native Google browser account chooser dialog. When an athlete clicks 'Sign in with Google', they select their Gmail account, and our NextAuth signIn callback automatically validates their profile, seeds a new student document if they are registering for the first time, assigns their student ID, and issues a stateless, cryptographically secure JWT."

---

## Slide 6: RESTful API Handlers & Resilient Data Fetching
* **Presenter:** Y. V. V. Tirumala Tanay
* **Visual / Layout:** API endpoint inventory table accompanied by code block showing resilient Server Component `try/catch` fallbacks.
* **Slide Content:**
  * **API Route Architecture:**
    * `/api/auth/[...nextauth]` — Handles Google OIDC handshakes, CSRF validation, and credentials sign-in.
    * `/api/attendance` — Batch attendance processing with server-side validation.
    * `/api/enrollments` — Student program enrollment and squad assignment.
    * `/api/auth/clear` — Immediate multi-cookie teardown endpoint for reliable sign-out across subdomains.
  * **Fault-Tolerant Data Fetching:**
    * Explicit Mongoose model pre-compilation (`User`, `Sport`) prevents serverless `MissingSchemaError`.
    * Safe fallback objects guarantee that external database lag never crashes Server Components.
* **Speaker Script (Tanay):**
  > "Our API layer is designed with strict fault tolerance. Serverless functions on Vercel can experience cold starts or transient database latency. To prevent cascading failures, all data loaders in `dashboard-data.js` are wrapped in try-catch blocks with safe empty-state defaults. Furthermore, we implemented `/api/auth/clear`, an endpoint that purges all chunked NextAuth session cookies across domains, ensuring users can switch accounts smoothly without session locks."

---

## Slide 7: UI/UX Philosophy & Design System
* **Presenter:** Shaik Althaf
* **Visual / Layout:** Design system color palette swatches, typography hierarchy (Poppins, Inter), and Glassmorphism card mockups.
* **Slide Content:**
  * **Visual Language:**
    * Warm athletic orange accents (`#EA580C`) paired with deep navy headings (`#0F172A`) on an ultra-clean cream background (`#FFFCF9`).
    * Glassmorphic surface cards with subtle borders (`border-stone-200/80`) and layered drop shadows (`shadow-2xs`).
  * **Typography Standard:**
    * Strict modern typography utilizing `Poppins` and `Inter` with distinct weight hierarchies (Bold for emphasis, Semibold for UI labels).
  * **Mobile-First Responsive Scale:**
    * Fluid responsive grids adapting seamlessly from compact 320px smartphones to pitch-side tablets and desktop widescreen dashboards.
* **Speaker Script (Althaf):**
  > "Now, turning to the user experience and front-end engineering. As the UI/UX lead, my primary objective was to make Sportivo feel modern, premium, and instant. We adopted a warm athletic aesthetic featuring our signature orange and navy accents. Every component uses soft borders, glassmorphic surface cards, and a strict font pairing of Poppins and Inter. The interface is 100% mobile-first, ensuring coaches on the field have identical usability to administrators on 4K desktop screens."

---

## Slide 8: Interactive Attendance Workspace & Drill Logging
* **Presenter:** Shaik Althaf
* **Visual / Layout:** Screenshot of the Coach Attendance Workspace highlighting the Date, Time, Work inputs, and the "OK" trigger button.
* **Slide Content:**
  * **Clean Top-Level Session Bar:**
    * Real-time date auto-detection, session time picker, and custom training workout input (`Work`).
  * **The "OK" Button Dropdown Reveal Mechanism:**
    * Assigned athlete roster is hidden/collapsed by default to maintain a clean viewport and prevent layout clutter.
    * Clicking **`OK`** validates the drill input and triggers a smooth fade-in reveal animation (`animate-[fadeIn_0.35s_ease-out]`) dropping down the athlete roster.
    * Clicking **`OK`** again acts as an interactive toggle to collapse the workspace.
* **Speaker Script (Althaf):**
  > "One of our crowning front-end achievements is the Coach Attendance Workspace. Field coaches don't want to scroll past a massive 50-student table before setting their session details. By default, the assigned student list is collapsed. The coach enters today's date, training drills—such as 'Footwork conditioning and net bowling'—and clicks the 'OK' button. This triggers a smooth CSS fade-in dropdown, revealing only the athletes assigned to that coach's squad."

---

## Slide 9: Dual-State Visual Attendance Toggles
* **Presenter:** Shaik Althaf
* **Visual / Layout:** Before-and-after comparison showing old text buttons vs. the new accessible, pure Green / Red toggle switches.
* **Slide Content:**
  * **Zero Text Clutter:**
    * Removed bulky text buttons (`ON (Present)` / `OFF (Absent)`), replacing them with sleek, accessible toggle switches (`role="switch"`).
  * **High-Contrast Dual States:**
    * **ON (Present):** Glowing emerald green background (`bg-emerald-500`) with knob translated right (`translate-x-5`).
    * **OFF (Absent):** Rich crimson red background (`bg-red-500`) with knob translated left (`translate-x-0`).
  * **Performance & Feedback:**
    * Hardware-accelerated GPU transitions (`transform` and `transition-colors`) ensuring a steady 60fps interaction with instant visual feedback.
* **Speaker Script (Althaf):**
  > "For marking attendance, we eliminated bulky text buttons and engineered custom dual-state toggle switches. When an athlete is marked present, the toggle turns bright emerald green with the knob slid to the right. When absent, it turns crimson red with the knob to the left. These toggles animate purely through GPU-friendly transform and color transitions, allowing coaches to mark an entire team in seconds without any input lag or layout shift."

---

## Slide 10: Multi-Portal Navigation & Micro-Interactions
* **Presenter:** Shaik Althaf
* **Visual / Layout:** Side-by-side screenshots of Student, Coach, and Admin layouts, highlighting fixed navigation and 3D hover effects.
* **Slide Content:**
  * **Unified Navigation Shell (`DashboardShell.js`):**
    * Removed distracting sidebar collapse icons to guarantee a stable, fixed navigation rail across all three user roles.
    * Mobile slide-over drawer with backdrop blur (`backdrop-blur-xs`) for one-thumb smartphone navigation.
  * **Micro-Interactions & Speed Feel:**
    * Route prefetching on mount enables instant, sub-50ms tab switches.
    * 3D hover feedback on cards and buttons with active scale compression (`active:scale-95`).
* **Speaker Script (Althaf):**
  > "Across our navigation shell, we refined every micro-interaction. We removed unnecessary sidebar collapse buttons to keep the layout sturdy and predictable. On mobile, a responsive slide-over drawer allows full navigation with one thumb. Furthermore, our navigation shell proactively prefetches sibling dashboard routes on mount, making tab transitions between Overview, Attendance, and Student lists feel completely instantaneous."

---

## Slide 11: Multi-Role Verification & Edge Route Protection
* **Presenter:** Sane Praneeth Kumar Reddy
* **Visual / Layout:** Flowchart illustrating Next.js Edge Middleware (`proxy.js`) inspecting incoming tokens and routing to role dashboards.
* **Slide Content:**
  * **Edge Proxy Middleware (`proxy.js`):**
    * Evaluates cryptographically signed JWT cookies before rendering any server components.
    * Enforces dedicated role entrances:
      * `/login` -> Reserved strictly for Student athletes.
      * `/coach` -> Dedicated Coach authentication.
      * `/admin` -> Master Administrator access with 7-digit code verification.
  * **Role Guards & Smart Redirection:**
    * Prevents unauthorized role traversal (e.g., student attempting to load `/dashboard/admin`).
    * Supports `?switch=true` and `?logout=true` query parameters to prevent users from getting trapped in auto-redirect loops.
* **Speaker Script (Praneeth):**
  > "Thank you, Althaf. I will now present the governance, analytics, and cloud infrastructure of Sportivo. To enforce strict security boundaries, we implemented our edge proxy middleware in `proxy.js`. Every incoming HTTP request is inspected at the network edge before hitting server components. If an unauthenticated user tries to access a coach dashboard, they are immediately redirected to `/coach`. Furthermore, we added explicit query parameter escape hatches like `?switch=true`, allowing users with multiple roles to switch accounts seamlessly."

---

## Slide 12: Interactive Dashboard Analytics & Visualization
* **Presenter:** Sane Praneeth Kumar Reddy
* **Visual / Layout:** Screenshot collage of the dynamic Recharts graphs: Attendance Bars, Skill Level Distribution, and Monthly Revenue Trends.
* **Slide Content:**
  * **Student Progress Tracking:**
    * Real-time calculation of overall attendance percentage:  
      $$\text{Rate} = \left(\frac{\text{Present Sessions}}{\text{Total Sessions}}\right) \times 100$$
    * Skill milestone badges reflecting coach reviews (`Beginner`, `Intermediate`, `Advanced`, `Professional`).
  * **Coach & Admin KPI Visualizations:**
    * **AttendanceBars:** Responsive dual-stack bar chart displaying present vs. absent athletes across the last 10 training sessions.
    * **ProgressDistributionChart:** Bar chart tracking squad skill distribution.
    * **RevenueChart:** Financial volume tracking for academy directors.
* **Speaker Script (Praneeth):**
  > "For analytics, Sportivo provides rich visual feedback powered by Recharts. Students can inspect their cumulative attendance percentage and skill milestone progress. For coaches and administrators, the system computes automated metrics: attendance bar charts showing daily athlete turnout, skill level breakdowns across squads, and revenue charts for academy operations. These charts render as responsive SVGs that dynamically resize across mobile and desktop displays."

---

## Slide 13: Cloud Deployment, Security & Production CI/CD
* **Presenter:** Sane Praneeth Kumar Reddy
* **Visual / Layout:** Deployment pipeline graphic: GitHub Repo (`main`) -> Vercel Edge Build -> Production URL (`sportivo-flax.vercel.app`).
* **Slide Content:**
  * **Production Deployment Details:**
    * **Hosting Platform:** Vercel Global Edge Network with automated git push deployment triggers.
    * **Database Cluster:** MongoDB Atlas M0 cluster with replica set auto-failover and IP whitelisting.
    * **Build Status:** Next.js 16.3.6 compilation verified across all 49 routes with zero syntax or runtime errors.
  * **Enterprise Security Standards:**
    * End-to-end HTTPS/TLS 1.3 encryption.
    * Server-side environment isolation (`AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, `MONGODB_URI`).
    * OWASP Top 10 compliance against NoSQL injection, XSS, and CSRF attacks.
* **Speaker Script (Praneeth):**
  > "Sportivo is fully deployed and production-verified. Our GitHub repository is integrated with Vercel's automated CI/CD pipeline. Every commit pushed to the `main` branch automatically triggers production builds. All 49 application routes compile with zero errors. Furthermore, environment variables including database connection strings and OAuth client secrets are strictly isolated on the server, ensuring enterprise-grade data protection."

---

## Slide 14: Live Links & Project Roadmap
* **Presenter:** Joint Wrap-up (All Presenters)
* **Visual / Layout:** QR codes and clean clickable cards linking to the Live Application, GitHub Repository, and documentation.
* **Slide Content:**
  * **Verified Live Links:**
    * **Production Web App:** `https://sportivo-flax.vercel.app`
    * **Student Google Sign-In:** `https://sportivo-flax.vercel.app/login`
    * **Coach Training Hub:** `https://sportivo-flax.vercel.app/coach`
    * **Admin Operations:** `https://sportivo-flax.vercel.app/admin`
    * **GitHub Repository:** `https://github.com/Althaf-1717/Sportivo.git`
  * **Future Roadmap:**
    * Native Push Notifications for session schedule updates.
    * Automated Razorpay QR Code generation for offline academy fee payments.
    * Video drill analysis powered by AI pose detection.
* **Speaker Script (Praneeth & Team):**
  > "Our project is completely live and publicly accessible right now at `sportivo-flax.vercel.app`. You can test our Google OAuth login directly with your own browser accounts. In our future development roadmap, we plan to introduce push notifications for drill schedules, instant UPI payments, and automated video-based posture analysis for athletes."

---

## Slide 15: Conclusion & Q&A
* **Presenter:** Joint Team
* **Visual / Layout:** Sportivo branded closing card with contact emails, GitHub profile link, and a prominent "Thank You / Questions?" title.
* **Slide Content:**
  * **Summary of Achievements:**
    * Delivered a full-stack, 3-role sports academy ecosystem on Next.js 16 and React 19.
    * Engineered a seamless Google OAuth 2.0 authentication flow with instant account detection.
    * Built an intuitive, zero-clutter attendance workspace with pure green/red toggle switches.
    * Achieved high Lighthouse performance and resilient cloud deployment on Vercel.
  * **Team Credits:**
    * Shaik Althaf (12406252)
    * Y. V. V. Tirumala Tanay (12407797)
    * Sane Praneeth Kumar Reddy (12404540)
  * **Open Floor for Q&A**
* **Speaker Script (Althaf):**
  > "To conclude: Sportivo demonstrates how modern web technologies can transform physical academy operations into a seamless, data-driven digital platform. We thank our course instructor for guidance throughout INT257. We are now open for any questions or a live walkthrough demonstration. Thank you!"

---
*End of Sportivo Presentation Slides & Script.*
