import { getPersonalSummary, getTopVotedQuotes } from "@/services/quote/quoteService";
import { useQuery } from "@tanstack/react-query";

export const usePersonalSummary = () => {
  return useQuery({
    queryKey: ['personal-summary'],
    queryFn: getPersonalSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useTopVotedQuotes = () => {
  return useQuery({
    queryKey: ['top-voted-quotes'],
    queryFn: getTopVotedQuotes,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Combined hook for dashboard data
export const useDashboardData = () => {
  const personalSummaryQuery = usePersonalSummary();
  const topVotedQuotesQuery = useTopVotedQuotes();

  return {
    // Personal Summary
    personalSummary: personalSummaryQuery.data?.data,
    isLoadingPersonal: personalSummaryQuery.isLoading,
    personalError: personalSummaryQuery.error,
    
    // Top Voted Quotes
    topVotedQuotes: topVotedQuotesQuery.data?.data || [],
    isLoadingTopQuotes: topVotedQuotesQuery.isLoading,
    topQuotesError: topVotedQuotesQuery.error,
    
    // Combined states
    isLoading: personalSummaryQuery.isLoading || topVotedQuotesQuery.isLoading,
    hasError: personalSummaryQuery.isError || topVotedQuotesQuery.isError,
    
    // Refetch functions
    refetchPersonal: personalSummaryQuery.refetch,
    refetchTopQuotes: topVotedQuotesQuery.refetch,
    refetchAll: () => {
      personalSummaryQuery.refetch();
      topVotedQuotesQuery.refetch();
    }
  };
};