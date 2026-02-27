import { createClient } from '@/utils/supabase'; 
import CoralCard from '@/components/CoralCard';

export default async function Home() {
  const supabase = createClient();
  
  // Fetch data from our 'listings' table
  // We use await here because this is a Server Component
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*');

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p>Error loading corals: {error.message}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <header className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Singapore Reef Market
        </h1>
        <p className="text-slate-400 mt-2">Premium marine livestock from local hobbyists and verified shops.</p>
      </header>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings && listings.length > 0 ? (
          listings.map((coral) => (
            <CoralCard 
              key={coral.id}
              name={coral.title}
              price={coral.price}
              category={coral.category}
              lighting={coral.lighting}
              isLFS={coral.is_lfs_verified}
              imageUrl={coral.image_url}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-slate-500 py-20 border-2 border-dashed border-slate-800 rounded-xl">
            No corals listed yet. Be the first to frag!
          </p>
        )}
      </div>
    </main>
  );
}