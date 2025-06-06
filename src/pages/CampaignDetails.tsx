import { useWarbands } from '../hooks/useWarbands.js';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { campaignService } from '../services/campaignService.js';
import { oathService } from '../services/oathService.js';
import type { Campaign } from '../types/Campaign';
import type { Oath } from '../types/Oath';
import styles from './Campaigns.module.scss';
import SkirmishArena from '../components/SkirmishArena/SkirmishArena';
import { useSkirmishes } from '../hooks/useSkirmishes';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import type { WarbandStats } from '../components/Leaderboard/Leaderboard';
import { skirmishService } from '../services/skirmishService';
import PendingSkirmishTable from '../components/SkirmishTable/PendingSkirmishTable';
import CompletedSkirmishTable from '../components/SkirmishTable/CompletedSkirmishTable';

export default function CampaignDetails() {
    const { id } = useParams<{ id: string }>();
    const { data: campaign, isLoading: loadingCampaign } =
        useQuery<Campaign | null>({
            queryKey: ['campaign', id],
            queryFn: async () => {
                if (!id) return null;
                const { data } = await campaignService.getById(id);
                return data;
            },
            enabled: !!id,
        });
    const { data: oaths = [], isLoading: loadingOaths } = useQuery<Oath[]>({
        queryKey: ['oaths', id],
        queryFn: () => oathService.getByCampaign(id!),
        enabled: !!id,
    });
    const { warbands = [] } = useWarbands();
    const campaignWarbands = warbands.filter((w) => w.campaign_id === id);

    // Fetch all participant profiles for this campaign
    const participantIds: string[] = Array.from(
        new Set(oaths.map((o) => o.user_id))
    );
    const { data: participants = [] } = useQuery({
        queryKey: ['participants', participantIds],
        queryFn: () => userService.getByIds(participantIds),
        enabled: participantIds.length > 0,
    });

    // Skirmish data
    const { data: skirmishes = [], isLoading: loadingSkirmishes } =
        useSkirmishes(id!);

    // Split skirmishes into pending and completed
    const pendingSkirmishes = skirmishes.filter((s) => !s.winner_id);
    const completedSkirmishes = skirmishes.filter((s) => !!s.winner_id);

    // Mutations for marking winner and deleting skirmish
    const queryClient = useQueryClient();
    const updateSkirmish = useMutation({
        mutationFn: async ({
            id,
            winner_id,
        }: {
            id: string;
            winner_id: string;
        }) => {
            const { error } = await skirmishService.updateWinner(id, winner_id);
            if (error) throw error;
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['skirmishes', id] }),
    });
    const deleteSkirmish = useMutation({
        mutationFn: async (skirmishId: string) => {
            const { error } = await skirmishService.delete(skirmishId);
            if (error) throw error;
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['skirmishes', id] }),
    });

    function handleMarkWinner(skirmishId: string, winnerId: string) {
        updateSkirmish.mutate({ id: skirmishId, winner_id: winnerId });
    }
    function handleDeleteSkirmish(skirmishId: string) {
        if (window.confirm('Delete this skirmish?')) {
            deleteSkirmish.mutate(skirmishId);
        }
    }

    if (loadingCampaign || loadingOaths || loadingSkirmishes)
        return <div>Loading...</div>;
    if (!campaign) return <div>Campaign not found.</div>;

    // Calculate leaderboard stats from skirmishes
    // Also build a map of warbandId -> completed matches for SkirmishArena
    const leaderboardStats: WarbandStats[] = campaignWarbands.map((w) => {
        const completed = skirmishes.filter(
            (sk) =>
                (sk.left_warband_id === w.id || sk.right_warband_id === w.id) &&
                sk.winner_id
        );
        const pending = skirmishes.filter(
            (sk) =>
                (sk.left_warband_id === w.id || sk.right_warband_id === w.id) &&
                !sk.winner_id
        );
        const wins = completed.filter((sk) => sk.winner_id === w.id).length;
        const losses = completed.filter((sk) => sk.winner_id !== w.id).length;
        return {
            warband: w,
            matches: completed.length,
            wins,
            losses,
            pending: pending.length,
        } as WarbandStats & { pending: number };
    });
    // Map warbandId -> completed matches
    const warbandMatchesMap: Record<string, number> = {};
    leaderboardStats.forEach(stat => {
        warbandMatchesMap[stat.warband.id] = stat.matches;
    });
    // Prepare warbands with completedMatches property for SkirmishArena
    const warbandsWithMatches = campaignWarbands.map(w => ({
        ...w,
        completedMatches: warbandMatchesMap[w.id] || 0,
    }));

    return (
        <div className={styles.campaigns}>
            <h1>{campaign.name}</h1>
            <p>{campaign.description}</p>
            <Leaderboard stats={leaderboardStats} />

            <h2>Skirmishes</h2>

            <SkirmishArena
                warbands={warbandsWithMatches}
            />

            <h3>Pending Skirmishes</h3>
            {pendingSkirmishes.length === 0 ? (
                <p>No pending skirmishes.</p>
            ) : (
            <PendingSkirmishTable
                skirmishes={pendingSkirmishes}
                warbands={warbandsWithMatches}
                onMarkWinner={handleMarkWinner}
                onDelete={handleDeleteSkirmish}
                isMarkingWinner={updateSkirmish.isPending}
                isDeleting={deleteSkirmish.isPending}
            />
            )}

            <h3>Completed Skirmishes</h3>
            {completedSkirmishes.length === 0 ? (
                <p>No completed skirmishes.</p>
            ) : (
                <CompletedSkirmishTable
                    skirmishes={completedSkirmishes}
                    warbands={campaignWarbands}
                />
            )}

            <h3>Commanders</h3>
            <ul>
                {participants.length === 0 ? (
                    <li>No users have joined this campaign yet.</li>
                ) : (
                    participants.map((p) => (
                        <li key={p.id}>{p.display_name || p.email || p.id}</li>
                    ))
                )}
            </ul>
        </div>
    );
}
