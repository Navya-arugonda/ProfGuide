'use client';

import { useState, useEffect, useCallback } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { RatingForm } from "@/components/RatingForm"

interface ProfessorDetails {
  id: string;
  name: string;
  department: string;
  university: string;
  courses: { id: string; name: string }[];
  averageRating: string;
  numberOfRatings: number;
  topTags: string[];
}

interface Rating {
  id: string;
  rating: number;
  review: string;
  course_name: string;
  date: string;
  userId: string;
  grade: string;
  course_type: 'online' | 'offline';
}

const chartConfig = [
  { key: "awesome", label: "Awesome", color: "hsl(var(--chart-1))" },
  { key: "great", label: "Great", color: "hsl(var(--chart-2))" },
  { key: "good", label: "Good", color: "hsl(var(--chart-3))" },
  { key: "ok", label: "OK", color: "hsl(var(--chart-4))" },
  { key: "awful", label: "Awful", color: "hsl(var(--chart-5))" },
];

export function ProfessorProfile({ professorId }: { professorId: string }) {
  const [professor, setProfessor] = useState<ProfessorDetails | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('overall');
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState<Record<string, number>>({});
  const router = useRouter();

  const fetchProfessorData = useCallback(async (courseId?: string) => {
    try {
      const url = courseId
        ? `http://localhost:3002/api/professors/${professorId}/details?courseId=${courseId}`
        : `http://localhost:3002/api/professors/${professorId}/details`;
      const response = await fetch(url);
      const data = await response.json();
      setProfessor(data);
    } catch (error) {
      console.error('Error fetching professor data:', error);
    }
  }, [professorId]);

  const fetchRatings = useCallback(async (courseId?: string) => {
    try {
      const url = courseId 
        ? `http://localhost:3002/api/professors/${professorId}/ratings?courseId=${courseId}`
        : `http://localhost:3002/api/professors/${professorId}/ratings`;
      const response = await fetch(url);
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  }, [professorId]);

  const fetchRatingDistribution = useCallback(async (courseId?: string) => {
    try {
      const url = courseId 
        ? `http://localhost:3002/api/professors/${professorId}/rating-distribution?courseId=${courseId}`
        : `http://localhost:3002/api/professors/${professorId}/rating-distribution`;
      const response = await fetch(url);
      const data = await response.json();
      setRatingDistribution(data);
    } catch (error) {
      console.error('Error fetching rating distribution:', error);
    }
  }, [professorId]);

  useEffect(() => {
    fetchProfessorData();
    fetchRatings();
    fetchRatingDistribution();
  }, [fetchProfessorData, fetchRatings, fetchRatingDistribution]);

  useEffect(() => {
    if (selectedCourse !== 'overall') {
      fetchProfessorData(selectedCourse);
      fetchRatings(selectedCourse);
      fetchRatingDistribution(selectedCourse);
    } else {
      fetchProfessorData();
      fetchRatings();
      fetchRatingDistribution();
    }
  }, [selectedCourse, fetchProfessorData, fetchRatings, fetchRatingDistribution]);

  const chartData = chartConfig.map(config => ({
    rating: config.label,
    count: ratingDistribution[config.key] || 0,
    fill: config.color,
  }));

  if (!professor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="default" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Rating
            </Button>
          </SheetTrigger>
          <SheetContent>
            <RatingForm preSelectedProfessorId={professor.id} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">
              <HoverCard>
                <HoverCardTrigger>{professor.name}</HoverCardTrigger>
                <HoverCardContent>
                  <p>Professor {professor.name}</p>
                </HoverCardContent>
              </HoverCard>
            </h1>
            <p className="text-4xl font-bold mt-2">
              {professor.averageRating} <span className="text-2xl font-normal">/ 5</span>
            </p>
            <p className="text-lg mt-2">
              ({professor.numberOfRatings} rating{professor.numberOfRatings !== 1 ? 's' : ''})
            </p>
            <p className="text-lg mt-2">
              Professor in the{' '}
              <HoverCard>
                <HoverCardTrigger className="font-semibold">{professor.department}</HoverCardTrigger>
                <HoverCardContent>
                  <p>{professor.department} Department</p>
                </HoverCardContent>
              </HoverCard>{' '}
              at{' '}
              <HoverCard>
                <HoverCardTrigger className="font-semibold">{professor.university}</HoverCardTrigger>
                <HoverCardContent>
                  <p>{professor.university}</p>
                </HoverCardContent>
              </HoverCard>
            </p>
          </div>

          <div>
            <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select a course
            </label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall</SelectItem>
                {professor.courses && professor.courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Top Tags</h3>
            <div className="flex flex-wrap gap-2">
              {professor.topTags && professor.topTags.length > 0 ? (
                professor.topTags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))
              ) : (
                <span>No tags available</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis
                dataKey="rating"
                type="category"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} label={{ position: 'right' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Individual Ratings</h3>
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Rating: {rating.rating}/5</span>
                <span className="text-sm text-gray-500">{rating.date}</span>
              </div>
              <p className="mb-2">{rating.review}</p>
              <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                <Badge variant="secondary">{rating.grade}</Badge>
                <Badge variant="secondary">{rating.course_type}</Badge>
                <Badge variant="outline">{rating.course_name}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
