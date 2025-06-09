export type Warband = {
    id: string;
    name: string;
    campaign_id: string;
    owner_id: string;
    created_at: string;
    faction_id?: string | null;
    subfaction_id?: string | null;
    warband_subtitle?: string | null;
    warband_description?: string | null;
};
