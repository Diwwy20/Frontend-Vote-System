import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/layout/Header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateProfile, changePassword } from "@/services/auth/authService";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Save,
  Eye,
  EyeOff,
  Upload,
  AlertCircle,
  CheckCircle,
  Shield,
  Calendar,
  Edit3,
  Loader2,
} from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboard";

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { personalSummary, isLoadingPersonal } = useDashboardData();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please log in to access your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user.name || "",
    avatar: null as File | null,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [messages, setMessages] = useState({
    profile: "",
    password: "",
  });

  const [messageTypes, setMessageTypes] = useState({
    profile: "" as "success" | "error" | "",
    password: "" as "success" | "error" | "",
  });

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      // Update the user data in React Query cache
      queryClient.setQueryData(["user"], response.user);
      setMessages({ ...messages, profile: response.message });
      setMessageTypes({ ...messageTypes, profile: "success" });
      toast.success(response.message);

      // Reset form
      setProfileForm({
        name: response.user.name || "",
        avatar: null,
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessages({ ...messages, profile: "" });
        setMessageTypes({ ...messageTypes, profile: "" });
      }, 3000);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to update profile";
      setMessages({ ...messages, profile: errorMessage });
      setMessageTypes({ ...messageTypes, profile: "error" });
      toast.error(errorMessage);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessages({ ...messages, profile: "" });
        setMessageTypes({ ...messageTypes, profile: "" });
      }, 3000);
    },
  });

  // Password change mutation
  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (response) => {
      setMessages({ ...messages, password: response.message });
      setMessageTypes({ ...messageTypes, password: "success" });
      toast.success(response.message);

      // Reset password form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessages({ ...messages, password: "" });
        setMessageTypes({ ...messageTypes, password: "" });
      }, 3000);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to change password";
      setMessages({ ...messages, password: errorMessage });
      setMessageTypes({ ...messageTypes, password: "error" });
      toast.error(errorMessage);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessages({ ...messages, password: "" });
        setMessageTypes({ ...messageTypes, password: "" });
      }, 3000);
    },
  });

  const handleProfileSubmit = async () => {
    // Validate input
    if (!profileForm.name.trim()) {
      setMessages({ ...messages, profile: "Name is required!" });
      setMessageTypes({ ...messageTypes, profile: "error" });
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("name", profileForm.name.trim());

    if (profileForm.avatar) {
      formData.append("file", profileForm.avatar);
    }

    profileMutation.mutate(formData);
  };

  const handlePasswordSubmit = async () => {
    // Validate input
    if (!passwordForm.currentPassword.trim()) {
      setMessages({ ...messages, password: "Current password is required!" });
      setMessageTypes({ ...messageTypes, password: "error" });
      return;
    }

    if (!passwordForm.newPassword.trim()) {
      setMessages({ ...messages, password: "New password is required!" });
      setMessageTypes({ ...messageTypes, password: "error" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessages({ ...messages, password: "Passwords do not match!" });
      setMessageTypes({ ...messageTypes, password: "error" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessages({
        ...messages,
        password: "Password must be at least 6 characters!",
      });
      setMessageTypes({ ...messageTypes, password: "error" });
      return;
    }

    // Call change password API
    passwordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB!");
      return;
    }

    setProfileForm({ ...profileForm, avatar: file });
    toast.success("Image selected! Click 'Save Changes' to upload.");
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRanking = (rank: number | null | undefined) => {
    if (rank === null || rank === undefined) return "N/A";
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <User className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {profileMutation.isPending && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {user.email}
                  </p>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    {isLoadingPersonal ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        <span className="text-sm text-blue-500">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {personalSummary?.total_quotes_created || 0}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Quotes
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {personalSummary?.total_votes_received || 0}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Votes
                          </div>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {formatRanking(personalSummary?.ranking)}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Rank
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(user.created_at)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Edit3 className="w-4 h-4 text-white" />
                  </div>
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      placeholder="Enter your name"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload New Picture</span>
                      </label>
                      {profileForm.avatar && (
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {profileForm.avatar.name} selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Supported formats: JPG, PNG, GIF. Max size: 5MB
                    </p>
                  </div>

                  {messages.profile && (
                    <div
                      className={`flex items-center space-x-2 p-3 rounded-lg ${
                        messageTypes.profile === "success"
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {messageTypes.profile === "success" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm">{messages.profile}</span>
                    </div>
                  )}

                  <Button
                    onClick={handleProfileSubmit}
                    disabled={profileMutation.isPending}
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span>Change Password</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {messages.password && (
                    <div
                      className={`flex items-center space-x-2 p-3 rounded-lg ${
                        messageTypes.password === "success"
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {messageTypes.password === "success" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm">{messages.password}</span>
                    </div>
                  )}

                  <Button
                    onClick={handlePasswordSubmit}
                    disabled={passwordMutation.isPending}
                    className="cursor-pointer bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
