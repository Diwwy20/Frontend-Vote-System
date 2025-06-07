import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
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
  Edit3,
  Plus,
  X,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { SubmitButton } from "@/components/common/SubmitButton";
import { useQuoteEdit } from "@/hooks/useQuote";
import toast from "react-hot-toast";

interface EditQuoteFormData {
  content: string;
  author: string;
  category: string;
  tags: string[];
}

const CATEGORIES = [
  "motivation",
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

const EditQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // ใช้ custom hook สำหรับจัดการข้อมูล quote
  const {
    quote,
    isLoading: isLoadingQuote,
    isError,
    error,
    updateQuote,
    isUpdating,
    refetchQuote,
  } = useQuoteEdit(id || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<EditQuoteFormData>({
    mode: "onChange",
    defaultValues: {
      content: "",
      author: "",
      category: "",
      tags: [],
    },
  });

  const watchedContent = watch("content");
  const watchedCategory = watch("category");
  const watchedAuthor = watch("author");

  console.log("WatchedCategory: ", watchedCategory);
  console.log("Quote data: ", quote);

  // Load quote data และ populate form เมื่อข้อมูลโหลดเสร็จ
  useEffect(() => {
    if (quote) {
      console.log("Setting form values:", quote);

      // ใช้ setTimeout เพื่อให้แน่ใจว่า component render เสร็จแล้ว
      setTimeout(() => {
        reset({
          content: quote.content || "",
          author: quote.author || "",
          category: quote.category || "",
          tags: quote.tags || [],
        });
        setTags(quote.tags || []);
      }, 100);
    }
  }, [quote, reset]);

  // Reset form เมื่อเริ่มต้น
  useEffect(() => {
    return () => {
      reset();
      setTags([]);
      setCurrentTag("");
    };
  }, [reset]);

  const onSubmit = async (data: EditQuoteFormData) => {
    if (!id) {
      toast.error("Quote ID is missing");
      return;
    }

    try {
      const updateData = {
        content: data.content,
        author: data.author,
        category: data.category,
        tags: tags,
      };

      await updateQuote(id, updateData);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error updating quote:", error);
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

  const resetForm = () => {
    if (quote) {
      reset({
        content: quote.content || "",
        author: quote.author || "",
        category: quote.category || "",
        tags: quote.tags || [],
      });
      setTags(quote.tags || []);
      setCurrentTag("");
    }
  };

  // Loading state
  if (isLoadingQuote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading quote...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Quote
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error?.message || "Failed to load quote data"}
          </p>
          <div className="flex space-x-3 justify-center">
            <Button
              onClick={() => refetchQuote()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ถ้าไม่มี quote หรือ ID ไม่ถูกต้อง
  if (!quote || !id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quote Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The quote you're looking for doesn't exist or has been deleted.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Back to Quote List
          </Button>
        </div>
      </div>
    );
  }

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
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Quote
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your quote and share it with the community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  })}
                  placeholder="Enter your inspiring quote here..."
                  className="min-h-[120px] bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
                {errors.content && (
                  <p className="text-sm text-red-500">
                    {errors.content.message}
                  </p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {watchedContent?.length || 0} characters
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
                  })}
                  placeholder="Who said this quote?"
                  className="bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.author && (
                  <p className="text-sm text-red-500">
                    {errors.author.message}
                  </p>
                )}
              </div>

              {/* Category - Fixed with Controller */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Category className="w-4 h-4" />
                  <span>Category *</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => {
                    console.log("Controller field value:", field.value);
                    return (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => {
                          console.log("Select onValueChange:", value);
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className="bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.replace(/\b\w/g, (char) =>
                                char.toUpperCase()
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
                {watchedCategory && (
                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-0">
                    {watchedCategory.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )}
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
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!currentTag.trim()}
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
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add relevant tags to help others discover your quote
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
                    <Badge className="mt-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-0">
                      {watchedCategory}
                    </Badge>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-between space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/quote/list")}
                  className="px-6"
                >
                  Cancel
                </Button>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="px-6"
                  >
                    Reset
                  </Button>
                  <SubmitButton
                    text="Update Quote"
                    isLoading={isUpdating}
                    className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditQuotePage;
