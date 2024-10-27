import { ProfessorSearch } from '@/components/ProfessorSearch'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center p-24">
        <h1 className="text-4xl font-bold mb-8">ProfGuide</h1>
        <div className="w-full max-w-4xl">
          <ProfessorSearch />
        </div>
      </main>
    </div>
  )
}
