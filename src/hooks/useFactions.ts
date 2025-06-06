import { useQuery } from '@tanstack/react-query';
import { factionService } from '../services/factionService';
import type { Faction, Subfaction } from '../types/Faction';

export function useFactions() {
  return useQuery<Faction[]>({
    queryKey: ['factions'],
    queryFn: factionService.getAll,
  });
}

export function useSubfactions(factionId?: string) {
  return useQuery<Subfaction[]>({
    queryKey: ['subfactions', factionId],
    queryFn: () => factionId ? factionService.getSubfactions(factionId) : factionService.getAllSubfactions(),
    // Always enabled: fetch all subfactions if no factionId
  });
}
