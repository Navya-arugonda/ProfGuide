'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In a real app, you'd make an API call here and get a real token
    const mockUser = { id: userId, name: 'John Doe', avatar: 'https://github.com/shadcn.png' };
    const mockToken = 'mock-jwt-token';
    login(mockUser, mockToken);
    router.push("/")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Login</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
