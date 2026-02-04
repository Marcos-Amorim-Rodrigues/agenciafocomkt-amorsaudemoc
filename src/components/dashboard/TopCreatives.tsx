import { useState } from 'react';
import { Trophy, MessageCircle, Eye, DollarSign, X, Users, TrendingUp } from 'lucide-react';
import { AdPerformance, formatCurrency, formatNumber } from '@/lib/csvParser';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TopCreativesProps {
  creatives: AdPerformance[];
}

function CreativeOverlay({ creative, open, onClose }: { creative: AdPerformance | null; open: boolean; onClose: () => void }) {
  if (!creative) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="sr-only">
          <DialogTitle>{creative.adName}</DialogTitle>
        </DialogHeader>
        
        {/* Full Thumbnail */}
        <div className="relative w-full aspect-video bg-secondary/50">
          {creative.thumbnailUrl ? (
            <img
              src={creative.thumbnailUrl}
              alt={creative.adName}
              className="w-full h-full object-contain bg-black/50"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Eye className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Creative Info */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {creative.campaignName.replace(/\[/g, '').replace(/\]/g, ' ').trim()}
            </p>
            <h3 className="text-lg font-semibold">
              {creative.adName.replace(/\[/g, '').replace(/\]/g, ' ').trim()}
            </h3>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Conversões</p>
                <p className="font-bold text-lg">{formatNumber(creative.conversions)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="p-2 rounded-lg bg-dashboard-success/10">
                <DollarSign className="h-5 w-5 text-dashboard-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CPA</p>
                <p className="font-bold text-lg">
                  {creative.costPerConversion > 0 ? formatCurrency(creative.costPerConversion) : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="p-2 rounded-lg bg-dashboard-warning/10">
                <DollarSign className="h-5 w-5 text-dashboard-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Investido</p>
                <p className="font-bold text-lg">{formatCurrency(creative.spend)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="p-2 rounded-lg bg-dashboard-info/10">
                <Eye className="h-5 w-5 text-dashboard-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Impressões</p>
                <p className="font-bold text-lg">{formatNumber(creative.impressions)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="p-2 rounded-lg bg-secondary">
                <Users className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Alcance</p>
                <p className="font-bold text-lg">{formatNumber(creative.reach)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Engajamento</p>
                <p className="font-bold text-lg">{formatNumber(creative.engagement)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreativeCard({ creative, rank, onClick }: { creative: AdPerformance; rank: number; onClick: () => void }) {
  const rankColors = {
    1: 'border-primary ring-2 ring-primary/20',
    2: 'border-dashboard-info/50',
    3: 'border-dashboard-success/50',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card rounded-xl overflow-hidden animate-fade-in hover:scale-[1.02] transition-all cursor-pointer hover:ring-2 hover:ring-primary/30",
        rankColors[rank as keyof typeof rankColors] || 'border-border/50'
      )}
      style={{ animationDelay: `${500 + rank * 100}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-secondary/50 overflow-hidden">
        {creative.thumbnailUrl ? (
          <img
            src={creative.thumbnailUrl}
            alt={creative.adName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Eye className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}

        {/* Rank Badge */}
        <div className={cn(
          "absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
          rank === 1
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary/90 text-foreground'
        )}>
          {rank === 1 ? <Trophy className="h-4 w-4" /> : `#${rank}`}
        </div>

        {/* Click indicator */}
        <div className="absolute inset-0 bg-primary/0 hover:bg-primary/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <span className="text-xs font-medium bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full">
            Ver detalhes
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground truncate mb-1" title={creative.campaignName}>
          {creative.campaignName.replace(/\[/g, '').replace(/\]/g, ' ').trim().slice(0, 40)}
        </p>
        <h4 className="font-semibold text-sm line-clamp-2 mb-4 min-h-[2.5rem]" title={creative.adName}>
          {creative.adName.replace(/\[/g, '').replace(/\]/g, ' ').trim()}
        </h4>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Conversões</p>
              <p className="font-semibold text-sm">{formatNumber(creative.conversions)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-dashboard-success" />
            <div>
              <p className="text-xs text-muted-foreground">CPA</p>
              <p className="font-semibold text-sm">
                {creative.costPerConversion > 0 ? formatCurrency(creative.costPerConversion) : '-'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-dashboard-info" />
            <div>
              <p className="text-xs text-muted-foreground">Impressões</p>
              <p className="font-semibold text-sm">{formatNumber(creative.impressions)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-dashboard-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Investido</p>
              <p className="font-semibold text-sm">{formatCurrency(creative.spend)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopCreatives({ creatives }: TopCreativesProps) {
  const [selectedCreative, setSelectedCreative] = useState<AdPerformance | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Criativos Campeões
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Clique em um criativo para ver detalhes completos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creatives.map((creative, index) => (
          <CreativeCard
            key={creative.adName}
            creative={creative}
            rank={index + 1}
            onClick={() => setSelectedCreative(creative)}
          />
        ))}
      </div>

      {creatives.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Nenhum criativo com conversões encontrado no período selecionado
        </div>
      )}

      <CreativeOverlay
        creative={selectedCreative}
        open={!!selectedCreative}
        onClose={() => setSelectedCreative(null)}
      />
    </div>
  );
}
