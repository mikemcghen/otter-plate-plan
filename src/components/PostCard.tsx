import { Heart, MessageCircle, Download, Waves } from "lucide-react";

type PostCardProps = {
  id: string;
  image: string;
  title: string;
  likes: number;
  downloads: number;
  author: {
    name: string;
    avatar: string;
  };
  onClick: () => void;
};

export const PostCard = ({ image, title, likes, downloads, author, onClick }: PostCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-card rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-border cursor-pointer transition-all duration-150 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] active:scale-[0.98]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2">
          {title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2">
          <img 
            src={author.avatar} 
            alt={author.name}
            className="w-6 h-6 rounded-full border border-border"
          />
          <span className="text-xs text-muted-foreground truncate">
            {author.name}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            <span>{downloads}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
