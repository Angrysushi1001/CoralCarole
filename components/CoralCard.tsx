import Image from 'next/image';

interface CoralProps {
  name: string;
  price: number;
  category: string;
  lighting: string;
  isLFS: boolean;
  imageUrl: string;
}

export default function CoralCard({ name, price, category, lighting, isLFS, imageUrl }: CoralProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
      {/* Image Container */}
      <div className="aspect-square relative w-full overflow-hidden bg-slate-800">
        <Image 
          src={imageUrl || 'https://via.placeholder.com/400'} 
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* LFS Badge Overlay */}
        {isLFS && (
          <div className="absolute top-2 left-2 rounded-full bg-cyan-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
            LFS Verified
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-100">{name}</h3>
          <span className="text-xl font-bold text-cyan-400">${price}</span>
        </div>
        
        <div className="mt-3 flex gap-2">
          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400 uppercase">
            {category}
          </span>
          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
            💡 {lighting} Light
          </span>
        </div>

        <button className="mt-4 w-full rounded-lg bg-cyan-600 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-500">
          Contact Seller
        </button>
      </div>
    </div>
  );
}