'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// This is a dummy list of universities. Replace with your actual list.
const universities = [
  { value: "harvard", label: "Harvard University" },
  { value: "mit", label: "Massachusetts Institute of Technology" },
  { value: "stanford", label: "Stanford University" },
  // Add more universities as needed
]

export function SignUpForm({ onSignUpSuccess }: { onSignUpSuccess: () => void }) {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [selectedUniversity, setSelectedUniversity] = useState("")
  const [userIdError, setUserIdError] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const router = useRouter()

  const validateUserId = (id: string) => {
    const regex = /^[a-z0-9_]+$/
    if (!regex.test(id)) {
      setUserIdError("User ID can only contain lowercase letters, numbers, and underscores")
      return false
    }
    setUserIdError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateUserId(userId)) return

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Sign up successful", { userId, password, selectedUniversity })
    setShowSuccessDialog(true)
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    onSignUpSuccess() // Switch to Login tab
    // Reset form
    setUserId("")
    setPassword("")
    setSelectedUniversity("")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value)
                  validateUserId(e.target.value)
                }}
                required
              />
              {userIdError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{userIdError}</AlertDescription>
                </Alert>
              )}
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
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Select onValueChange={setSelectedUniversity} value={selectedUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((university) => (
                    <SelectItem key={university.value} value={university.value}>
                      {university.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Sign Up</Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Up Successful</DialogTitle>
          </DialogHeader>
          <p>Your account has been created successfully.</p>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
