Hello , I am Aryan Choudhary

PosturePro – AI-Powered Posture Detection App

PosturePro is a full-stack web application that allows users to upload videos or use their webcam to detect and track poor posture patterns using AI. The app analyzes user pose using [MediaPipe](https://google.github.io/mediapipe/) and stores the results (video + pose flags) in a database, providing personalized posture insights via a visual dashboard.

# Tech Stack

**Frontend:**
- [Next.js 14
- [React]
- [Tailwind CSS]
- [MediaPipe Tasks-Vision]– pose detection
- [Recharts] – visualizing posture insights
- [React Hook Form] – form handling
- [React Hot Toast] – notifications

**Backend:**
- [NextAuth.js] – Google OAuth login
- [Prisma ORM] – type-safe DB access
- [PostgreSQL] – relational DB (can also use SQLite locally)
- [Cloudinary] – video storage

---
## Deployed Link

- https://posturepro-amber.vercel.app

## Deployed on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
