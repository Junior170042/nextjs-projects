# PostOne App Blog 🚀

PostOne is a modern, high-performance blog platform built with the latest web technologies. It combines powerful backend services with a stunning, interactive user interface featuring 3D elements and smooth animations.

## 🛠️ Tech Stack

This project leverages a cutting-edge stack for maximum performance and developer experience:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Database**: [Neon](https://neon.tech/) (Serverless PostgreSQL)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics**: [Three.js](https://threejs.org/) ([React Three Fiber](https://r3f.docs.pmnd.rs/) & [Drei](https://github.com/pmndrs/drei))
- **Auth Utils**: [Jose](https://github.com/panva/jose) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)

## 🔐 Custom Authentication System

The application features a **robust, custom-built authentication system** designed for security and ease of use. Instead of relying on generic third-party providers, I've implemented a bespoke solution:

- **Email-Based Verification**: Secure login flow using [Nodemailer](https://nodemailer.com/) to send verification codes directly to users' emails.
- **In-Memory Sessions**: For maximum security, the user session and Access Token are kept strictly in **memory**. No sensitive session data is stored in `localStorage` or `sessionStorage`, effectively neutralizing most local data theft risks.
- **Secure Refresh Flow**: Implemented a robust refresh token strategy. The **Refresh Token** is stored safely in an **HttpOnly, Secure, and SameSite** cookie, making it inaccessible to client-side scripts (XSS protection).
- **JWT Security**: Multi-layered token management using `jose` for secure session handling and `jsonwebtoken` for verification tokens.
- **Password Protection**: Industry-standard hashing using `bcrypt` to ensures user credentials remain protected.

## 🏗️ "Orderly" Architecture

One of the project's standout features is its **meticulously organized component architecture**. Unlike many Next.js projects that clutter the `app` directory, PostOne follows a strict separation of concerns:

- **`app/pages`**: A dedicated directory for page-level logic. This keeps the Next.js `app` folder focused purely on routing and layouts, while the business logic and UI composition live in a clean, manageable space.
- **`app/api/services`**: Logic is further decoupled into service layers, making the codebase highly testable and maintainable.
- **Ordered Components**: Components are categorized logically (e.g., `small-components`, `loadings`, `auth`), ensuring that every piece of the UI has its rightful place.

## ✨ Key Features

- **Interactive 3D Elements**: Engaging hero sections and UI components powered by Three.js.
- **Dark/Light Mode**: Full theme support with smooth transitions using `next-themes`.
- **Responsive Design**: Mobile-first approach ensuring a premium experience on all devices.
- **Admin Dashboard**: Specialized interface for content management (Role-based access).
- **Social Interaction**: Rich post reactions and commenting system.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Neon DB URI, JWT secrets, and Email credentials.

4. **Run Database Migrations**:
   ```bash
   npm run db:push
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

Built with ❤️ by [ST Verty Vernard](https://github.com/Junior170042)
