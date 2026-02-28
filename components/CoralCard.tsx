import Image from 'next/image';
interface CoralProps {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  sellerName?: string; 
}

export default function CoralCard({ name, price, category, imageUrl, sellerName }: CoralProps) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all group">
      <div className="relative h-48">
        <Image 
          src={imageUrl} 
          alt={name} 
          fill 
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white">{name}</h3>
          <span className="text-cyan-400 font-bold">${price}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase">
            {category}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-cyan-900 flex items-center justify-center text-[10px] text-cyan-200 uppercase">
              {sellerName?.[0] || '?'}
            </div>
            <span className="text-xs text-slate-500">{sellerName || 'Guest'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}