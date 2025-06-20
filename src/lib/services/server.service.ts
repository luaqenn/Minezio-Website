import { useApi } from '@/lib/hooks/useApi';
import { BACKEND_URL_WITH_WEBSITE_ID } from '../constants/base';
import { Server } from '../types/server';

export const useServerService = () => {
    const { post, get } = useApi({ baseUrl: BACKEND_URL_WITH_WEBSITE_ID });

    const getServers = async (): Promise<Server[]> => {
        const response = await get<Server[]>('/config/servers', {}, true);
        return response.data;
    }

    const getServer = async (server_id: string): Promise<Server> => {
        const response = await get<Server>(`/config/servers/${server_id}`, {}, true);
        return response.data;
    }

    return {
        getServers,
        getServer
    };
}; 