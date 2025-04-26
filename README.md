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
<details>
  <summary>Auth</summary>
  
  ![sign-up](https://github.com/user-attachments/assets/49b97189-4ef2-4f1d-849e-33ee90ac4361)
  
  ![sign-in](https://github.com/user-attachments/assets/30be52c2-4ee4-450b-a4ca-a1122067defc)
  
</details>
<details>
  <summary>Home</summary>
  
  ![home](https://github.com/user-attachments/assets/5edddf79-b946-42ad-b1c3-85941678f8b3)
  
</details>
<details>
  <summary>Catalog</summary>
  
  ![catalog](https://github.com/user-attachments/assets/74aa2e59-3700-4bc5-84c3-8c9fa6dd8357)
  
</details>
<details>
  <summary>Product Details</summary>
  
  ![product-details](https://github.com/user-attachments/assets/02f71328-5fc4-4c62-804d-44e643665855)
  
</details>
<details>
  <summary>Shopping Cart</summary>
  
  ![cart](https://github.com/user-attachments/assets/6a02d63b-4938-49ce-ba68-ec39a7443241)
  
</details>
<details>
  <summary>Order</summary>
  
  ![address](https://github.com/user-attachments/assets/7b82d2fc-f063-4e31-b376-a3dc36c4cf43)
  
  ![payment](https://github.com/user-attachments/assets/4cf750dd-5f75-4ce8-8101-4469c145f921)
  
  ![place-order](https://github.com/user-attachments/assets/8ad781e1-95c8-4c1b-a40b-63ca28148746)

  ![Order History](https://github.com/user-attachments/assets/efac6c48-f268-4dcb-af96-6bf8aed06f34)
  
  ![order-details](https://github.com/user-attachments/assets/29eb7cca-d045-4f8d-a659-ba1f0633a0ee)

</details>

## Demos

**User**

- [User Overview](https://drive.google.com/file/d/1TGthfESeuFvq73cPmuyRSBZCLbSUImRA/view?usp=sharing)

**Admin**

- [Admin Dashboard Overview](https://drive.google.com/file/d/19sznjwv-VJ0I_6RoJZNQOfMI4_lyE3os/view?usp=drive_link)
- [Create Attribute](https://drive.google.com/file/d/1SuWKSUA-_QCTsGyR_eed9pGFasgwN3AE/view?usp=sharing)
- [Create Product](https://drive.google.com/file/d/19U6pwAIYjIOygVd0Ga1fr7LXMyWIW2QP/view?usp=drive_link)
- [Update Product Variant](https://drive.google.com/file/d/1DHPA4punuz-428XuUGf5XdhD-L5PDa2V/view?usp=drive_link)
