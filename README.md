# Paws & Tails E-commerce

Paws & Tails is an e-commerce platform built with Next.js, focused on selling pet products. It features a full admin dashboard, a smooth checkout experience, and customer tools like order tracking, reviews, and filtering. It uses a modern stack including Prisma, Tailwind CSS, Stripe, and PostgreSQL.

## Technologies

- **Next.js 15**: React framework for routing, server components, and rendering
- **Tailwind CSS**: Utility-first CSS
- **Shadcn UI**: Styled, accessible components using Radix and Tailwind
- **Prisma**: Type-safe ORM for working with the database
- **Neon (PostgreSQL)**: Scalable cloud PostgreSQL database
- **Uploadthing**: File upload handler for client-server transfer
- **Lucide-react**: Icon library
- **React Hook Form**: Lightweight form state and validation management
- **Zod**: Type-safe schema validation for form data
- **@tanstack/react-table**: Headless table logic for complex data tables
- **Recharts**: Charting library for rendering graphs and data visualizations
- **React Dropzone**: Drag-and-drop file upload component
- **NextAuth v5 (beta)**: Authentication with OAuth and credentials
- **Slugify**: Converts text to URL-friendly slugs

## Features

- NextAuth v5 authentication
- Admin dashboard for management, with statistics
- Order, product, user, attributes, and categories management
- User area with profile and order history
- Stripe API integration
- Cash on delivery option
- Checkout process
- Promotional banner
- Support multiple images using Uploadthing
- Ratings and reviews system
- Search form for customer and admin
- Filtering
- Pagination
- Dark/Light/System mode
- Variable and simple products
- Price and sale price support

## Environment Variables

Create an `.env` and add the necessary environment variables:

```
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_SERVER_URL=

LATEST_PRODUCTS_LIMIT=

ENCRYPTION_KEY=

DATABASE_URL=

NEXTAUTH_URL=
NEXTAUTH_URL_INTERNAL=
NEXTAUTH_SECRET=

UPLOADTHING_TOKEN=
UPLOADTHING_SECRET=
UPLOADTHING_APPID=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

```

## User Screens

## Demos

**User**

- [User Overview](https://drive.google.com/file/d/1TGthfESeuFvq73cPmuyRSBZCLbSUImRA/view?usp=sharing)

**Admin**

- [Admin Dashboard Overview](https://drive.google.com/file/d/19sznjwv-VJ0I_6RoJZNQOfMI4_lyE3os/view?usp=drive_link)
- [Create Attribute](https://drive.google.com/file/d/1SuWKSUA-_QCTsGyR_eed9pGFasgwN3AE/view?usp=sharing)
- [Create Product](https://drive.google.com/file/d/19U6pwAIYjIOygVd0Ga1fr7LXMyWIW2QP/view?usp=drive_link)
- [Update Product Variant](https://drive.google.com/file/d/1DHPA4punuz-428XuUGf5XdhD-L5PDa2V/view?usp=drive_link)
