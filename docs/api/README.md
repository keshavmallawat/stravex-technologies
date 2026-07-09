# API & Server Actions Documentation

Stravex CMS 2.0 leverages Next.js **Server Actions** for all internal API communications. Traditional REST API routes are only used where external Webhooks or SDK requirements dictate.

## Server Actions (`actions.ts`)

Every module in the CMS has a dedicated `actions.ts` file located in `src/app/admin/(dashboard)/[module]/actions.ts`.

### Design Pattern
1. **Validation**: All incoming data is validated using `zod` schemas.
2. **Authentication**: Actions verify the user session via `auth()` before proceeding.
3. **Mutation**: Prisma performs the database operation.
4. **Revalidation**: `revalidatePath()` is called to instantly update the UI without client-side fetching.

### Example: Products Action
```typescript
'use server'
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createProductAction(data: ProductFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  
  // Validation & DB Mutation...
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
}
```

## REST API Routes (`src/app/api/`)
- `/api/auth/[...nextauth]`: NextAuth v5 internal endpoints.
- `/api/admin/media`: Cloudinary proxy endpoint to securely handle multipart form-data file uploads via the Cloudinary Node SDK without exposing API secrets to the client.
