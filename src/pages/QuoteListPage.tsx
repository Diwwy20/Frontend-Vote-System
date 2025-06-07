import {
  Search,
  Filter,
  Heart,
  Calendar,
  ChevronDown,
  Loader2,
  User,
  Edit3,
  Trash2,
  MoreVertical,
  AlertTriangle,
  BookOpen,
  Clock,
  Award,
  X,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useQuoteManagement, useQuoteUtils } from "@/hooks/useQuote";
import type { QuoteFilters } from "@/services/quote/quoteService";
import React, { useMemo, useState, useEffect } from "react";
import Header from "@/layout/Header";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const CATEGORIES = [
  "all",
  "life",
  "wisdom",
  "dreams",
  "success",
  "love",
  "friendship",
  "philosophy",
  "business",
  "happiness",
];

const SORT_OPTIONS = [
  { value: "vote_count", label: "Most Voted", icon: Award },
  { value: "created_at", label: "Most Recent", icon: Clock },
  { value: "author", label: "Author", icon: User },
];

const QuoteListPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"vote_count" | "created_at" | "author">(
    "vote_count"
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const filters: QuoteFilters = useMemo(
    () => ({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      search: searchTerm || undefined,
      sortBy,
      sortOrder: sortBy === "author" ? "ASC" : "DESC",
      page,
      limit,
    }),
    [selectedCategory, searchTerm, sortBy, page, limit]
  );

  const {
    quotes,
    pagination,
    isLoading,
    isError,
    error,
    vote,
    isVoting,
    deleteQuote,
    isDeleting,
    refetchQuotes,
  } = useQuoteManagement(filters);

  const {
    hasUserVoted,
    findCurrentVotedQuote,
    hasVotedOtherQuote,
    getVoteStatus,
  } = useQuoteUtils();

  const isOwnQuote = (quote: any) => {
    return user && quote.user_id === user.id;
  };

  const handleVote = async (quote: any) => {
    if (!user) {
      toast.error("Please log in before voting on a quote.");
      return;
    }

    try {
      const isVoted = hasUserVoted(quote);

      if (!isVoted) {
        const hasVotedOther = hasVotedOtherQuote(quotes, quote.id);

        if (hasVotedOther) {
          const currentVotedQuote = findCurrentVotedQuote(quotes);

          alert(
            `You have already voted for another quote. Please remove your current vote first before voting for a new quote.\n\nCurrently voted quote: "${currentVotedQuote?.content?.substring(
              0,
              50
            )}..."`
          );
          return;
        }
      }

      console.log("🔥 About to vote:", { quoteId: quote.id, isVoted });
      await vote(quote);
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  const handleDeleteClick = (quoteId: string) => {
    setDeleteQuoteId(quoteId);
  };

  const confirmDelete = async () => {
    if (!deleteQuoteId) return;

    try {
      await deleteQuote(deleteQuoteId);
      setDeleteQuoteId(null);
      refetchQuotes();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteQuoteId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const loadMore = () => {
    if (pagination && page < Math.ceil(pagination.total / pagination.limit)) {
      setPage((prev) => prev + 1);
    }
  };

  const hasMore = pagination
    ? page < Math.ceil(pagination.total / pagination.limit)
    : false;

  const handleFilterChange = (newFilters: any) => {
    setPage(1);
    if (newFilters.category !== undefined) {
      const formattedCategory = newFilters.category
        .toLowerCase()
        .split(" ")
        .reverse()
        .join(" ");
      setSelectedCategory(formattedCategory);
    }
    if (newFilters.search !== undefined) setSearchTerm(newFilters.search);
    if (newFilters.sortBy !== undefined) setSortBy(newFilters.sortBy);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("vote_count");
    setPage(1);
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== "all" || sortBy !== "vote_count";

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Quotes
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || "Something went wrong"}
          </p>
          <Button
            onClick={() => refetchQuotes()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <Header />

      {/* Filters */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Clear */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search quotes, authors, or tags..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange({ search: e.target.value });
                }}
                className="pl-10 pr-10 w-full bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange({ search: "" })}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
              {isSearching && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </Button>
            )}
          </div>

          {/* Categories and Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange({ category })}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {category === "all" ? (
                    <BookOpen className="w-3 h-3 mr-1" />
                  ) : null}
                  {category.replace(/\b\w/g, (char) => char.toUpperCase())}
                </Button>
              ))}
            </div>

            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer flex items-center space-x-2 min-w-fit"
                >
                  {React.createElement(
                    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.icon ||
                      Filter,
                    { className: "w-4 h-4" }
                  )}
                  <span className="hidden sm:inline">Sort by:</span>
                  <span>
                    {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleFilterChange({ sortBy: option.value })}
                    className={`cursor-pointer ${
                      sortBy === option.value
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : ""
                    }`}
                  >
                    <option.icon className="w-4 h-4 mr-2" />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Results count */}
          {pagination && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {pagination.total > 0 ? (
                <>
                  Showing {(page - 1) * pagination.limit + 1}-
                  {Math.min(page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} quotes
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== "all" && ` in ${selectedCategory}`}
                </>
              ) : (
                "No quotes found"
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quote Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && page === 1 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading quotes...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quotes.map((quote) => {
                const isOwn = isOwnQuote(quote);
                const voteStatus = getVoteStatus(quote, quotes);
                const isVoted = hasUserVoted(quote);
                return (
                  <Card
                    key={quote.id}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                  >
                    {/* Gradient overlay for own quotes */}
                    {isOwn && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-400/20 to-transparent pointer-events-none" />
                    )}

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-0"
                        >
                          {quote.category.charAt(0).toUpperCase() +
                            quote.category.slice(1).toLowerCase()}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(quote.created_at)}
                          </div>

                          {/* Actions Menu สำหรับคำคมของตัวเอง */}
                          {isOwn && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="cursor-pointer h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  disabled={isDeleting}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/edit-quote/${quote.id}`}
                                    className="flex items-center cursor-pointer"
                                  >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(quote.id)}
                                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 mr-2" />
                                  )}
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <blockquote className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-4 font-medium line-clamp-4">
                        "{quote.content}"
                      </blockquote>

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate flex-1 mr-2">
                          — {quote.author}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          <User className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-20">
                            @{quote.user_name}
                          </span>
                          {isOwn && (
                            <Badge
                              variant="outline"
                              className="ml-2 text-xs px-1 py-0 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {quote.tags && quote.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {quote.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                            >
                              #{tag}
                            </Badge>
                          ))}
                          {quote.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                            >
                              +{quote.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between w-full">
                        {/* ปุ่มโหวต - ซ่อนสำหรับคำคมของตัวเอง */}
                        {!isOwn ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(quote)}
                            disabled={isVoting} // ✅ เอา !user ออก เหลือแค่ isVoting
                            className={`cursor-pointer flex items-center space-x-2 transition-all duration-200 hover:scale-110 ${
                              isVoted
                                ? "text-red-500 hover:text-red-600"
                                : voteStatus.hasVotedOther
                                ? "text-gray-400 cursor-not-allowed opacity-50"
                                : "text-gray-500 hover:text-red-500"
                            }`}
                            title={
                              !user
                                ? "กรุณาเข้าสู่ระบบเพื่อโหวต" // ✅ เพิ่ม tooltip สำหรับคนที่ไม่ได้ login
                                : voteStatus.hasVotedOther
                                ? "You have already voted for another quote. Remove your current vote first."
                                : voteStatus.voteButtonText
                            }
                          >
                            <Heart
                              className={`w-5 h-5 transition-all duration-200 ${
                                isVoted
                                  ? "fill-red-500 text-red-500 scale-110"
                                  : "stroke-current hover:scale-110"
                              } ${
                                voteStatus.hasVotedOther ? "opacity-50" : ""
                              }`}
                            />
                            <span className="text-sm font-medium">
                              {quote.vote_count}
                            </span>

                            {/* ✅ แสดงสถานะการโหวต */}
                            {isVoted && (
                              <span className="text-xs text-red-400 ml-1">
                                Voted
                              </span>
                            )}
                            {voteStatus.hasVotedOther && !isVoted && (
                              <span className="text-xs text-gray-400 ml-1">
                                (Voted elsewhere)
                              </span>
                            )}
                          </Button>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Heart className="w-5 h-5 stroke-current" />
                            <span className="text-sm font-medium">
                              {quote.vote_count}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">
                              (Your quote)
                            </span>
                          </div>
                        )}

                        {quote.voted_users.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                              Voted by:
                            </span>
                            <div className="flex -space-x-2">
                              {quote.voted_users.slice(0, 3).map((voter) => (
                                <img
                                  key={voter.user_id} // ✅ เพิ่ม key prop
                                  src={
                                    voter.user_avatar ||
                                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                  }
                                  alt={voter.user_name}
                                  className="w-6 h-6 bg-blue-300 rounded-full"
                                />
                              ))}
                              {quote.voted_users.length > 3 && (
                                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-bold border-2 border-white dark:border-gray-800">
                                  +{quote.voted_users.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && quotes.length > 0 && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading more quotes...</span>
                    </div>
                  ) : (
                    <>
                      <span>Load More Quotes</span>
                      <span className="ml-2 text-sm opacity-75">
                        ({pagination ? pagination.total - quotes.length : 0}{" "}
                        remaining)
                      </span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Empty state */}
            {quotes.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
                  <Search className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No quotes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your search terms or filters to find more quotes."
                    : "Be the first to share an inspiring quote with the community!"}
                </p>
                {hasActiveFilters ? (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="mr-4"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                ) : (
                  <Link to="/add-quote">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Add Your First Quote
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteQuoteId}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Delete Quote
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this quote? This action cannot be
              undone and will permanently remove the quote from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={cancelDelete}
              disabled={isDeleting}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Quote
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuoteListPage;
