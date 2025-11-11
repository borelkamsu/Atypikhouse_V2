# AtypikHouse SSR - Unique Accommodation Rental Platform

## Overview

AtypikHouse is a modern platform for renting unique and unusual accommodations built with Next.js 15, TypeScript, Tailwind CSS 4, and MongoDB. The application features server-side rendering (SSR) for optimal SEO and performance, with a hybrid SSR/CSR architecture for dynamic interactions.

The platform supports three distinct user workflows:
- **Client workflow**: Users can browse, search, and book unique properties
- **Owner workflow**: Property owners can register, create listings, and manage bookings
- **Admin workflow**: Administrators can manage users, properties, and approve/reject owner applications

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15 with App Router
- **SSR/CSR Hybrid**: Server components for initial page loads and SEO, client components for interactive features
- **Routing**: File-based routing using Next.js App Router with route groups for organization
- **Layout System**: Conditional layout wrapper that shows/hides header and footer based on route (admin/owner pages have no header/footer)

**Styling & UI**:
- **Tailwind CSS 4**: Utility-first CSS framework with custom theme configuration
- **Design System**: Custom color palette (Primary Green #16A433, Secondary Brown #8B4513, Accent Orange #FF8C00)
- **Typography**: Playfair Display for headings, Inter for body text
- **Component Library**: Radix UI primitives for accessible components (Avatar, Badge, Dialog, Select, Checkbox, Toast, Tabs)
- **Reusable Components**: Button, Card, Input, Label, Textarea, Table, and form components

**State Management**:
- React hooks (useState, useEffect) for local state
- Form management with react-hook-form and Zod validation
- Toast notifications using custom useToast hook

### Backend Architecture

**API Routes**: Next.js API Routes (serverless functions) handle all backend logic

**Authentication & Authorization**:
- JWT-based authentication with HTTP-only cookies
- Role-based access control (user, owner, admin)
- Bcrypt for password hashing
- Session management with secure cookie storage

**Data Models** (Mongoose schemas):
- **User**: firstName, lastName, email, password (hashed), phone, role, avatar, verification status, host-specific fields (siret, companyName, businessDescription, hostStatus)
- **Property**: title, description, type (cabin, yurt, floating, dome, etc.), location (address, city, country, coordinates), price, capacity (guests, bedrooms, bathrooms), amenities, images, owner reference, availability, rating
- **Review**: property reference, user reference, rating (1-5), comment
- **Booking**: user reference, property reference, startDate, endDate, totalPrice, status (pending, confirmed, cancelled, completed), guests, specialRequests
- **Favorite**: user reference, property reference
- **Amenity**: name, icon, category (basic, comfort, luxury, outdoor, safety, accessibility)
- **Message**: content (minimal model for messaging system)

**API Endpoints**:
- `/api/auth/register` - User/owner registration
- `/api/auth/login` - User login
- `/api/auth/logout` - User logout
- `/api/auth/me` - Get current user
- `/api/properties` - CRUD operations for properties
- `/api/bookings` - CRUD operations for bookings
- `/api/favorites` - Manage user favorites
- `/api/reviews` - Create and retrieve reviews
- `/api/amenities` - List available amenities
- `/api/admin/*` - Admin-specific endpoints

**Validation**:
- Server-side validation using Zod schemas
- Client-side validation with react-hook-form
- Mongoose schema validation at database level

### Database Architecture

**MongoDB** with Mongoose ODM:
- NoSQL document-based database for flexibility
- Schema validation and middleware support
- Indexed fields for query optimization (email, property type, location, dates)
- Referenced relationships between collections (User ↔ Property, Property ↔ Review, User ↔ Booking)

**Connection Management**:
- Connection pooling with singleton pattern
- Environment-based configuration
- Graceful error handling and reconnection logic

**Data Indexing**:
- Unique indexes on user email
- Compound indexes on favorites (userId + propertyId)
- Indexes on frequently queried fields (property type, city, rating, dates)

### Security Considerations

- Password hashing with bcrypt (10 rounds)
- JWT tokens stored in HTTP-only cookies
- CORS and CSRF protection
- Input validation and sanitization
- Role-based route protection
- Environment variables for sensitive data

### Performance Optimizations

- Server-side rendering for initial page loads
- Image optimization (Next.js Image component recommended for future use)
- Database query optimization with indexes
- Lazy loading of client components
- TypeScript for type safety and better DX

## External Dependencies

### Third-party Packages

**Frontend**:
- `next` (^15.5.0): React framework with SSR
- `react` (^19.2.0): UI library
- `react-dom` (^19.2.0): React DOM renderer
- `@radix-ui/*`: Accessible UI component primitives
- `tailwindcss` (^3.4.18): Utility-first CSS framework
- `lucide-react` (^0.541.0): Icon library
- `react-hook-form` (^7.66.0): Form state management
- `class-variance-authority` (^0.7.1): CSS variant utilities
- `tailwind-merge` (^2.6.0): Tailwind class merging
- `tailwindcss-animate` (^1.0.7): Animation utilities

**Backend**:
- `mongoose` (^8.19.3): MongoDB ODM
- `bcrypt` (^5.1.1): Password hashing
- `jsonwebtoken` (^9.0.2): JWT authentication
- `zod` (^3.25.76): Schema validation

**Development**:
- `typescript` (^5.9.3): Static typing
- `eslint` (^8.57.1): Code linting
- `autoprefixer` (^10.4.22): CSS vendor prefixes
- `tsx` (^4.6.0): TypeScript execution
- `nodemon` (^3.1.10): Development server auto-reload

### External Services

**Database**: MongoDB (local or cloud-hosted)
- Default connection: `mongodb://localhost:27017/atypikhouse`
- Configurable via MONGODB_URI environment variable

**Deployment**: Designed for containerization
- Docker support with Dockerfile and docker-compose.yml
- MongoDB Express for database administration (development)
- Health check endpoints for monitoring

### Environment Variables Required

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token signing
- `SESSION_SECRET`: Secret for session management
- `NODE_ENV`: Environment (development/production)
- Additional secrets as needed for third-party integrations

### Future Integration Considerations

The application architecture supports future integration of:
- File upload services (AWS S3, Cloudinary) for property images
- Email services (SendGrid, Mailgun) for notifications
- Payment processing (Stripe, PayPal) for bookings
- Map services (Google Maps, Mapbox) for location display
- Analytics (Google Analytics, Mixpanel)
- Search optimization (Algolia, Elasticsearch)