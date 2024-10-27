'use client';

import { useEffect, useState } from 'react';
import { ProfessorProfile } from '@/components/ProfessorProfile';
import { Loader2 } from 'lucide-react';

export default function ProfessorPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call or any other initialization
    const initPage = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    initPage();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <ProfessorProfile professorId={params.id} />
    </div>
  );
}
