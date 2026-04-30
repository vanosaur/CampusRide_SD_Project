import { useState, useEffect, useCallback } from 'react';
import { getRides } from '../api/rides';
import { Ride } from '../types';

export interface RideFilters {
  destination?: string;
  date?: string;
  [key: string]: any;
}

export const useRides = (initialFilters: RideFilters = {}) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<RideFilters>(initialFilters);

  const fetchRides = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRides(filters);
      setRides(res.data.rides || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch rides'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  return { rides, loading, error, filters, setFilters, refetch: fetchRides, setRides };
};
