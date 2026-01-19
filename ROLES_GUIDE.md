# Role Management System Guide

This guide explains how to manage roles in the Roadlink application.

## Overview

The role system is designed to be flexible and easily extensible. Roles are stored in the database (`roles` table) and can be managed without code changes.

## Current Roles

The system comes with the following default roles:

1. **customer** - Regular customer or user of the system
2. **driver** - Driver who delivers shipments
3. **admin** - System administrator with full access
4. **manager** - Manager with elevated permissions

## Database Structure

### Roles Table
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,        -- Internal role identifier (e.g., 'driver')
  name_en TEXT NOT NULL,            -- English display name (e.g., 'Driver')
  name_ar TEXT NOT NULL,            -- Arabic display name (e.g., 'سائق')
  description TEXT,                  -- Optional description
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Roles Table
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Adding a New Role

### Step 1: Add to Database

Insert the new role into the `roles` table:

```sql
INSERT INTO roles (name, name_en, name_ar, description) VALUES
  ('dispatcher', 'Dispatcher', 'مرسل', 'Person who dispatches shipments');
```

### Step 2: Add to TypeScript Constants (Optional)

If you want type safety, add the role to `src/lib/roles.ts`:

```typescript
export const ROLES = {
  CUSTOMER: 'customer',
  DRIVER: 'driver',
  ADMIN: 'admin',
  MANAGER: 'manager',
  DISPATCHER: 'dispatcher',  // Add new role here
} as const
```

### Step 3: Use in Code

Use the role constant in your code:

```typescript
import { ROLES } from '@/lib/roles'

// When assigning a role
await supabase
  .from('user_roles')
  .insert({
    id: userId,
    role: ROLES.DISPATCHER,
  })
```

## Using Roles in Code

### Import Role Constants

```typescript
import { ROLES, getRoles, isValidRole } from '@/lib/roles'
```

### Check User Role

```typescript
const { auth } = useAuthStore()
const isDriver = auth.user?.role?.includes(ROLES.DRIVER)
const isAdmin = auth.user?.role?.includes(ROLES.ADMIN)
```

### Get All Available Roles

```typescript
import { getRoles } from '@/lib/roles'

const roles = await getRoles()
// Returns array of Role objects from database
```

### Validate Role

```typescript
import { isValidRole } from '@/lib/roles'

if (isValidRole(someRole)) {
  // TypeScript knows someRole is a valid RoleName
}
```

## Role Assignment

### During Sign-Up

- **Driver Sign-Up**: Automatically assigns `ROLES.DRIVER`
- **Regular Sign-Up**: Automatically assigns `ROLES.CUSTOMER`

### Manual Assignment

You can assign roles manually via SQL or through the Supabase dashboard:

```sql
UPDATE user_roles 
SET role = 'admin' 
WHERE id = 'user-uuid-here';
```

## Best Practices

1. **Always use constants**: Use `ROLES.DRIVER` instead of `'driver'` string
2. **Validate roles**: Use `isValidRole()` before assigning roles
3. **Database as source of truth**: Roles are defined in the database, not hardcoded
4. **Type safety**: Use TypeScript types for role names when possible

## Extending the System

To add role-based permissions or access control:

1. Create a `permissions` table (optional)
2. Create a `role_permissions` junction table (optional)
3. Add permission checks in your components/routes
4. Use the role system to determine access levels

Example permission check:

```typescript
function canAccessAdminPanel(user: AuthUser): boolean {
  return user.role?.includes(ROLES.ADMIN) || user.role?.includes(ROLES.MANAGER)
}
```

