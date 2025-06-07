import { useQuery } from '@tanstack/react-query';
import { userService, type Profile } from '../services/userService';

export function useUsers(userIds: string[]) {
    return useQuery<Profile[]>({
        queryKey: ['users', userIds],
        queryFn: async () => {
            if (!userIds.length) return [];
            return await userService.getByIds(userIds);
        },
        enabled: !!userIds.length,
    });
}

export function useUser(userId: string | undefined) {
    return useQuery<Profile | null>({
        queryKey: ['user', userId],
        queryFn: async () => {
            if (!userId) return null;
            return await userService.getById(userId);
        },
        enabled: !!userId,
    });
}
