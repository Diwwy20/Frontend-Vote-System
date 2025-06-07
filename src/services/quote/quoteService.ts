import api from "./quoteApi";

export interface Quote {
  id: string;
  content: string;
  author: string;
  user_name?: string;
  category: string;
  tags: string[];
  vote_count: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  voted_users: Array<{
    user_id: number;
    user_name: string;
    user_avatar: string;
  }>;
}

export interface QuoteFilters {
  category?: string;
  author?: string;
  search?: string;
  user_name?: string;
  sortBy?: 'vote_count' | 'created_at' | 'updated_at' | 'author';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface QuoteResponse {
  success: boolean;
  data: Quote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateQuoteData {
  content: string;
  author: string;
  category: string;
  tags?: string[] | string;
}

export interface UpdateQuoteData {
  content: string;
  author: string;
  category: string;
  tags?: string[] | string;
}

export interface QuoteActionResponse {
  success: boolean;
  message: string;
  data?: Quote;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  data?: {
    quote_id: number;
    vote_value?: number;
    previous_quote_id?: number; 
  };
}

export interface VoteEligibilityResponse {
  success: boolean;
  message: string;
  data: {
    quote_id: number;
    can_vote: boolean;
    reasons: {
      quote_has_zero_votes: boolean;
      user_has_not_voted: boolean;
    };
    existing_vote: {
      vote_value: number;
    } | null;
  };
}

export interface SingleQuoteResponse {
  success: boolean;
  data: Quote;
  message?: string;
}

export interface PersonalSummary {
  total_quotes_created: number;
  total_votes_received: number;
  ranking: number | null;
  category_distribution: {
    category: string;
    count: number;
    percentage: number;
  }[];
}

export interface TopVotedQuote {
  rank: number;
  id: string;
  content: string;
  author: string;
  category: string;
  vote_count: number;
  creator_name: string;
  created_at: string;
}

export interface PersonalSummaryResponse {
  success: boolean;
  message: string;
  data: PersonalSummary;
}

export interface TopVotedQuotesResponse {
  success: boolean;
  message: string;
  data: TopVotedQuote[];
}

export const getAllQuotes = async (filters: QuoteFilters = {}): Promise<QuoteResponse> => {
  try {
    const params = new URLSearchParams();
    
    // Only add parameters if they have values
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.author && filters.author.trim()) {
      params.append('author', filters.author.trim());
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.user_name && filters.user_name.trim()) {
      params.append('user_name', filters.user_name.trim());
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }
    if (filters.page && filters.page > 0) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit && filters.limit > 0) {
      params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/quote/all?${queryString}` : '/quote/all';
    
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch quotes');
  }
};

export const getQuoteById = async (quoteId: string): Promise<SingleQuoteResponse> => {
  try {
    const response = await api.get(`/quote/${quoteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch quote');
  }
};

export const createQuote = async (data: CreateQuoteData): Promise<QuoteActionResponse> => {
  try {
    const response = await api.post('/quote/create', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create quote');
  }
};

export const updateQuote = async (quoteId: string, data: UpdateQuoteData): Promise<QuoteActionResponse> => {
  try {
    const response = await api.put(`/quote/${quoteId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update quote');
  }
};

export const deleteQuote = async (quoteId: string): Promise<QuoteActionResponse> => {
  try {
    const response = await api.delete(`/quote/${quoteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete quote');
  }
};

export const voteQuote = async (quoteId: string, voteValue: 1 | -1): Promise<VoteResponse> => {
  try {
    const response = await api.post(`/vote/${quoteId}`, {
      vote_value: voteValue
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to vote');
  }
};

// Check vote eligibility
export const checkVoteEligibility = async (quoteId: string): Promise<VoteEligibilityResponse> => {
  try {
    const response = await api.get(`/vote/check/${quoteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to check vote eligibility');
  }
};

export const getPersonalSummary = async (): Promise<PersonalSummaryResponse> => {
  try {
    const response = await api.get('/quote/summary/personal');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch personal summary');
  }
};

export const getTopVotedQuotes = async (): Promise<TopVotedQuotesResponse> => {
  try {
    const response = await api.get('/quote/top-voted');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch top voted quotes');
  }
};