import React, { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { profileAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await profileAPI.getProfile();
        
        setFormData({
          fullName: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          location: userData.location || "",
          bio: userData.bio || ""
        });
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load profile data",
          variant: "destructive",
        });
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await profileAPI.updateProfile(formData);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await profileAPI.updatePassword(securityData.currentPassword, securityData.newPassword);
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <div className="flex justify-center items-center h-64">
            <p>Loading profile data...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback>{formData.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-bold">{formData.fullName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
                <Badge className="mt-2 bg-stockflow-gold">Premium Investor</Badge>
                
                <Separator className="my-4" />
                
                <div className="w-full space-y-4">
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formData.location || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">January 2023</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Stocks Tracked</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">24</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="info">
              <TabsList className="mb-4">
                <TabsTrigger value="info">Personal Info</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          value={formData.fullName} 
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          name="location" 
                          value={formData.location} 
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input 
                          id="bio" 
                          name="bio" 
                          value={formData.bio}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <Button type="submit" className="bg-stockflow-gold hover:bg-stockflow-darkGold" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Update your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          name="currentPassword" 
                          type="password" 
                          value={securityData.currentPassword} 
                          onChange={handleSecurityChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          name="newPassword" 
                          type="password" 
                          value={securityData.newPassword} 
                          onChange={handleSecurityChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword" 
                          type="password" 
                          value={securityData.confirmPassword} 
                          onChange={handleSecurityChange}
                          disabled={isLoading}
                        />
                      </div>
                      <Button type="submit" className="bg-stockflow-gold hover:bg-stockflow-darkGold" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
