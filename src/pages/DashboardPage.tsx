import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuoteStatsChart from "@/components/quotes/QuoteStatsChart";
import Header from "@/layout/Header";
import {
  Quote,
  Activity,
  Award,
  Zap,
  Plus,
  Eye,
  Sparkles,
  Heart,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboard";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { personalSummary, hasError, refetchAll, isLoadingPersonal } =
    useDashboardData();

  const formatRanking = (rank: number | null | undefined) => {
    if (rank === null || rank === undefined) return "Unranked";
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300">
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome back, {user?.name}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Your Quote{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Track your progress, discover new quotes, and engage with the
              community
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link to="/add-quote">
                <Button
                  size="lg"
                  className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Quote
                </Button>
              </Link>
              <Link to="/quote/list">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Browse All Quotes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {hasError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-600 dark:text-red-400">
                  Failed to load dashboard data
                </div>
              </div>
              <Button
                onClick={refetchAll}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Total Quotes
                  </p>
                  {isLoadingPersonal ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      <span className="text-sm text-blue-500">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {personalSummary?.total_quotes_created || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Total Votes
                  </p>
                  {isLoadingPersonal ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      <span className="text-sm text-red-500">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                      {personalSummary?.total_votes_received || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-red-500 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    Rank
                  </p>
                  {isLoadingPersonal ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                      <span className="text-sm text-amber-500">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                      {formatRanking(personalSummary?.ranking)}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-amber-500 rounded-full">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Chart - Takes up 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            <QuoteStatsChart />
          </div>

          {/* Sidebar - Takes up 1 column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/add-quote" className="block">
                  <Button
                    variant="outline"
                    className="cursor-pointer w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:border-blue-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Quote
                  </Button>
                </Link>
                <Link to="/" className="block">
                  <Button
                    variant="outline"
                    className="cursor-pointer w-full justify-start hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 dark:hover:from-green-900/20 dark:hover:to-blue-900/20 hover:border-green-300 hover:text-green-700 dark:hover:text-green-300 transition-all duration-200"
                  >
                    <Quote className="w-4 h-4 mr-2" />
                    Browse Quotes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            {personalSummary?.category_distribution && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span>Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {personalSummary.category_distribution.length > 0 ? (
                    <div className="space-y-3">
                      {personalSummary.category_distribution
                        .slice(0, 5)
                        .map((category) => (
                          <div
                            key={category.category}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {category.category}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {category.count}
                              </span>
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                  style={{ width: `${category.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                                {category.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      You haven't created any quotes in these categories yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
