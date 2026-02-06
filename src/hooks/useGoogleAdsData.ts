import { useState, useEffect, useMemo } from 'react';
import {
  parseGoogleAdsCSV,
  GoogleAdsData,
  filterByDateRange,
  aggregateGoogleAdsMetrics,
  getTopKeywords,
  getGoogleAdsCampaignTrends,
  KeywordPerformance,
  GoogleAdsCampaignTrend
} from '@/lib/googleAdsParser';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0_xNSuB0SknTQqon9YlTPuP7zglj1OU77KGJbpWYE_aoU1vuJWwxnc7fT2XAxOzmDxnikRKjfeHz1/pub?gid=711754605&single=true&output=csv';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface GoogleAdsDashboardMetrics {
  totalSpend: number;
  totalConversions: number;
  totalImpressions: number;
  totalClicks: number;
  avgCPA: number;
  ctr: number;
  cpc: number;
}

export function useGoogleAdsData() {
  const [rawData, setRawData] = useState<GoogleAdsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        const text = await response.text();
        const parsed = parseGoogleAdsCSV(text);
        setRawData(parsed);
        
        // Set initial date range based on data
        if (parsed.length > 0) {
          const dates = parsed
            .map(d => new Date(d.date))
            .filter(d => !isNaN(d.getTime()))
            .sort((a, b) => a.getTime() - b.getTime());
          
          if (dates.length > 0) {
            const maxDate = dates[dates.length - 1];
            const from = new Date(maxDate);
            from.setDate(maxDate.getDate() - 29); // Last 30 days
            from.setHours(0, 0, 0, 0);
            
            const to = new Date(maxDate);
            to.setHours(23, 59, 59, 999);
            
            setDateRange({ from, to });
          }
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!dateRange) return [];
    return filterByDateRange(rawData, dateRange.from, dateRange.to);
  }, [rawData, dateRange]);

  const metrics: GoogleAdsDashboardMetrics = useMemo(() => {
    return aggregateGoogleAdsMetrics(filteredData);
  }, [filteredData]);

  const topKeywords: KeywordPerformance[] = useMemo(() => {
    return getTopKeywords(filteredData, 10);
  }, [filteredData]);

  const campaignTrends: GoogleAdsCampaignTrend[] = useMemo(() => {
    if (!dateRange) return [];
    return getGoogleAdsCampaignTrends(filteredData, dateRange.to);
  }, [filteredData, dateRange]);

  const availableDateRange = useMemo(() => {
    if (rawData.length === 0) return null;

    const dates = rawData
      .map(d => new Date(d.date))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    return {
      min: dates[0],
      max: dates[dates.length - 1],
    };
  }, [rawData]);

  return {
    rawData,
    filteredData,
    metrics,
    topKeywords,
    campaignTrends,
    loading,
    error,
    dateRange,
    setDateRange,
    availableDateRange,
  };
}
