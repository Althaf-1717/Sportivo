# Sportivo

Sportivo is a sports academy platform for cricket, football, and basketball. Students can find a programme, select a coach and membership, make a verified Razorpay payment, and follow attendance and skill development. Coaches manage their assigned athletes, while administrators manage academy accounts and operations.

The project is built as a full-stack Next.js App Router application. Next.js owns the public website, authenticated dashboards, server-rendered pages, route handlers, and the request proxy. There is no separate Express server.

## Features

- Responsive public website with sports, coach, membership, about, and contact pages.
- Student, coach, and admin accounts with separate navigation and access rules.
- Email and password authentication, password hashing, and optional Google OAuth.
- Student enrolment flow: sport → coach → membership → review → Razorpay checkout.
- Razorpay server orders and HMAC signature verification before a membership activates.
- Attendance tracking with one record per student, enrolment, and session date.
- Coach progress reviews with fitness, technical, and performance scores from 0 to 100.
- Student attendance, coach notes, progress history, membership, and payment views.
- Admin account management, sports, coach profiles, memberships, enrolments, attendance, progress, and payment records.
- Dashboard charts for revenue, sport mix, attendance, and player progress.
- In-app notifications for enrolment, payment, attendance, and progress updates.
- Contact enquiries stored in MongoDB for follow-up.
- Clearly labelled sample testimonials for the prototype; replace them with approved member stories before a public launch.
- Accessible labels and focus states, responsive tables and forms, empty states, loading UI, and error UI.

## Roles

| Role | Main capabilities |
| --- | --- |
| Student | Browse programmes, enrol, manage profile, view attendance, progress, and payment history |
| Coach | View assigned students, mark attendance, and write progress reviews |
| Admin | Manage users, coaches, sports, membership plans, and review academy records |

Public registration always creates a student account. Coach and admin access is provisioned by an administrator. The submitted role is never trusted by registration or API handlers.

## Technology

- Next.js 16 App Router and React 19, JavaScript only
- Tailwind CSS 4 and custom CSS tokens
- MongoDB and Mongoose
- Auth.js / NextAuth credentials and Google providers
- Razorpay Orders API and Checkout (use test keys in development)
- Recharts and Lucide React
- Zod server-side validation and bcryptjs password hashing

## Run locally

Requirements: Node.js 20.19 or newer, npm, and a MongoDB database. MongoDB Atlas is the easiest option for payment verification transactions.

1. Install packages:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the values described below.

3. Add demo data to your development database:

   ```bash
   npm run seed
   ```

4. Start Next.js:

   ```bash
   npm run dev
   ```

5. Visit [http://localhost:3000](http://localhost:3000).

The public pages can be browsed before credentials are configured. Authentication and private database features require MongoDB. Payment checkout also requires Razorpay test keys. Do not use the seed script in production; it intentionally exits when `NODE_ENV=production`.

### Demo accounts

`npm run seed` creates the following local-only accounts. All six seeded coach accounts use the coach password shown below.

| Role | Email | Development password |
| --- | --- | --- |
| Admin | `admin@sportivo.demo` | `Admin@Sportivo2026` |
| Student | `student@sportivo.demo` | `Student@Sportivo2026` |
| Coach | `arjun-menon@sportivo.demo` | `Coach@Sportivo2026` |
| Coach | `kavya-rao@sportivo.demo` | `Coach@Sportivo2026` |
| Coach | `dev-sharma@sportivo.demo` | `Coach@Sportivo2026` |
| Coach | `nisha-fernandes@sportivo.demo` | `Coach@Sportivo2026` |
| Coach | `rahul-nair@sportivo.demo` | `Coach@Sportivo2026` |
| Coach | `meera-kapoor@sportivo.demo` | `Coach@Sportivo2026` |

These passwords exist only for local development and are not production credentials. Override them with `DEMO_ADMIN_PASSWORD`, `DEMO_STUDENT_PASSWORD`, and `DEMO_COACH_PASSWORD` in `.env.local` before seeding if desired. The seeded student membership/payment, attendance, and progress are clearly synthetic data for dashboard demonstrations; the sample payment is **not** a real Razorpay transaction.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | Long random secret for Auth.js sessions and the route proxy |
| `AUTH_URL` | Local application URL, usually `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID; omit both Google values to hide the Google button |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `RAZORPAY_KEY_ID` | Server-side Razorpay key ID used to create orders |
| `RAZORPAY_KEY_SECRET` | Server-only secret used for payment-signature verification |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Matching public test key used by Razorpay Checkout in the browser |
| `DEMO_ADMIN_PASSWORD` | Optional local seed password override |
| `DEMO_STUDENT_PASSWORD` | Optional local seed password override |
| `DEMO_COACH_PASSWORD` | Optional local seed password override |

Never commit `.env.local` or real API keys. The public Razorpay key ID may be sent to Checkout; the secret must remain server-only. For Razorpay, create a test-mode key pair and set both key ID variables to the same test key ID.

### Google OAuth setup

1. Create a Google OAuth client in Google Cloud Console. The provider must return a Google-verified email address; the app uses it to link sign-in to an already provisioned account and preserve its role.
2. Add `http://localhost:3000/api/auth/callback/google` as an authorised redirect URI.
3. Put the client ID and secret in `.env.local`, then restart Next.js.
4. Google sign-in creates student accounts by default. Existing provisioned coach/admin accounts keep their database role.

### Razorpay test setup

1. Create a Razorpay test-mode key pair.
2. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` in `.env.local`.
3. Complete a test checkout. The application creates the order on the server and creates the enrolment only after the server verifies Razorpay’s HMAC signature.
4. Payment verification uses a MongoDB transaction, so use a MongoDB replica set or Atlas cluster.

## Architecture and folders

```text
app/                     App Router public pages, dashboards, errors, and Route Handlers
app/api/                 Auth, sports, coaches, students, membership, attendance, progress, payments
components/              Shared public UI, forms, dashboard charts, and role-specific workspaces
data/catalog.js          Public fallback catalogue used before MongoDB is configured
lib/                     MongoDB connections, authentication helpers, validation, and queries
models/                  Mongoose schemas and indexes
public/images/           Optimised local hero photography
proxy.js                 Next.js 16 request proxy for dashboard redirects and role checks
scripts/seed.js          Local development catalogue, demo accounts, and sample training records
```

### Database models

- `User`: account identity, role, profile fields, password hash, and active state.
- `Sport`: slug, public description, training focus, image, and active state.
- `Coach`: coach profile and assigned sports, linked to a `User`.
- `MembershipPlan`: sport, duration, price, features, and active state.
- `Enrollment`: student, sport, coach, plan, verified payment, term, and status.
- `Attendance`: student, enrolment, coach, sport, date, present/absent status, and note. A compound unique index prevents duplicate student/date entries for one enrolment.
- `Progress`: skill level, three scores, derived overall progress, coach remarks, and training notes.
- `Payment`: Razorpay order/payment identifiers, signature, amount, currency, and status.
- `Notification`: per-user academy events and read state.
- `ContactInquiry`: validated contact messages for academy follow-up.

## API documentation

All endpoints are Next.js Route Handlers. Private endpoints check the Auth.js session and role on the server.

| Method | Endpoint | Access / purpose |
| --- | --- | --- |
| `GET` / `POST` | `/api/auth/[...nextauth]` | Auth.js credentials and Google callbacks |
| `POST` | `/api/auth/register` | Create a student account; role is fixed server-side |
| `GET` / `POST` | `/api/sports` | List active sports; admin creates sports |
| `GET` / `PUT` / `DELETE` | `/api/sports/:sportId` | Read or administer a sport; delete deactivates it |
| `GET` / `POST` | `/api/coaches` | List coaches; admin provisions a coach and assigns sports |
| `PUT` / `DELETE` | `/api/coaches/:coachId` | Update or deactivate coach access |
| `GET` / `POST` | `/api/membership` | List plans; admin creates a plan |
| `GET` / `PUT` / `DELETE` | `/api/membership/:planId` | Read or administer a plan |
| `GET` | `/api/students` | Student sees self; coaches see assigned students; admin sees all |
| `GET` / `PATCH` | `/api/students/:studentId` | View or update an authorised student record |
| `GET` | `/api/enrollments` | Role-scoped enrolment list |
| `GET` / `POST` | `/api/attendance` | Role-scoped attendance list; coach/admin upsert a session record |
| `PUT` | `/api/attendance/:attendanceId` | Coach/admin update an existing attendance record |
| `GET` / `POST` | `/api/progress` | Role-scoped reviews; coach/admin create a review |
| `PUT` | `/api/progress/:progressId` | Coach/admin update a review; overall score is recalculated |
| `POST` | `/api/payments/create-order` | Student requests an order for a server-validated plan |
| `POST` | `/api/payments/verify` | Student payment signature verification and enrolment activation |
| `POST` | `/api/payments/fail` | Student marks their own pending Razorpay order as failed after Checkout reports a failure |
| `GET` | `/api/payments` | Student sees own records; admin sees all |
| `GET` / `PATCH` | `/api/notifications` | Read and mark academy notifications |
| `POST` | `/api/contact` | Store a validated public enquiry |
| `GET` / `PATCH` | `/api/admin/users` | Admin searches accounts and activates/deactivates access |
| `GET` / `PATCH` | `/api/profile` | Read or update the signed-in user’s profile |

## Next.js Concepts Demonstrated

| Concept | Where it appears |
| --- | --- |
| App Router | `app/` route tree; public, dashboard, and API endpoints share one Next.js project |
| Server Components | Public catalogue pages, role dashboards, and database-driven records are server-rendered by default |
| Client Components | Auth/enrolment/profile/attendance/progress forms, navigation, notifications, searchable tables, and Recharts |
| Layouts | `app/layout.js`, plus independent student, coach, and admin dashboard layouts |
| Nested routes | `/dashboard/student/attendance`, `/dashboard/coach/progress`, `/dashboard/admin/payments`, and related pages |
| Dynamic routes | `/sports/[sportId]`, `/coaches/[coachId]`, `/membership/[planId]`, `/students/[studentId]` |
| Route Handlers | `app/api/**/route.js` provides the backend; there is no Express server |
| Request proxy | Root `proxy.js` redirects signed-in users to a dashboard and protects dashboard routes from anonymous requests. Each server layout and API handler checks the account’s current database role, so a stale JWT role cannot grant access. Next.js 16 renamed the prior Middleware convention to Proxy. |
| Authentication | Auth.js credentials provider, bcrypt password hashes, optional Google OAuth, JWT sessions, `currentUser()` server helper |
| Server-side data fetching | Mongoose queries power dashboards, student records, and academy analytics |
| Client-side data fetching | Forms call same-origin Route Handlers for account, attendance, progress, notification, and payment actions |
| SSR | Authenticated dashboards export `dynamic = "force-dynamic"` and use the current session |
| SSG / ISR | Public catalogue pages use `generateStaticParams()` for details and `revalidate = 300` for catalogue pages |
| Revalidation | Verified payments call `revalidatePath()` for affected dashboards |
| Loading UI | Root, dashboard, sports, and coaches `loading.js` files |
| Error UI | Root `app/error.js` and dashboard `app/dashboard/error.js` have retry actions |
| Not Found | `app/not-found.js`; invalid sport, coach, membership, and student records call `notFound()` |
| Environment variables | `.env.example`, server-only MongoDB/Auth/Razorpay secrets, and explicit public Razorpay key ID |
| Image optimisation | `next/image` is used for the local hero and approved Unsplash images for sport cards |
| Metadata | Root metadata/Open Graph plus page-specific and dynamic sport/coach/membership metadata |
| Responsive rendering | Tailwind breakpoints, mobile navigation, compact dashboard menu, responsive charts and overflow-safe tables |

## Design direction

Poppins is the primary typeface with Arial as the fallback. The visual system uses white, navy, blue, light gray, and restrained orange accents. It avoids gradients, gradient text, neon colours, and excessive motion. `prefers-reduced-motion` is respected.

## Screenshots

Add screenshots of the landing page, student dashboard, coach attendance workspace, and admin overview here after running the project with seeded data.

## Future improvements

- Email or SMS reminders for upcoming sessions and membership expiry.
- Calendar scheduling, waitlists, and facility availability.
- Admin audit trail and exportable attendance/payment reports.
- Accessibility review with assistive technology and broader browser testing.
- Connect the contact enquiry queue to academy email or a support workflow.
