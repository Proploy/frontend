import { currentUser } from '@clerk/nextjs/server'

export async function isAdmin() {
    const user = await currentUser()
    if (!user) return false

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase())
    const userEmails = user.emailAddresses.map(e => e.emailAddress.toLowerCase())

    console.log('[DEBUG] Admin Check:', {
        allowed: adminEmails,
        userEmails: userEmails,
        match: userEmails.some(email => adminEmails.includes(email))
    })

    return userEmails.some(email => adminEmails.includes(email))
}

export async function verifyAdmin() {
    const admin = await isAdmin()
    if (!admin) {
        throw new Error('Unauthorized: Admin access required')
    }
}
