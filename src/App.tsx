import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { LoginScreen } from "./components/LoginScreen";
import {
  SignupScreen,
  SignupData,
} from "./components/SignupScreen";
import { SetupScreen } from "./components/SetupScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { RecommendationScreen } from "./components/RecommendationScreen";
import {
  ProfileDialog,
  ProfileData,
} from "./components/ProfileDialog";
import {
  LanguageProvider,
  useLanguage,
} from "./contexts/LanguageContext";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import {
  projectId,
  publicAnonKey,
} from "./utils/supabase/info";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { getSupabaseClient } from "./utils/supabase/client";

interface Device {
  id: string;
  name: string;
  watt: string;
  hours: string;
}

interface SetupData {
  powerCategory: string;
  kwhPrice: string;
  monthlyBill: string;
  devices: Device[];
}

type Screen =
  | "login"
  | "signup"
  | "setup"
  | "dashboard"
  | "recommendations"
  | "reports";

interface UserAccount {
  email: string;
  password: string;
  profile: ProfileData;
}

// Demo/Shadow Account for testing
const DEMO_ACCOUNT = {
  email: "test@gmail.com",
  password: "test123",
  profile: {
    name: "Demo User",
    email: "test@gmail.com",
    company: "PT. Demo Indonesia",
    phone: "08123456789",
  },
  setupData: {
    powerCategory: "900 VA",
    kwhPrice: "1352",
    monthlyBill: "350000",
    devices: [
      {
        id: "1",
        name: "AC Ruang Tamu",
        watt: "750",
        hours: "8",
      },
      {
        id: "2",
        name: "TV",
        watt: "150",
        hours: "6",
      },
      {
        id: "3",
        name: "Komputer",
        watt: "300",
        hours: "10",
      },
      {
        id: "4",
        name: "Lampu LED (Total)",
        watt: "100",
        hours: "12",
      },
    ],
  },
};

function AppContent() {
  const { t } = useLanguage();
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("login");
  const [setupData, setSetupData] = useState<SetupData | null>(
    null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showProfileDialog, setShowProfileDialog] =
    useState(false);
  const [userAccount, setUserAccount] =
    useState<UserAccount | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    null,
  );
  const [authError, setAuthError] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isSignupLoading, setIsSignupLoading] =
    useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] =
    useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  const handleSignup = async (data: SignupData) => {
    // Prevent double submission
    if (isSignupLoading) return;

    setAuthError(""); // Clear previous errors
    setIsSignupLoading(true); // Start loading

    try {
      // Call Supabase signup endpoint
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7c7b6658/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            name: data.name,
            company: data.company,
            phone: data.phone,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Signup failed:", result);

        // Handle specific error cases
        if (result.errorCode === "USER_EXISTS") {
          // User already exists - set error message in the form
          setAuthError(
            "This email is already registered. Please login instead or use a different email.",
          );
          toast.error(t("toast.emailExists"), {
            description: t("toast.emailExistsDesc"),
            action: {
              label: t("toast.goToLogin"),
              onClick: () => {
                setAuthError("");
                setCurrentScreen("login");
              },
            },
          });
          return;
        }

        // Generic error
        const errorMessage =
          result.error ||
          "Unknown error occurred. Please try again.";
        setAuthError(errorMessage);
        toast.error(t("toast.signupFailed"), {
          description: errorMessage,
        });
        return;
      }

      console.log("✅ User signed up successfully:", result);

      // After signup, automatically sign in to get access token
      const supabaseClient = getSupabaseClient();
      const { data: signInData, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (signInError || !signInData.session) {
        console.log(
          `⚠️ User created but auto-login failed: ${signInError?.message}`,
        );
        // Still continue since user was created successfully
      } else {
        // Store the access token for later use
        setAccessToken(signInData.session.access_token);
        console.log("✅ Access token obtained after signup");
      }

      // Store user account with profile data (in-memory)
      const newAccount: UserAccount = {
        email: data.email,
        password: data.password,
        profile: {
          name: data.name,
          email: data.email,
          company: data.company,
          phone: data.phone,
        },
      };

      setUserAccount(newAccount);
      setProfileData(newAccount.profile);
      setIsAuthenticated(true);
      setAuthError("");

      // DEBUG: Log before showing toast
      console.log("🍞 About to show toast notification...");

      // Show success toast with translation
      toast.success(
        t("toast.welcome").replace("{{name}}", data.name),
        {
          description: t("toast.accountCreated"),
          duration: 3000, // Show for 3 seconds
        },
      );

      console.log("🍞 Toast.success() called");

      // Navigate to setup after toast is visible for 3 seconds
      setTimeout(() => {
        console.log("🚀 Navigating to setup screen...");
        setCurrentScreen("setup");
      }, 3000); // Wait 3 seconds before navigation
    } catch (error) {
      console.error("❌ Error during signup:", error);
      toast.error(t("toast.connectionError"), {
        description: t("toast.networkError"),
      });
      setAuthError(t("toast.networkError"));
    } finally {
      setIsSignupLoading(false);
    }
  };

  const handleLogin = async (
    email: string,
    password: string,
  ) => {
    // Prevent double submission
    if (isLoginLoading) return;

    setLoginError(""); // Clear previous login errors
    setIsLoginLoading(true); // Start loading

    try {
      // Check for demo account first
      if (
        email === DEMO_ACCOUNT.email &&
        password === DEMO_ACCOUNT.password
      ) {
        // Auto-login with demo account and pre-populated data
        setUserAccount({
          email: DEMO_ACCOUNT.email,
          password: DEMO_ACCOUNT.password,
          profile: DEMO_ACCOUNT.profile,
        });
        setProfileData(DEMO_ACCOUNT.profile);
        setSetupData(DEMO_ACCOUNT.setupData);
        setIsAuthenticated(true);
        setIsSetupComplete(true);

        toast.success(t("toast.welcomeBack"), {
          description: t("toast.loggedInAs").replace(
            "{{name}}",
            DEMO_ACCOUNT.profile.name,
          ),
          duration: 3000, // Show for 3 seconds
        });

        // Navigate to dashboard after toast is visible for 3 seconds
        setTimeout(() => {
          setCurrentScreen("dashboard");
          setIsLoginLoading(false); // Reset loading after navigation
        }, 3000); // Wait 3 seconds before navigation
        return;
      }

      // Call Supabase signin endpoint
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7c7b6658/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.error || "Invalid email or password";
        setLoginError(errorMessage);
        toast.error(t("toast.loginFailed"), {
          description: errorMessage,
        });
        console.error("Login failed:", result.error);
        setIsLoginLoading(false); // Reset loading on error
        return;
      }

      // Store session and user data
      const user = result.user;
      const session = result.session;

      setAccessToken(session.access_token);
      setUserAccount({
        email: user.email,
        password: "", // Don't store password in memory
        profile: {
          name: user.user_metadata?.name || "",
          email: user.email,
          company: user.user_metadata?.company || "",
          phone: user.user_metadata?.phone || "",
        },
      });
      setProfileData({
        name: user.user_metadata?.name || "",
        email: user.email,
        company: user.user_metadata?.company || "",
        phone: user.user_metadata?.phone || "",
      });
      setIsAuthenticated(true);
      setLoginError(""); // Clear error on success

      const userName = user.user_metadata?.name || user.email;
      toast.success(t("toast.welcomeBack"), {
        description: t("toast.loggedInAs").replace(
          "{{name}}",
          userName,
        ),
        duration: 3000, // Show for 3 seconds
      });

      console.log("✅ User logged in successfully:", user);

      // Fetch user's setup data from database
      try {
        const setupResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7c7b6658/user/setup`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );

        if (setupResponse.ok) {
          const setupResult = await setupResponse.json();
          if (setupResult.success && setupResult.setupData) {
            console.log(
              "✅ User setup data loaded from database",
            );
            setSetupData(setupResult.setupData);
            setIsSetupComplete(true);
          }
        }
      } catch (error) {
        console.log("⚠️ Could not fetch setup data:", error);
      }

      // Navigate after toast is visible for 3 seconds
      setTimeout(() => {
        // If setup was completed before, go to dashboard, otherwise go to setup
        if (isSetupComplete && setupData) {
          setCurrentScreen("dashboard");
        } else {
          setCurrentScreen("setup");
        }
        setIsLoginLoading(false); // Reset loading after navigation
      }, 3000); // Wait 3 seconds before navigation
    } catch (error) {
      console.error("❌ Error during login:", error);
      toast.error(t("toast.connectionError"), {
        description: t("toast.networkError"),
      });
      setLoginError(t("toast.networkError"));
      setIsLoginLoading(false); // Reset loading on error
    }
  };

  const handleSetupComplete = async (data: SetupData) => {
    setSetupData(data);
    setIsSetupComplete(true);

    // Save setup data to Supabase if user is authenticated
    if (accessToken) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7c7b6658/user/setup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
          },
        );

        if (response.ok) {
          console.log("✅ Setup data saved to database");
          toast.success(
            t("toast.dataSaved") || "Data saved successfully",
            {
              description:
                t("toast.dataSavedDesc") ||
                "Your electricity setup has been saved",
            },
          );
        } else {
          const result = await response.json();
          console.error(
            "⚠️ Failed to save setup data:",
            result.error,
          );
          toast.warning(
            t("toast.dataSaveWarning") ||
              "Setup completed but not saved",
            {
              description:
                t("toast.dataSaveWarningDesc") ||
                "You can continue using the app",
            },
          );
        }
      } catch (error) {
        console.error("⚠️ Error saving setup data:", error);
        toast.warning(
          t("toast.dataSaveWarning") ||
            "Setup completed but not saved",
          {
            description:
              t("toast.dataSaveWarningDesc") ||
              "You can continue using the app",
          },
        );
      }
    }

    setCurrentScreen("dashboard");
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleReset = async () => {
    // Delete setup data from Supabase if user is authenticated
    if (accessToken) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7c7b6658/user/setup`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.ok) {
          console.log("✅ Setup data deleted from database");
        }
      } catch (error) {
        console.error("⚠️ Error deleting setup data:", error);
      }
    }

    setSetupData(null);
    setIsSetupComplete(false);
    setCurrentScreen("setup");
  };

  const handleOpenProfile = () => {
    setShowProfileDialog(true);
  };

  const handleSaveProfile = async (data: ProfileData) => {
    setProfileData(data);

    // Update user account profile
    if (userAccount) {
      setUserAccount({
        ...userAccount,
        profile: data,
      });
    }

    // Save profile data to Supabase if user is authenticated
    if (accessToken) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7c7b6658/user/profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
          },
        );

        if (response.ok) {
          console.log("✅ Profile data saved to database");
          toast.success(
            t("toast.profileSaved") ||
              "Profile saved successfully",
            {
              description:
                t("toast.profileSavedDesc") ||
                "Your profile has been updated",
            },
          );
        } else {
          const result = await response.json();
          console.error(
            "⚠️ Failed to save profile data:",
            result.error,
          );
          toast.warning(
            t("toast.profileSaveWarning") ||
              "Profile updated locally",
            {
              description:
                t("toast.profileSaveWarningDesc") ||
                "Changes may not be saved to server",
            },
          );
        }
      } catch (error) {
        console.error("⚠️ Error saving profile data:", error);
        toast.warning(
          t("toast.profileSaveWarning") ||
            "Profile updated locally",
          {
            description:
              t("toast.profileSaveWarningDesc") ||
              "Changes may not be saved to server",
          },
        );
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen("login");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToSignup={() => {
              setAuthError(""); // Clear error when navigating to signup
              setLoginError(""); // Clear login error
              setCurrentScreen("signup");
            }}
            loginError={loginError}
            isLoading={isLoginLoading}
          />
        );
      case "signup":
        return (
          <SignupScreen
            onSignup={handleSignup}
            onNavigateToLogin={() => {
              setAuthError(""); // Clear error when navigating to login
              setLoginError(""); // Clear login error
              setCurrentScreen("login");
            }}
            authError={authError}
            isLoading={isSignupLoading}
          />
        );
      case "setup":
        return (
          <SetupScreen
            onComplete={handleSetupComplete}
            existingData={setupData}
          />
        );
      case "dashboard":
        return (
          <DashboardScreen
            onNavigateToRecommendations={() =>
              setCurrentScreen("recommendations")
            }
            onEditProfile={handleOpenProfile}
            profileData={profileData}
            setupData={setupData}
          />
        );
      case "recommendations":
        return <RecommendationScreen />;
      case "reports":
        return (
          <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-gray-900 mb-4">Laporan</h1>
              <p className="text-gray-600">
                Fitur laporan akan segera hadir.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToSignup={() =>
              setCurrentScreen("signup")
            }
          />
        );
    }
  };

  return (
    <div className="flex">
      {isAuthenticated && (
        <>
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            isSetupComplete={isSetupComplete}
            onReset={handleReset}
            onLogout={handleLogout}
            userName={profileData.name}
          />
          <MobileNav
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onReset={handleReset}
            onLogout={handleLogout}
            userName={profileData.name}
          />
        </>
      )}
      <main
        className={
          isAuthenticated
            ? "flex-1 w-full lg:ml-64"
            : "flex-1 w-full"
        }
      >
        {renderScreen()}
      </main>

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        profileData={profileData}
        onSave={handleSaveProfile}
      />
      <LanguageSwitcher />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}