'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star } from 'lucide-react';

interface Professor {
  id: string;
  name: string;
  department: string;
  university: string;
}

interface Course {
  id: string;
  name: string;
}

interface RatingFormProps {
  preSelectedProfessorId?: string;
}

export function RatingForm({ preSelectedProfessorId }: RatingFormProps) {
  const { user } = useUser();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string>(preSelectedProfessorId || '');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [courseType, setCourseType] = useState<'online' | 'offline'>('offline');
  const [grade, setGrade] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/professors');
        const data = await response.json();
        setProfessors(data);
      } catch (error) {
        console.error('Error fetching professors:', error);
      }
    };

    fetchProfessors();
  }, []);

  useEffect(() => {
    const fetchProfessorDetails = async () => {
        if (selectedProfessor) {
          try {
            const response = await fetch(`http://localhost:3002/api/professors/${selectedProfessor}/details`);
            const data = await response.json();
            setCourses(data.courses);
            setSelectedCourse('');
          } catch (error) {
            console.error('Error fetching professor details:', error);
          }
        } else {
          setCourses([]);
          setSelectedCourse('');
        }
      }
    fetchProfessorDetails();
  }, [selectedProfessor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (review.length < 20) {
      alert('Review must be at least 20 characters long.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3002/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professor_id: selectedProfessor,
          course_id: selectedCourse,
          user_id: 'user1', // This should be the actual user ID
          rating,
          review,
          course_type: courseType,
          grade,
          email,
        }),
      });
      const data = await response.json();
      console.log('Rating submitted:', data);
      // Reset form or show success message
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="professor">Professor</Label>
        <Select 
          value={selectedProfessor} 
          onValueChange={setSelectedProfessor}
          disabled={!!preSelectedProfessorId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a professor" />
          </SelectTrigger>
          <SelectContent>
            {professors.map((professor) => (
              <SelectItem key={professor.id} value={professor.id}>
                {professor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="course">Course</Label>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.name}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Rating</Label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="review">Review</Label>
        <Textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here (minimum 20 characters)"
          rows={4}
        />
      </div>

      <div>
        <Label>Course Type</Label>
        <RadioGroup value={courseType} onValueChange={(value: 'online' | 'offline') => setCourseType(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">Online</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="offline" id="offline" />
            <Label htmlFor="offline">Offline</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="grade">Grade Received</Label>
        <Input
          id="grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Enter your grade"
        />
      </div>

      <div>
        <Label htmlFor="email">Email for Verification</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <Button type="submit">Submit Rating</Button>
    </form>
  );
}
