export type Faction = {
    id: string;
    name: string;
    logo_filename: string;
};

export type Subfaction = {
    id: string;
    name: string;
    faction_id: string;
};
