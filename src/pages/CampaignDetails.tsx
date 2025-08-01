import { useWarbands } from '../hooks/useWarbands.js';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
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
    const queryClient = useQueryClient();
    const { data: campaign, isLoading: loadingCampaign } =
        useQuery<Campaign | null>({
            queryKey: ['campaign', id],
            queryFn: async () => {
                if (!id) return null;
                const { data } = await campaignService.getById(id);
                return data;
            },
            enabled: !!id,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        });

    useEffect(() => {
        if (!id) return;
        const sub = campaignService.subscribe((payload: unknown) => {
            const p = payload as { new?: { id: string }; old?: { id: string } };
            if (p?.new?.id === id || p?.old?.id === id) {
                queryClient.invalidateQueries({ queryKey: ['campaign', id] });
            }
        });
        return () => {
            if (sub && typeof sub.unsubscribe === 'function') sub.unsubscribe();
        };
    }, [id, queryClient]);
    const { data: oaths = [], isLoading: loadingOaths } = useQuery<Oath[]>({
        queryKey: ['oaths', id],
        queryFn: () => oathService.getByCampaign(id!),
        enabled: !!id,
    });
    const { warbands = [] } = useWarbands();
    const campaignWarbands = warbands.filter((w) => w.campaign_id === id);

    const participantIds: string[] = Array.from(
        new Set(oaths.map((o) => o.user_id))
    );
    const { data: participants = [] } = useQuery({
        queryKey: ['participants', participantIds],
        queryFn: () => userService.getByIds(participantIds),
        enabled: participantIds.length > 0,
    });

    const { data: skirmishes = [], isLoading: loadingSkirmishes } =
        useSkirmishes(id!);

    const pendingSkirmishes = skirmishes.filter((s) => !s.winner_id);
    const completedSkirmishes = skirmishes.filter((s) => !!s.winner_id);

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

    const leaderboardStats: WarbandStats[] = campaignWarbands.map((w) => {
        const allMatches = skirmishes.filter(
            (sk) =>
                sk.attacker_warband_id === w.id || sk.defender_warband_id === w.id
        );
        const completed = allMatches.filter((sk) => !!sk.winner_id);
        const pending = allMatches.filter((sk) => !sk.winner_id);
        const wins = completed.filter((sk) => sk.winner_id === w.id).length;
        const losses = completed.filter(
            (sk) => sk.winner_id && sk.winner_id !== w.id &&
                (sk.attacker_warband_id === w.id || sk.defender_warband_id === w.id)
        ).length;

        return {
            warband: w,
            matches: completed.length,
            wins,
            losses,
            pending: pending.length,
        } as WarbandStats & { pending: number };
    });
    const warbandMatchesMap: Record<string, number> = {};
    leaderboardStats.forEach((stat) => {
        warbandMatchesMap[stat.warband.id] = stat.matches;
    });
    const warbandsWithMatches = campaignWarbands.map((w) => ({
        ...w,
        completedMatches: warbandMatchesMap[w.id] || 0,
    }));

    return (
        <div className={styles.campaigns}>
            <h1>{campaign.name}</h1>
            <p>{campaign.description}</p>
            <Leaderboard stats={leaderboardStats} />

            <h2>Skirmishes</h2>

            <SkirmishArena warbands={warbandsWithMatches} />

            <h3>Ongoing Skirmishes</h3>
            {pendingSkirmishes.length === 0 ? (
                <p>No ongoing skirmishes.</p>
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
