# Sportivo — Software Requirements Specification (SRS)

---

**Course Code:** INT257  
**Course Name:** Modern Web Application Development  
**Assessment:** Continuous Assessment 3 (Spring 2025)  
**Project Name:** Sportivo (Next-Generation Athletic Academy Management Platform)  

### Student Contributors

| S.No | Student Name | Registration Number | Role / Contribution |
| :---: | :--- | :---: | :--- |
| 1 | **Shaik Althaf** | **12406252** | UI/UX Engineering, Responsive Layouts, Attendance Workspace |
| 2 | **YELLABOYINA VEERA VENKATA TIRUMALA TANAY** | **12407797** | Full-Stack Architecture, Auth.js v5, Database & API Integration |
| 3 | **Sane Praneeth Kumar Reddy** | **12404540** | Dashboard Analytics, Role Verification & Cloud Deployment |

---

## Revision History

| Version | Date | Description | Author(s) |
| :---: | :---: | :--- | :--- |
| **1.0.0** | 10-Oct-2025 | Initial Project Concept, System Architecture & Requirement Elicitation | Group Team |
| **1.1.0** | 24-Oct-2025 | Database Schemas (Mongoose), Role-Based Dashboard Structure | Group Team |
| **1.2.0** | 06-Nov-2025 | Glassmorphism UI Polish, Attendance Dropdown & Red/Green Toggle System | Shaik Althaf & Team |
| **1.3.0** | 15-Nov-2025 | Google Cloud Console OAuth 2.0 Integration & Vercel Production Readiness | Shaik Althaf & Team |

---

## Table of Contents

1. [Introduction](#1-introduction)  
   1.1 [Purpose](#11-purpose)  
   1.2 [Scope](#12-scope)  
   1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)  
   1.4 [References](#14-references)  
   1.5 [Overview](#15-overview)  
2. [General Description](#2-general-description)  
   2.1 [Product Perspective](#21-product-perspective)  
   2.2 [Product Functions](#22-product-functions)  
   2.3 [User Characteristics](#23-user-characteristics)  
   2.4 [General Constraints](#24-general-constraints)  
   2.5 [Assumptions and Dependencies](#25-assumptions-and-dependencies)  
3. [Specific Requirements](#3-specific-requirements)  
   3.1 [External Interface Requirements](#31-external-interface-requirements)  
       3.1.1 [User Interfaces](#311-user-interfaces)  
       3.1.2 [Hardware Interfaces](#312-hardware-interfaces)  
       3.1.3 [Software Interfaces](#313-software-interfaces)  
       3.1.4 [Communications Interfaces](#314-communications-interfaces)  
   3.2 [Functional Requirements](#32-functional-requirements)  
       3.2.1 [Authentication & Multi-Role Identity Access](#321-authentication--multi-role-identity-access)  
       3.2.2 [Interactive Attendance Management System](#322-interactive-attendance-management-system)  
       3.2.3 [Sports Program Enrollment & Coach Roster Management](#323-sports-program-enrollment--coach-roster-management)  
       3.2.4 [Athlete Performance & Progress Tracking](#324-athlete-performance--progress-tracking)  
       3.2.5 [Membership Subscriptions & Payment Workflows](#325-membership-subscriptions--payment-workflows)  
   3.5 [Non-Functional Requirements](#35-non-functional-requirements)  
       3.5.1 [Performance](#351-performance)  
       3.5.2 [Reliability](#352-reliability)  
       3.5.3 [Availability](#353-availability)  
       3.5.4 [Security](#354-security)  
       3.5.5 [Maintainability](#355-maintainability)  
       3.5.6 [Portability](#356-portability)  
   3.7 [Design Constraints](#37-design-constraints)  
   3.9 [Other Requirements](#39-other-requirements)  
4. [Analysis Models](#4-analysis-models)  
   4.1 [Data Flow Diagrams (DFD)](#41-data-flow-diagrams-dfd)  
       4.1.1 [DFD Level 0 (Context Diagram)](#411-dfd-level-0-context-diagram)  
       4.1.2 [DFD Level 1 (System Operations)](#412-dfd-level-1-system-operations)  
5. [GitHub Repository Link](#5-github-repository-link)  
6. [Deployed Production Link](#6-deployed-production-link)  
7. [Project Video Link](#7-project-video-link)  
A. [Appendices](#a-appendices)  
   A.1 [Appendix 1: System Tech Stack Summary](#a1-appendix-1-system-tech-stack-summary)  
   A.2 [Appendix 2: Route Hierarchy & API Inventory](#a2-appendix-2-route-hierarchy--api-inventory)  

---

# 1. Introduction

### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) document is to provide a complete, rigorous, and verifiable technical description of the **Sportivo Athletic Academy Platform**. This document defines external interface requirements, system behaviors, functional rules, data flow characteristics, non-functional quality attributes, and architectural constraints. It is intended for software engineers, academic evaluators, system administrators, and quality assurance testers responsible for auditing, maintaining, or extending the application.

### 1.2 Scope
**Sportivo** is a production-grade, cloud-native full-stack web application engineered using **Next.js (App Router)**, **React**, **Tailwind CSS**, and **MongoDB Atlas**. It unifies sports academy management into three role-isolated portals:

1. **Student Portal:** Allows enrolled athletes to explore certified coaching squads, purchase sports membership plans, monitor training attendance records, inspect coach feedback drills, and follow progressive skill growth.
2. **Coach Portal:** Enables academy coaches to plan sessions, log daily drill workouts, expand collapsible athlete rosters upon confirmation, submit single-click attendance via visual green/red toggle switches, and evaluate athlete progression.
3. **Master Administrator Portal:** Provides academy authorities with centralized governance, enrollment verification, financial transaction auditing, attendance oversight, and athlete-to-coach allocation.

The software eliminates paper-based attendance registers, fragmented communication channels, and opaque subscription tracking through real-time, responsive web experiences.

### 1.3 Definitions, Acronyms, and Abbreviations

* **SRS:** Software Requirements Specification
* **API:** Application Programming Interface
* **OAuth:** Open Authorization standard (specifically Google OAuth 2.0 / OIDC)
* **JWT:** JSON Web Token for stateless session state maintenance
* **SSR / SSG:** Server-Side Rendering / Static Site Generation
* **RSC:** React Server Components (Next.js architecture)
* **CRUD:** Create, Read, Update, Delete
* **DFD:** Data Flow Diagram
* **Mongoose ODM:** Object Data Modeling library for MongoDB and Node.js
* **RBAC:** Role-Based Access Control

### 1.4 References
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.
2. Next.js 16 Documentation: Vercel App Router Architecture & Server Actions.
3. OAuth 2.0 Authorization Framework: RFC 6749 (IETF).
4. MongoDB Atlas Developer Documentation: Multi-tenant replica set management.
5. React 19 Specifications: Server & Client component paradigms.

### 1.5 Overview
The remainder of this document is organized into five structured sections:
* **Section 2 (General Description)** provides product context, high-level functions, user profiles, operating constraints, and system assumptions.
* **Section 3 (Specific Requirements)** formalizes precise functional and non-functional specifications, interface boundaries, and data validations.
* **Section 4 (Analysis Models)** illustrates multi-level Data Flow Diagrams (DFD Level 0 and Level 1).
* **Sections 5, 6, & 7** provide verified links to the project repository, the live production deployment on Vercel, and the project demonstration video.
* **Section A (Appendices)** details the underlying technology ecosystem and route inventory.

---

# 2. General Description

### 2.1 Product Perspective
Sportivo operates as a multi-tier, self-contained cloud platform hosted on Vercel's global edge infrastructure with MongoDB Atlas powering the persistent data store. Rather than relying on disparate third-party desktop utilities, Sportivo functions as a responsive progressive web application operable across mobile browsers, tablets, laptops, and ultra-wide desktop monitors.

```
+-------------------------------------------------------------------+
|                        Client Layer                               |
|        (Mobile Web, Desktop Browser, Tablet Workstations)         |
+-------------------------------------------------------------------+
                                  |
                           HTTPS / TLS 1.3
                                  v
+-------------------------------------------------------------------+
|               Next.js Edge Proxy / Middleware                     |
|           (Role Isolation, Route Guards, JWT Verification)        |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     Server Component Core                         |
|   App Router / RSC | API Route Handlers | Auth.js v5 Handlers     |
+-------------------------------------------------------------------+
             |                                          |
             v                                          v
+--------------------------+              +-------------------------+
|     Google Cloud API     |              |     MongoDB Atlas       |
|  (OAuth 2.0 Auth Server) |              |  (Mongoose Schemas/ODM) |
+--------------------------+              +-------------------------+
```

### 2.2 Product Functions
* **Authentication & Role Isolation:** Secure identity verification supporting Google Cloud Console OAuth 2.0 (with native browser account picker prompt) and encrypted credential hashing (bcryptjs).
* **Dynamic Student Enrollment:** Athlete sign-up, sports discipline selection (Cricket, Football, Basketball, etc.), coach assignment, and tier-based membership activation.
* **Interactive Attendance Workspace:** Work drill description logging, session verification trigger (`OK` button dropdown), and dual-state visual status toggles (Green = Present / Red = Absent).
* **Multi-Portal Dashboards:** Distinct dashboards tailored with relevant KPI metrics, schedule timelines, financial audits, and interactive data visualization charts.
* **Administrative Governance:** System-wide user roster directory, academy financial volume reporting, and student-coach reassignments.

### 2.3 User Characteristics
* **Student Athletes (Primary Users):** High-frequency mobile and desktop users seeking streamlined onboarding, self-service schedule views, and attendance percentages without technical complexity.
* **Coaches (Operational Users):** Field professionals requiring ultra-fast, single-handed attendance inputs on pitch tablets or mobile phones, requiring zero layout shift and instantaneous feedback.
* **Academy Administrators (Supervisory Users):** Office staff managing operational health, membership expirations, and regulatory compliance via dense data tables and analytics dashboards.

### 2.4 General Constraints
1. **Runtime Framework:** Built strictly upon Next.js App Router; no legacy Pages Router patterns.
2. **Security & Sandbox Isolation:** Session secrets and MongoDB credentials must never be exposed client-side (`process.env` server isolation).
3. **Typography Standard:** Enforces a clean, modern aesthetic utilizing system font families (`Poppins`, `Inter`, `Arial`) with strict weight hierarchies.
4. **Browser Compatibility:** Full cross-browser support across modern Chromium (Chrome, Edge, Brave), WebKit (Safari iOS/macOS), and Gecko (Firefox).

### 2.5 Assumptions and Dependencies
* Target execution environment supports Node.js 18.x or 20.x runtime.
* Network access to MongoDB Atlas cluster `cluster0.7m83hwk.mongodb.net` is active.
* Valid Google Cloud Console credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) are provisioned and authorized for production origins.

---

# 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces
* **Visual Language:** Glassmorphism and modern clean card design incorporating warm orange accents (`#EA580C`), deep navy typography (`#0F172A`), and cream/off-white background canvases (`#FFFCF9`).
* **Responsive Breakpoints:** Fully fluid layouts tailored for 320px (mobile), 768px (tablet), 1024px (laptop), and 1440px+ (desktop workstations).
* **Error Resilience:** Global error boundaries (`app/dashboard/error.js`) equipped with instant session-clearing escape hatches (`/api/auth/clear`) and non-blocking recovery actions.

#### 3.1.2 Hardware Interfaces
Sportivo does not require proprietary physical hardware sensors. It interfaces with client touchscreens, trackpads, and keyboards via standard browser DOM events.

#### 3.1.3 Software Interfaces
* **Database Interface:** Mongoose 8.x ODM communicating over encrypted TCP connections to MongoDB Atlas.
* **Identity Provider:** Google Identity Services (OpenID Connect / OAuth 2.0).
* **Hosting Platform:** Vercel serverless functions with automatic HTTPS edge termination and Brotli/Gzip compression.

#### 3.1.4 Communications Interfaces
* All communication is strictly encrypted using **HTTPS** (TLS 1.3).
* RESTful JSON endpoints serve client-server communications (`/api/attendance`, `/api/auth/*`, `/api/enrollments`, `/api/sports`).

---

### 3.2 Functional Requirements

#### 3.2.1 Authentication & Multi-Role Identity Access
* **FR-1.1:** The system shall authenticate users via two secure providers: Google OAuth 2.0 and Credentials (email + password).
* **FR-1.2:** The Google OAuth provider shall explicitly invoke `prompt: "select_account"`, enforcing the browser to present all logged-in Google accounts.
* **FR-1.3:** First-time Google authentication shall automatically initialize a new Student record in MongoDB and allocate an auto-incremented `studentId` starting from `10001`.
* **FR-1.4:** Dedicated entrance routes shall enforce strict role boundaries: `/login` (Student Portal), `/coach` (Coach Portal), and `/admin` (Administrator Portal with Master Access Code validation).
* **FR-1.5:** Middleware (`proxy.js`) shall intercept unauthorized route visits and dynamically forward users to their respective authorized dashboard.

#### 3.2.2 Interactive Attendance Management System
* **FR-2.1:** The Attendance Workspace shall hide the assigned athlete roster by default upon opening to optimize page rendering and cognitive load.
* **FR-2.2:** When the coach or admin inputs training drill specifications (`Work`) and clicks the **`OK`** button, the assigned student list shall smoothly expand and drop down with a fade-in animation.
* **FR-2.3:** Re-clicking the `OK` button shall act as an interactive toggle, allowing the instructor to collapse or expand the athlete list on demand.
* **FR-2.4:** Under the `Mark Attendance` column, each student row shall feature an accessible, text-free toggle switch:
  * **ON (Present):** Rendered in bright emerald green (`bg-emerald-500`) with the toggle knob positioned right.
  * **OFF (Absent):** Rendered in rich crimson red (`bg-red-500`) with the toggle knob positioned left.
* **FR-2.5:** Coaches shall have an optional remarks field for each athlete to note drill performance before submitting the batch attendance record to `/api/attendance`.

#### 3.2.3 Sports Program Enrollment & Coach Roster Management
* **FR-3.1:** Students can select specific athletic programs (Cricket, Football, Basketball, Tennis, etc.) and view coach bios, specialties, and schedules.
* **FR-3.2:** Active enrollments shall link the athlete's account directly to their chosen coach's dashboard roster.
* **FR-3.3:** The system shall prevent overlapping active enrollments for identical sport categories.

#### 3.2.4 Athlete Performance & Progress Tracking
* **FR-4.1:** Coaches can evaluate assigned students across technical drills, tactical awareness, and physical conditioning.
* **FR-4.2:** Cumulative progress metrics shall compute attendance percentage rates:  
  $$\text{Attendance Rate} = \left( \frac{\text{Sessions Attended}}{\text{Total Sessions Recorded}} \right) \times 100$$
* **FR-4.3:** Students shall view their progress visualized through responsive charts and milestone badges.

#### 3.2.5 Membership Subscriptions & Payment Workflows
* **FR-5.1:** Tiered membership options (Basic, Standard, Premium) detail price, session frequency, and facility privileges.
* **FR-5.2:** Secure payment transaction logs record order references, transaction timestamps, payment statuses (`successful`, `pending`, `failed`), and auto-generate receipts.

---

### 3.5 Non-Functional Requirements

#### 3.5.1 Performance
* **First Contentful Paint (FCP):** Under 1.2 seconds over 4G mobile connections.
* **Client-Side Transitions:** Zero layout shift (CLS < 0.05) and instant sub-100ms client route transitions via prefetching.
* **Database Optimization:** Indexed compound queries on `{ student: 1, date: 1 }` and `{ coach: 1, status: 1 }` ensuring query executions complete in under 50ms.

#### 3.5.2 Reliability
* **Fault Tolerance:** Server Components implement comprehensive `try/catch` fallbacks, guaranteeing that transient database connection latency never crashes parent page views.
* **Mean Time Between Failures (MTBF):** High availability supported by multi-region Vercel serverless edge nodes.

#### 3.5.3 Availability
* Target 99.9% uptime powered by serverless Vercel infrastructure and MongoDB Atlas automated replica set failovers.

#### 3.5.4 Security
* **Password Encryption:** Passwords hashed with `bcryptjs` using a minimum work factor of 12 rounds.
* **Session Tokens:** Stateless, cryptographically signed HTTP-only JWTs protected with strict `SameSite` and `Secure` attributes in production.
* **Injection Defense:** Mongoose schema sanitization and parameter binding prevents NoSQL injection and Cross-Site Scripting (XSS).

#### 3.5.5 Maintainability
* Modular Next.js component directory structure separating presentation (`components/`), data access (`lib/`), and business domain models (`models/`).

#### 3.5.6 Portability
* The software is 100% cloud-portable; containerizable via Docker or directly deployable on platforms supporting Node.js (Vercel, AWS Amplify, Render, or self-hosted Linux VPS).

### 3.7 Design Constraints
* Built strictly using modern ES6+ JavaScript modules.
* Styling managed exclusively via Tailwind CSS utility classes and custom CSS variables.

### 3.9 Other Requirements
* Adheres to Web Content Accessibility Guidelines (WCAG 2.1 Level AA) for color contrast ratios and keyboard navigation.

---

# 4. Analysis Models

### 4.1 Data Flow Diagrams (DFD)

#### 4.1.1 DFD Level 0 (Context Diagram)
The Level 0 context diagram demonstrates the boundary of the Sportivo application and how distinct external entities interact with the centralized system.

```
       +--------------------+
       |   Student Athlete  |
       +--------------------+
         |                ^
         | (1) Sign-up    | (2) View Profile, Attendance,
         |     Enrollment |     & Progress Charts
         v                |
+-------------------------------------------------------+
|                                                       |
|             SPORTIVO PLATFORM CORE                    |
|             (Level 0 Context System)                  |
|                                                       |
+-------------------------------------------------------+
         ^                |
         | (3) Submit     | (4) View Assigned Athletes
         |     Attendance |     & Drill Workspaces
         |     & Drills   |
       +--------------------+
       |   Academy Coach    |
       +--------------------+
```

#### 4.1.2 DFD Level 1 (System Operations)
The Level 1 DFD decomposes the central system into distinct sub-processes and data stores:

```
[User / Athlete] 
      |
      v
(1.0 Authentication Engine) <=========> [D1: Users Store (MongoDB)]
      |                                        |
      | (Verified JWT Token)                   |
      v                                        v
(2.0 Enrollment Manager)    <=========> [D2: Enrollments Store]
      |                                        |
      v                                        v
(3.0 Attendance Workspace)  <=========> [D3: Attendance Records]
      ^                                        |
      | (Mark Present/Absent)                  v
[Coach / Instructor]                    (4.0 Analytics & Reporting)
                                               |
                                               v
                                        [Student / Admin Dashboards]
```

---

# 5. GitHub Repository Link

The complete version-controlled source code, commit history, and deployment configurations are accessible at:

* **GitHub Repository URL:**  
  [https://github.com/Althaf-1717/Sportivo.git](https://github.com/Althaf-1717/Sportivo.git)

* **Primary Developer Profile:**  
  [https://github.com/Althaf-1717](https://github.com/Althaf-1717)

---

# 6. Deployed Production Link

The application is deployed live on high-availability edge infrastructure:

* **Live Web Application URL:**  
  [https://sportivo-flax.vercel.app](https://sportivo-flax.vercel.app)

* **Key Direct Live Portals:**
  * **Student Sign-In / Google Auth:** [https://sportivo-flax.vercel.app/login](https://sportivo-flax.vercel.app/login)
  * **Student Registration:** [https://sportivo-flax.vercel.app/register](https://sportivo-flax.vercel.app/register)
  * **Dedicated Coach Portal:** [https://sportivo-flax.vercel.app/coach](https://sportivo-flax.vercel.app/coach)
  * **Dedicated Master Admin Portal:** [https://sportivo-flax.vercel.app/admin](https://sportivo-flax.vercel.app/admin)
  * **Session Clear Endpoint:** [https://sportivo-flax.vercel.app/api/auth/clear](https://sportivo-flax.vercel.app/api/auth/clear)

---

# 7. Project Video Link

* **Demonstration Video URL:**  
  *(Link to be inserted — space reserved for video presentation URL)*  
  `[ __________________________________________________ ]`

---

# A. Appendices

### A.1 Appendix 1: System Tech Stack Summary

| Layer | Technology | Function / Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.6 (App Router) | Server-Side Rendering, API routes, Server Actions |
| **Frontend Library**| React 19 | Declarative reactive user interface components |
| **Styling** | Tailwind CSS 3.4 & Lucide Icons | Utility-first CSS architecture and modern vector iconography |
| **Authentication** | Auth.js v5 (NextAuth.js) | Google Cloud Console OAuth 2.0 & bcrypt credentials |
| **Database** | MongoDB Atlas & Mongoose 8.x | Multi-tenant cloud document database and schema validation |
| **Charts** | Recharts | Responsive SVG charts for attendance and skill analytics |
| **Hosting & CI/CD** | Vercel Edge Network | Automated git-triggered builds and serverless execution |

### A.2 Appendix 2: Route Hierarchy & API Inventory

```
/                                   -> Academy Marketing Landing Page
/about                              -> Academy Heritage & Coaching Philosophy
/sports                             -> Sports Discipline Catalog
/sports/[sportId]                   -> Individual Sport Overview & Squads
/coaches                            -> Certified Academy Coaches Directory
/coaches/[coachId]                  -> Coach Profile, Experience & Philosophy
/membership                         -> Membership Tier Packages
/login                              -> Student Portal Sign In (with Google OAuth)
/register                           -> Student Registration (with Google OAuth)
/coach                              -> Dedicated Coach Sign In
/admin                              -> Dedicated Master Admin Sign In (with Code)
/dashboard/student                  -> Student Personal Training Dashboard
/dashboard/coach                    -> Coach Training Hub & Attendance Launchpad
/dashboard/coach/attendance         -> Interactive Dropdown & Toggle Attendance
/dashboard/coach/students           -> Coach Assigned Athlete Directory
/dashboard/admin                    -> Master Academy Administration & Auditing
/api/auth/[...nextauth]             -> NextAuth OAuth & Session Endpoints
/api/attendance                     -> Attendance Query & Mutation Handler
/api/enrollments                    -> Student Academy Enrollment Manager
/api/sports                         -> Sports Disciplines REST API
/api/coaches                        -> Academy Coaches REST API
```

---
*End of Software Requirements Specification (SRS) Document.*
