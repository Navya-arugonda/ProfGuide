'use client';

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/LoginForm"
import { SignUpForm } from "@/components/SignUpForm"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")

  const handleSignUpSuccess = () => {
    setActiveTab("login")
  }

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
