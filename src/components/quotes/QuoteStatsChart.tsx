import React from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Quote, Loader2, Trophy } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboard";
import { Link } from "react-router-dom";

const COLORS = [
  "#A5D8FF",
  "#D0BFFF",
  "#B9FBC0",
  "#FFE69A",
  "#FFB3C1",
  "#FFD6A5",
  "#CDEAC0",
  "#FFC6FF",
  "#FBC4AB",
  "#C4FFF9",
];

const QuoteStatsChart: React.FC = () => {
  const {
    personalSummary,
    topVotedQuotes,
    isLoadingPersonal,
    isLoadingTopQuotes,
  } = useDashboardData();

  // Transform personalSummary category_distribution to chart data
  const getCategoryData = () => {
    if (!personalSummary?.category_distribution) {
      return [];
    }

    return personalSummary.category_distribution.map((item, index) => ({
      name: item.category.charAt(0).toUpperCase() + item.category.slice(1), // Capitalize first letter
      value: item.percentage,
      color: COLORS[index % COLORS.length],
    }));
  };

  const categoryData = getCategoryData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Category Distribution */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Quote className="w-4 h-4 text-white" />
              </div>
              <span>Category Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPersonal ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">
                  Loading categories...
                </span>
              </div>
            ) : categoryData.length > 0 ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {categoryData.map((category) => (
                    <Badge
                      key={category.name}
                      variant="outline"
                      className="flex items-center space-x-1"
                      style={{ borderColor: category.color }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-500">
                        ({category.value}%)
                      </span>
                    </Badge>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <Quote className="w-8 h-8 mr-2 opacity-50" />
                <span>No category data available</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Quotes */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-amber-500 to-red-600 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span>Top Voted Quotes</span>
            </div>
            <Link
              to="/"
              className="text-sm underline text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingTopQuotes ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">
                  Loading top quotes...
                </span>
              </div>
            ) : (
              topVotedQuotes.map((quote, index) => (
                <div
                  key={quote.id}
                  className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                          : index === 1
                          ? "bg-gradient-to-r from-gray-400 to-gray-600"
                          : "bg-gradient-to-r from-amber-600 to-amber-800"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <blockquote className="text-gray-800 dark:text-gray-200 font-medium mb-1">
                      "{quote.content}"
                    </blockquote>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      — {quote.author}
                      <span className="px-2 py-1 ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        {quote.category.replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        )}
                      </span>
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-0">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        {quote.vote_count}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteStatsChart;
