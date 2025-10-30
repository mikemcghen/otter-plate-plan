import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Flame, Award, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Post = {
  id: string;
  image: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    streak: number;
    badges: string[];
  };
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  likes: number;
  comments: Array<{
    author: string;
    avatar: string;
    text: string;
  }>;
  isLiked?: boolean;
  isSaved?: boolean;
};

type PostModalProps = {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
};

export const PostModal = ({ post, isOpen, onClose }: PostModalProps) => {
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [isSaved, setIsSaved] = useState(post?.isSaved || false);
  const [showComments, setShowComments] = useState(false);

  if (!post) return null;

  const reactions = [
    { emoji: "❤️", label: "Love", count: 24 },
    { emoji: "💬", label: "Comment", count: 8 },
    { emoji: "🌊", label: "Wave", count: 12 },
    { emoji: "🦦", label: "Ottr", count: 5 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 max-h-[90vh] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-muted">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 space-y-5">
            {/* Title & Description */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            </div>

            {/* Macros */}
            {post.macros && (
              <div className="grid grid-cols-4 gap-3 p-4 bg-muted/50 rounded-2xl">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Protein</p>
                  <p className="text-sm font-bold text-primary">{post.macros.protein}g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                  <p className="text-sm font-bold text-accent">{post.macros.carbs}g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Fat</p>
                  <p className="text-sm font-bold text-success">{post.macros.fat}g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Calories</p>
                  <p className="text-sm font-bold text-foreground">{post.macros.calories}</p>
                </div>
              </div>
            )}

            {/* Reactions */}
            <div className="flex items-center gap-2 flex-wrap">
              {reactions.map((reaction) => (
                <button
                  key={reaction.label}
                  className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm"
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground">{reaction.count}</span>
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className="flex-1"
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </Button>
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
                className="flex-1"
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save Recipe"}
              </Button>
            </div>

            {/* Author Card */}
            <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border-2 border-primary/20">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-12 h-12 border-2 border-border">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">{post.author.name}</h3>
                  <p className="text-xs text-muted-foreground">Level {post.author.level} • Snack Sharer</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-streak" />
                  <span className="font-medium text-foreground">{post.author.streak} day streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-foreground">{post.author.badges.length} badges</span>
                </div>
              </div>

              {/* Badges */}
              {post.author.badges.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {post.author.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div>
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors mb-3"
              >
                <MessageCircle className="w-4 h-4" />
                {post.comments.length} comments
              </button>

              {showComments && (
                <div className="space-y-3 animate-fade-in">
                  {post.comments.map((comment, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-muted/30 rounded-xl">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground mb-1">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
