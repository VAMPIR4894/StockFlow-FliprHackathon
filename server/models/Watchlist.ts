import mongoose from 'mongoose';

interface IWatchlistItem {
  symbol: string;
  companyName: string;
  addedAt?: Date;
}

interface IWatchlist {
  userId: mongoose.Types.ObjectId;
  items: IWatchlistItem[];
}

const watchlistItemSchema = new mongoose.Schema<IWatchlistItem>({
  symbol: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const watchlistSchema = new mongoose.Schema<IWatchlist>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [watchlistItemSchema],
});

// Create a compound index to ensure a user can't add the same stock twice
watchlistSchema.index({ userId: 1, 'items.symbol': 1 }, { unique: true });

export default mongoose.model<IWatchlist>('Watchlist', watchlistSchema); 