import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare as QuoteIcon,
  User,
  Tag,
  Folder as Category,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Edit3,
} from "lucide-react";
import { SubmitButton } from "@/components/common/SubmitButton";
import { useNavigate } from "react-router-dom";
import { useQuoteActions } from "@/hooks/useQuote";
import type { CreateQuoteData } from "@/services/quote/quoteService";

interface AddQuoteFormData {
  content: string;
  author: string;
  category: string;
  tags: string[];
}

const CATEGORIES = [
  "Motivation",
  "Life",
  "Wisdom",
  "Dreams",
  "Success",
  "Love",
  "Friendship",
  "Philosophy",
  "Business",
  "Happiness",
];

const AddQuotePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // ใช้ useQuoteActions hook แทน mock API
  const { createQuote, isCreating, createError } = useQuoteActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<AddQuoteFormData>({
    defaultValues: {
      content: "",
      author: "",
      category: "",
      tags: [],
    },
  });

  const watchedContent = watch("content");
  const watchedAuthor = watch("author");
  const watchedCategory = watch("category");

  const onSubmit = async (data: AddQuoteFormData) => {
    setSubmitStatus("idle");

    try {
      // เตรียมข้อมูลสำหรับส่งไป API
      const quoteData: CreateQuoteData = {
        content: data.content,
        author: data.author,
        category: data.category,
        tags: tags, // ใช้ tags state แทน data.tags
      };

      // เรียกใช้ createQuote function จาก useQuoteActions
      await createQuote(quoteData);

      // Reset form หลังจากสร้างสำเร็จ
      reset();
      setTags([]);
      setCurrentTag("");
      setSubmitStatus("success");

      // Auto hide success message หลังจาก 3 วินาที
      setTimeout(() => {
        setSubmitStatus("idle");
        // Navigate กลับไปหน้าหลักหลังจากสร้างสำเร็จ
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating quote:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      const newTags = [...tags, currentTag.trim().toLowerCase()];
      setTags(newTags);
      setValue("tags", newTags);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleCategoryChange = (value: string) => {
    setValue("category", value);
    trigger("category");
  };

  // จัดการ error จาก API
  React.useEffect(() => {
    if (createError) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  }, [createError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                disabled={isCreating}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create New Quote
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share your favorite quotes with the community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Alert */}
      {submitStatus !== "idle" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`p-4 rounded-lg flex items-center space-x-3 ${
              submitStatus === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            {submitStatus === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                submitStatus === "success"
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {submitStatus === "success"
                ? "Quote created successfully! Redirecting..."
                : createError?.message ||
                  "Failed to create quote. Please try again."}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QuoteIcon className="w-5 h-5" />
              <span>Quote Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Quote Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <QuoteIcon className="w-4 h-4" />
                  <span>Quote Content *</span>
                </label>
                <Textarea
                  {...register("content", {
                    required: "Quote content is required",
                    minLength: {
                      value: 10,
                      message: "Quote must be at least 10 characters long",
                    },
                    maxLength: {
                      value: 500,
                      message: "Quote must not exceed 500 characters",
                    },
                  })}
                  placeholder="Enter your inspiring quote here..."
                  className="min-h-[120px] bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  disabled={isCreating}
                />
                {errors.content && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.content.message}</span>
                  </p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {watchedContent?.length || 0}/500 characters
                </div>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Author *</span>
                </label>
                <Input
                  {...register("author", {
                    required: "Author name is required",
                    minLength: {
                      value: 2,
                      message: "Author name must be at least 2 characters long",
                    },
                  })}
                  placeholder="Who said this quote?"
                  className="bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  disabled={isCreating}
                />
                {errors.author && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.author.message}</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Category className="w-4 h-4" />
                  <span>Category *</span>
                </label>
                <Select
                  onValueChange={handleCategoryChange}
                  disabled={isCreating}
                >
                  <SelectTrigger className="bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("category", {
                    required: "Please select a category",
                  })}
                />
                {errors.category && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.category.message}</span>
                  </p>
                )}
                {watchedCategory && (
                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                    {watchedCategory}
                  </Badge>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Tags</span>
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tags (press Enter)"
                    className="flex-1 bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    maxLength={20}
                    disabled={isCreating}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={
                      !currentTag.trim() || tags.length >= 5 || isCreating
                    }
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Display Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 flex items-center space-x-1"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500 transition-colors"
                          disabled={isCreating}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add up to 5 relevant tags to help others discover your quote
                </p>
              </div>

              {/* Preview */}
              {watchedContent && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                    <QuoteIcon className="w-4 h-4" />
                    <span>Preview</span>
                  </h3>
                  <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                    "{watchedContent}"
                  </blockquote>
                  {watchedAuthor && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      — {watchedAuthor}
                    </p>
                  )}
                  {watchedCategory && (
                    <Badge className="mt-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                      {watchedCategory}
                    </Badge>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-gray-50 dark:bg-gray-700/50"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setTags([]);
                    setCurrentTag("");
                    setSubmitStatus("idle");
                  }}
                  className="px-6"
                  disabled={isCreating}
                >
                  Reset
                </Button>
                <SubmitButton
                  text="Create Quote"
                  isLoading={isCreating}
                  type="submit"
                  className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddQuotePage;
