"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { PREFERENCE_OPTIONS } from "@/lib/constants";

export default function PreferencesPage() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handlePreferenceToggle = (preferenceId: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const handleSubmit = async () => {
    if (!user?.id || selectedPreferences.length === 0) return;

    setIsLoading(true);

    try {
      // Call the API route instead of the database function directly
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedPreferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save preferences');
      }

      const result = await response.json();
      console.log('Preferences saved successfully:', result);
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
      // You should add proper error handling here (toast notification, etc.)
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Customize Your Experience
          </h1>
          <p className="text-lg text-gray-600">
            Select your interests to get personalized tool recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {PREFERENCE_OPTIONS.map((option) => (
            <div
              key={option.id}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPreferences.includes(option.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => handlePreferenceToggle(option.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {option.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={selectedPreferences.length === 0 || isLoading}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-all ${
              selectedPreferences.length === 0 || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Saving..." : `Continue with ${selectedPreferences.length} selected`}
          </button>
        </div>
      </div>
    </div>
  );
}