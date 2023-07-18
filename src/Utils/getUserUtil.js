import { ROLES } from "./roles.js";

export const getUserType = (role_id) => {
    if (!role_id) {
        return null;
    }
    const pairs = Object.entries(ROLES);
    const user_pair = pairs.filter((pair) => pair.includes(role_id));
    if (user_pair?.length) {
        const [userType, userTypeId] = user_pair[0];
        return {
            userType,
            userTypeId
        };
    }
    return null;
};