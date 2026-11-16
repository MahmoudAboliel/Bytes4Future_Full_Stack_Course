import mongoose from 'mongoose';

/**
 * BusModel Schema
 * 
 * Note on schema extension:
 * Added `category`, `size`, and `totalBusesCount` to fulfill the bus model management
 * specifications while preserving the original `title`, `capacity`, and `layoutDetails`.
 * In Mongoose, schema strict mode discards any fields not explicitly defined in the schema.
 * Therefore, adding category, size, and totalBusesCount (with a non-negative min validator)
 * and a unique compound index on (category, size) is necessary to persist these attributes,
 * enforce fleet counts, and prevent duplicate bus model specifications.
 */
const busModelSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['first_class', 'business_class', 'economy_class'],
      message: 'Category must be one of: first_class, business_class, economy_class'
    },
    trim: true
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: {
      values: ['large', 'medium'],
      message: 'Size must be one of: large, medium'
    },
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required']
  },
  totalBusesCount: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total buses count cannot be negative']
  },
  layoutDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Layout details are required']
  }
}, { timestamps: true });

// Prevent duplicate models for the same category and size
busModelSchema.index({ category: 1, size: 1 }, { unique: true });

// Auto-generate title if not explicitly provided
busModelSchema.pre('validate', function(next) {
  if (!this.title && this.category && this.size) {
    const format = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    this.title = `${format(this.category)} (${format(this.size)})`;
  }
  next();
});

export const BusModel = mongoose.model('BusModel', busModelSchema);

