import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getAllQuotes, 
  getQuoteById,
  voteQuote, 
  checkVoteEligibility,
  createQuote,
  updateQuote,
  deleteQuote
} from '@/services/quote/quoteService';
import type { Quote, QuoteFilters, UpdateQuoteData } from '@/services/quote/quoteService';
import { useAuth } from '@/hooks/useAuth';

// Hook สำหรับดึงรายการ quotes
export const useQuotes = (filters?: QuoteFilters) => {
  return useQuery({
    queryKey: ['quotes', filters],
    queryFn: () => getAllQuotes(filters),
    staleTime: 5 * 60 * 1000, // 5 นาที
    refetchOnWindowFocus: false,
  });
};

// Hook สำหรับดึง quote เดี่ยว
export const useQuote = (quoteId: string) => {
  return useQuery({
    queryKey: ['quote', quoteId],
    queryFn: () => getQuoteById(quoteId),
    enabled: !!quoteId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook สำหรับตรวจสอบสถานะการโหวต
export const useVoteStatus = (quoteId: string) => {
  return useQuery({
    queryKey: ['vote-status', quoteId],
    queryFn: () => checkVoteEligibility(quoteId),
    enabled: !!quoteId,
    staleTime: 30 * 1000, // 30 วินาที
  });
};

// Hook สำหรับจัดการ quotes (CRUD และ voting)
export const useQuoteActions = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mutation สำหรับสร้าง quote ใหม่
  const createQuoteMutation = useMutation({
    mutationFn: createQuote,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['quotes'] });
        toast.success(data.message || 'Quote created successfully!');
      } else {
        toast.error(data.message || 'Failed to create quote');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create quote');
    },
  });

  // Mutation สำหรับแก้ไข quote
  const updateQuoteMutation = useMutation({
    mutationFn: ({ quoteId, data }: { quoteId: string; data: UpdateQuoteData }) => 
      updateQuote(quoteId, data),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['quotes'] });
        queryClient.invalidateQueries({ queryKey: ['quote', variables.quoteId] });
        toast.success(data.message || 'Quote updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update quote');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update quote');
    },
  });

  // Mutation สำหรับลบ quote
  const deleteQuoteMutation = useMutation({
    mutationFn: deleteQuote,
    onSuccess: (data, quoteId) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['quotes'] });
        queryClient.removeQueries({ queryKey: ['quote', quoteId] });
        toast.success(data.message || 'Quote deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete quote');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete quote');
    },
  });

  // ✅ Vote Mutation
  const voteMutation = useMutation({
    mutationFn: ({ quoteId, voteValue }: { quoteId: string; voteValue: 1 | -1 }) => {
      console.log('🔥 voteMutation called:', { quoteId, voteValue });
      return voteQuote(quoteId, voteValue);
    },
    onSuccess: (data, { voteValue }) => {
      console.log('🔥 voteMutation onSuccess:', data);
      
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['quotes'] });
        
        const message = voteValue === 1 
          ? 'Vote submitted successfully!' 
          : 'Vote removed successfully!';
        
        toast.success(message);
      } else {
        toast.error(data.message || 'Failed to vote');
      }
    },
    onError: (error: Error) => {
      console.log('🔥 voteMutation onError:', error);
      toast.error(error.message || 'Failed to vote');
    },
  });

  const handleVote = async (quote: Quote) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    try {
      console.log('🔥 handleVote called:', { quoteId: quote.id, user: user.id });
      
      const hasUserVoted = quote.voted_users.some(voter => voter.user_id === Number(user.id));
      
      if (hasUserVoted) {
        console.log('🔥 User has voted, removing vote (sending -1)');
        await voteMutation.mutateAsync({ quoteId: quote.id, voteValue: -1 });
      } else {
        console.log('🔥 User hasn\'t voted, adding vote (sending 1)');
        await voteMutation.mutateAsync({ quoteId: quote.id, voteValue: 1 });
      }
    } catch (error) {
      console.error('Vote error:', error);
      throw error;
    }
  };

  return {
    // Mutations
    createQuote: createQuoteMutation.mutate,
    updateQuote: (quoteId: string, data: UpdateQuoteData) => 
      updateQuoteMutation.mutate({ quoteId, data }),
    deleteQuote: deleteQuoteMutation.mutate,
    vote: handleVote,
    
    // Loading states
    isCreating: createQuoteMutation.isPending,
    isUpdating: updateQuoteMutation.isPending,
    isDeleting: deleteQuoteMutation.isPending,
    isVoting: voteMutation.isPending,
    
    // Error states
    createError: createQuoteMutation.error,
    updateError: updateQuoteMutation.error,
    deleteError: deleteQuoteMutation.error,
    voteError: voteMutation.error,
  };
};

// Hook สำหรับใช้ในหน้า Edit Quote
export const useQuoteEdit = (quoteId: string) => {
  const quoteQuery = useQuote(quoteId);
  const actions = useQuoteActions();

  return {
    // Data
    quote: quoteQuery.data?.data,
    
    // States
    isLoading: quoteQuery.isLoading,
    isError: quoteQuery.isError,
    error: quoteQuery.error,
    
    // Actions
    updateQuote: actions.updateQuote,
    deleteQuote: actions.deleteQuote,
    
    // Loading states
    isUpdating: actions.isUpdating,
    isDeleting: actions.isDeleting,
    
    // Refetch
    refetchQuote: quoteQuery.refetch,
  };
};

// Hook รวมสำหรับใช้ในหน้า Quote List
export const useQuoteManagement = (filters?: QuoteFilters) => {
  const quotesQuery = useQuotes(filters);
  const actions = useQuoteActions();

  return {
    // Data
    quotes: quotesQuery.data?.data || [],
    pagination: quotesQuery.data?.pagination,
    
    // States
    isLoading: quotesQuery.isLoading,
    isError: quotesQuery.isError,
    error: quotesQuery.error,
    
    // Actions
    ...actions,
    
    // Refetch
    refetchQuotes: quotesQuery.refetch,
  };
};

// ✅ Updated Utility Functions
export const useQuoteUtils = () => {
  const { user } = useAuth();

  // ฟังก์ชันเช็คว่า user โหวต quote นี้หรือไม่
  const hasUserVoted = (quote: Quote) => {
    if (!user) return false;
    return quote.voted_users.some(voter => voter.user_id === Number(user.id));;
  };

  // ฟังก์ชันหา quote ที่ user โหวตอยู่ในปัจจุบัน
  const findCurrentVotedQuote = (quotes: Quote[]) => {
    if (!user) return null;
    return quotes.find(quote => hasUserVoted(quote));
  };

  // ฟังก์ชันเช็คว่า user โหวต quote อื่นอยู่หรือไม่
  const hasVotedOtherQuote = (quotes: Quote[], currentQuoteId: string) => {
    const votedQuote = findCurrentVotedQuote(quotes);
    return votedQuote && votedQuote.id !== currentQuoteId;
  };

  // ฟังก์ชันเช็คสถานะการโหวต
  const getVoteStatus = (quote: Quote, quotes: Quote[]) => {
    const isVoted = hasUserVoted(quote);
    const hasVotedOther = hasVotedOtherQuote(quotes, quote.id);
    
    return {
      isVoted,
      hasVotedOther,
      canVote: !isVoted && !hasVotedOther,
      voteButtonText: isVoted ? "Remove vote" : hasVotedOther ? "Switch vote" : "Vote"
    };
  };

  return {
    hasUserVoted,
    findCurrentVotedQuote,
    hasVotedOtherQuote,
    getVoteStatus
  };
};