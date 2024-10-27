'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RatingForm } from "@/components/RatingForm";

interface Professor {
  id: string;
  name: string;
  department: string;
  university: string;
  averageRating: number;
  numberOfRatings: number;
}

export function ProfessorSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setProfessors([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:3002/api/professors?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setProfessors(data);
    } catch (error) {
      console.error('Error fetching professors:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  const handleProfessorClick = (professorId: string) => {
    router.push(`/professor/${professorId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search for professors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow"
          disabled={isSearching}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          Search
        </Button>
      </div>
      {isSearching ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ul className="space-y-2">
          {professors.map((professor) => (
            <li key={professor.id} className="flex items-center justify-between">
              <div 
                className="flex-grow cursor-pointer hover:bg-[#F5F5F5] transition-colors duration-200 p-1 flex justify-between items-center"
                onClick={() => handleProfessorClick(professor.id)}
              >
                <div>
                  <span className="font-medium">{professor.name}</span>
                  <span className="text-sm text-gray-500 ml-2">{professor.department}, {professor.university}</span>
                </div>
                <span className="text-sm font-semibold">
                  {professor.numberOfRatings > 0
                    ? `${professor.averageRating.toFixed(1)} (${professor.numberOfRatings} rating${professor.numberOfRatings !== 1 ? 's' : ''})` 
                    : 'No ratings yet'}
                </span>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <RatingForm preSelectedProfessorId={professor.id} />
                </SheetContent>
              </Sheet>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
