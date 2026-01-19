/**
 * Role management system
 * 
 * This file provides a flexible way to manage roles in the system.
 * Roles are stored in the database (roles table) and can be easily extended.
 */

// Role names as constants for type safety
export const ROLES = {
    CUSTOMER: 'customer',
    DRIVER: 'driver',
    ADMIN: 'admin',
    MANAGER: 'manager',
    SUPERVISOR: 'supervisor',
} as const

export type RoleName = typeof ROLES[keyof typeof ROLES]

// Role interface matching database schema
export interface Role {
    id: number
    name: string
    name_en: string
    name_ar: string
    description?: string
    created_at: string
}

/**
 * Get all available roles from the database
 */
export async function getRoles(): Promise<Role[]> {
    const { supabase } = await import('./supabase')
    const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('id')

    if (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching roles:', error)
        return []
    }

    return (data || []) as Role[]
}

/**
 * Check if a role name is valid
 */
export function isValidRole(role: string): role is RoleName {
    return Object.values(ROLES).includes(role as RoleName)
}

/**
 * Get role display name based on current language
 */
export function getRoleDisplayName(role: Role, language: 'en' | 'ar'): string {
    return language === 'ar' ? role.name_ar : role.name_en
}

