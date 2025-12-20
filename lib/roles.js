/**
 * Role definitions and permission checks.
 */

export const ROLES = {
    FREE: 'FREE_USER',
    PRO: 'PRO_USER',
    ADMIN: 'ADMIN_USER', // Or 'BIZ_USER' as per ai-prompt, let's stick to prompt mentions. Prompt mentions 'BIZ' in schema, 'ADMIN_USER' in RBAC Logic section. I'll use the constants to map them.
    // Prompt says: 'FREE', 'PRO', 'BIZ' in Schema.
    // Prompt says: 'FREE_USER', 'PRO_USER', 'ADMIN_USER' in RBAC Logic.
    // I will align them. Let's use the Values expected in publicMetadata.
};

export const PERMISSIONS = {
    CAN_USE_AI: [ROLES.PRO, ROLES.ADMIN],
    CAN_MANAGE_TEAM: [ROLES.ADMIN],
    MAX_LINKS_FREE: 5,
};

export function hasPermission(userRole, permissionRoles) {
    if (!userRole) return false;
    return permissionRoles.includes(userRole);
}

export const PLANS = {
    FREE: {
        label: 'Free',
        price: 0,
        role: ROLES.FREE,
        features: ['5 Links', 'Basic Analytics'],
    },
    PRO: {
        label: 'Pro',
        price: 9,
        role: ROLES.PRO,
        features: ['Unlimited Links', 'AI Optimizer', 'Advanced Analytics'],
    },
    BIZ: {
        label: 'Business',
        price: 29,
        role: ROLES.ADMIN,
        features: ['Team Management', 'Priority Support', 'Everything in Pro'],
    }
};
