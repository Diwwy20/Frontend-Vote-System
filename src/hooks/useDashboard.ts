import { getPersonalSummary, getTopVotedQuotes } from "@/services/quote/quoteService";
import { useQuery } from "@tanstack/react-query";

export const usePersonalSummary = () => {
  return useQuery({
    queryKey: ['personal-summary'],
    queryFn: getPersonalSummary,
    staleTime: 0, 
    refetchOnWindowFocus: false,
    refetchOnMount: 'always'
  });
};

export const useTopVotedQuotes = () => {
  return useQuery({
    queryKey: ['top-voted-quotes'],
    queryFn: getTopVotedQuotes,
    staleTime: 0, 
    refetchOnWindowFocus: false,
    refetchOnMount: 'always'
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
