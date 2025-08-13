/**
 * JWT Token 解析工具
 * 根据后端JWT结构解析用户基本信息和角色信息
 */

// 解析JWT token的payload部分
export function parseJwtToken(token) {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT token解析失败:', error);
        return null;
    }
}

// 检查token是否过期
export function isTokenExpired(token) {
    const payload = parseJwtToken(token);
    if (!payload || !payload.exp) return true;
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
}

// 解析claims中的用户信息
export function parseUserClaims(claims) {
    try {
        if (typeof claims === 'string') {
            return JSON.parse(claims);
        }
        return claims;
    } catch (error) {
        console.error('解析用户claims失败:', error);
        return null;
    }
}

// 获取token中的用户基本信息
export function getUserInfoFromToken(token) {
    const payload = parseJwtToken(token);
    if (!payload || !payload.claims) return null;

    const userClaims = parseUserClaims(payload.claims);
    if (!userClaims) return null;

    return {
        userId: userClaims.userId,
        username: userClaims.username,
        nickname: userClaims.nickname,
        email: userClaims.email,
        status: userClaims.status,
        company: userClaims.company
    };
}

// 获取token中的角色信息
export function getRolesFromToken(token) {
    const payload = parseJwtToken(token);
    if (!payload || !payload.claims) return [];

    const userClaims = parseUserClaims(payload.claims);
    if (!userClaims || !userClaims.roles) return [];

    return userClaims.roles;
}

// 获取用户主要角色
export function getPrimaryRole(token) {
    const roles = getRolesFromToken(token);
    console.log('JWT解析的角色列表:', roles);
    const primaryRole = roles.length > 0 ? roles[0].roleName : null;
    console.log('主要角色:', primaryRole);
    return primaryRole;
}

// 检查用户是否有某个角色
export function hasRole(token, roleName) {
    const roles = getRolesFromToken(token);
    return roles.some(role => role.roleName === roleName);
}

// 根据角色获取对应的首页路径
export function getRoleHomePage() {
    // 根据用户角色返回对应的首页路径
    // 这里需要传入token参数来获取用户角色
    return '/dashboard';
}

// 根据角色获取对应的首页路径（需要token参数）
export function getRoleHomePageByToken(token) {
    const roles = getRolesFromToken(token);
    if (roles && roles.length > 0) {
        const primaryRole = roles[0].roleName;
        if (primaryRole === 'ROLE_HR') {
            return '/hr-dashboard';
        }
    }
    return '/dashboard';
} 