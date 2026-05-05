import { getCurrentUser, hasAdminRole, isAdminEmail } from '@/lib/supabase/auth'

export async function isAdmin() {
    const user = await getCurrentUser()
    if (!user) return false

    return hasAdminRole(user.role) || isAdminEmail(user.email)
}

export async function verifyAdmin() {
    const admin = await isAdmin()
    if (!admin) {
        throw new Error('Unauthorized: Admin access required')
    }
}
