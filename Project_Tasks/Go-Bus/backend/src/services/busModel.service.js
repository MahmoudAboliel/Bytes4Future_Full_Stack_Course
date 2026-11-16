import { BusModel } from '../models/BusModel.model.js';

export const APPROVED_SPECIFICATIONS = {
  first_class: {
    large: { capacity: 45, layoutDetails: '2+1' },
    medium: { capacity: 37, layoutDetails: '2+1' }
  },
  business_class: {
    large: { capacity: 33, layoutDetails: '1+1' },
    medium: { capacity: 27, layoutDetails: '1+1' }
  },
  economy_class: {
    large: { capacity: 22, layoutDetails: 'Economy layout' },
    medium: { capacity: 18, layoutDetails: 'Economy layout' }
  }
};

export const PREDEFINED_BUS_MODELS = [
  {
    category: 'first_class',
    size: 'large',
    capacity: 45,
    layoutDetails: '2+1',
    totalBusesCount: 5
  },
  {
    category: 'first_class',
    size: 'medium',
    capacity: 37,
    layoutDetails: '2+1',
    totalBusesCount: 5
  },
  {
    category: 'business_class',
    size: 'large',
    capacity: 33,
    layoutDetails: '1+1',
    totalBusesCount: 5
  },
  {
    category: 'business_class',
    size: 'medium',
    capacity: 27,
    layoutDetails: '1+1',
    totalBusesCount: 5
  },
  {
    category: 'economy_class',
    size: 'large',
    capacity: 22,
    layoutDetails: 'Economy layout',
    totalBusesCount: 10
  },
  {
    category: 'economy_class',
    size: 'medium',
    capacity: 18,
    layoutDetails: 'Economy layout',
    totalBusesCount: 10
  }
];

export const validateBusModelInput = (data, isUpdate = false) => {
  const errors = [];

  const { category, size, capacity, totalBusesCount, layoutDetails } = data;

  if (!isUpdate || category !== undefined) {
    if (!category || !['first_class', 'business_class', 'economy_class'].includes(category)) {
      errors.push('Category must be one of: first_class, business_class, economy_class');
    }
  }

  if (!isUpdate || size !== undefined) {
    if (!size || !['large', 'medium'].includes(size)) {
      errors.push('Size must be one of: large, medium');
    }
  }

  // If category and size are present, validate capacity against approved specifications
  const activeCategory = category;
  const activeSize = size;
  const categorySpecs = activeCategory ? APPROVED_SPECIFICATIONS[activeCategory] : null;
  const expectedSpec = categorySpecs && activeSize ? categorySpecs[activeSize] : null;

  if (activeCategory && activeSize && expectedSpec) {
    if (capacity !== undefined && Number(capacity) !== expectedSpec.capacity) {
      errors.push(`Capacity for ${activeCategory} (${activeSize}) must be exactly ${expectedSpec.capacity}`);
    }
    if (!isUpdate && capacity === undefined) {
      // auto-fill capacity if missing
      data.capacity = expectedSpec.capacity;
    }
    if (!isUpdate && !layoutDetails) {
      data.layoutDetails = expectedSpec.layoutDetails;
    }
  } else if (activeCategory && activeSize) {
    errors.push('Invalid category and size combination.');
  }

  if (totalBusesCount !== undefined) {
    if (typeof totalBusesCount !== 'number' || totalBusesCount < 0 || Number.isNaN(totalBusesCount)) {
      errors.push('totalBusesCount must be a non-negative number');
    }
  } else if (!isUpdate) {
    data.totalBusesCount = 0;
  }

  if (layoutDetails !== undefined && (layoutDetails === null || layoutDetails === '')) {
    errors.push('layoutDetails cannot be empty');
  }

  return errors;
};

export const BusModelService = {
  async getAllBusModels() {
    return await BusModel.find().sort({ category: 1, size: 1 });
  },

  async getBusModelById(id) {
    return await BusModel.findById(id);
  },

  async createBusModel(data) {
    const errors = validateBusModelInput(data, false);
    if (errors.length > 0) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.errors = errors;
      throw err;
    }

    // Check duplicate by category & size
    const existing = await BusModel.findOne({ category: data.category, size: data.size });
    if (existing) {
      const err = new Error(`Bus model with category '${data.category}' and size '${data.size}' already exists.`);
      err.statusCode = 409;
      throw err;
    }

    const busModel = new BusModel(data);
    return await busModel.save();
  },

  async updateBusModel(id, data) {
    const errors = validateBusModelInput(data, true);
    if (errors.length > 0) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.errors = errors;
      throw err;
    }

    const busModel = await BusModel.findById(id);
    if (!busModel) {
      const err = new Error('Bus model not found');
      err.statusCode = 404;
      throw err;
    }

    // If category or size is changing, check uniqueness
    const newCategory = data.category !== undefined ? data.category : busModel.category;
    const newSize = data.size !== undefined ? data.size : busModel.size;

    if (newCategory !== busModel.category || newSize !== busModel.size) {
      const existing = await BusModel.findOne({ category: newCategory, size: newSize, _id: { $ne: id } });
      if (existing) {
        const err = new Error(`Bus model with category '${newCategory}' and size '${newSize}' already exists.`);
        err.statusCode = 409;
        throw err;
      }
    }

    // Update fields
    Object.assign(busModel, data);
    return await busModel.save();
  },

  async updateFleetCount(id, totalBusesCount) {
    if (typeof totalBusesCount !== 'number' || totalBusesCount < 0 || Number.isNaN(totalBusesCount)) {
      const err = new Error('totalBusesCount must be a non-negative number');
      err.statusCode = 400;
      throw err;
    }

    const busModel = await BusModel.findById(id);
    if (!busModel) {
      const err = new Error('Bus model not found');
      err.statusCode = 404;
      throw err;
    }

    busModel.totalBusesCount = totalBusesCount;
    return await busModel.save();
  },

  async seedBusModels() {
    const results = [];
    for (const predefined of PREDEFINED_BUS_MODELS) {
      const existing = await BusModel.findOne({ category: predefined.category, size: predefined.size });
      if (existing) {
        // Update existing or keep? "Make sure the seed script does not create duplicate records if executed multiple times."
        // We can upsert or skip existing. Updating or skipping both prevent duplicates. Let's update or ensure existence.
        existing.capacity = predefined.capacity;
        existing.layoutDetails = predefined.layoutDetails;
        if (existing.totalBusesCount === undefined || existing.totalBusesCount === 0) {
          existing.totalBusesCount = predefined.totalBusesCount;
        }
        await existing.save();
        results.push({ action: 'updated', model: existing });
      } else {
        const newModel = new BusModel(predefined);
        await newModel.save();
        results.push({ action: 'created', model: newModel });
      }
    }
    return results;
  }
};
