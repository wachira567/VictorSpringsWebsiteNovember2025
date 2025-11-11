import { connectToDatabase } from "@/lib/neon";

export interface IProperty {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  county: string;
  lat: number;
  lng: number;
  placeId: string;
  propertyType: "apartment" | "house" | "villa" | "studio" | "penthouse";
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  featured: boolean;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PropertyModel {
  static async find(filter: any = {}, options: any = {}) {
    const client = await connectToDatabase();

    let query = `
      SELECT id, title, description, price, address, city, county, lat, lng, place_id as "placeId",
             property_type as "propertyType", bedrooms, bathrooms, area, amenities, images,
             featured, available, created_at as "createdAt", updated_at as "updatedAt"
      FROM properties WHERE 1=1
    `;

    const values: any[] = [];
    let paramCount = 1;

    // Build WHERE clause
    if (filter.city) {
      query += ` AND (city ILIKE $${paramCount} OR county ILIKE $${paramCount} OR address ILIKE $${paramCount})`;
      values.push(`%${filter.city}%`);
      paramCount++;
    }

    if (filter.county && !filter.city) {
      query += ` AND county ILIKE $${paramCount}`;
      values.push(`%${filter.county}%`);
      paramCount++;
    }

    if (filter.address && !filter.city) {
      query += ` AND address ILIKE $${paramCount}`;
      values.push(`%${filter.address}%`);
      paramCount++;
    }

    if (filter.propertyType) {
      query += ` AND property_type = $${paramCount}`;
      values.push(filter.propertyType);
      paramCount++;
    }

    if (filter.price?.$gte !== undefined) {
      query += ` AND price >= $${paramCount}`;
      values.push(filter.price.$gte);
      paramCount++;
    }

    if (filter.price?.$lte !== undefined) {
      query += ` AND price <= $${paramCount}`;
      values.push(filter.price.$lte);
      paramCount++;
    }

    if (filter.bedrooms?.$gte !== undefined) {
      query += ` AND bedrooms >= $${paramCount}`;
      values.push(filter.bedrooms.$gte);
      paramCount++;
    }

    if (filter.bathrooms?.$gte !== undefined) {
      query += ` AND bathrooms >= $${paramCount}`;
      values.push(filter.bathrooms.$gte);
      paramCount++;
    }

    if (filter.area?.$gte !== undefined) {
      query += ` AND area >= $${paramCount}`;
      values.push(filter.area.$gte);
      paramCount++;
    }

    if (filter.area?.$lte !== undefined) {
      query += ` AND area <= $${paramCount}`;
      values.push(filter.area.$lte);
      paramCount++;
    }

    if (filter.amenities?.$in) {
      query += ` AND amenities ?| $${paramCount}`;
      values.push(filter.amenities.$in);
      paramCount++;
    }

    if (filter.available === true) {
      query += ` AND available = true`;
    }

    if (filter.featured === true) {
      query += ` AND featured = true`;
    }

    if (filter._id?.$ne !== undefined) {
      query += ` AND id != $${paramCount}`;
      values.push(filter._id.$ne);
      paramCount++;
    }

    // Sorting
    if (options.sort) {
      const sortKeys = Object.keys(options.sort);
      if (sortKeys.length > 0) {
        const sortField = sortKeys[0];
        const sortOrder = options.sort[sortField] === -1 ? "DESC" : "ASC";
        const dbField = sortField === "createdAt" ? "created_at" : sortField;
        query += ` ORDER BY ${dbField} ${sortOrder}`;
      }
    } else {
      query += ` ORDER BY created_at DESC`;
    }

    // Pagination
    if (options.skip !== undefined) {
      query += ` OFFSET $${paramCount}`;
      values.push(options.skip);
      paramCount++;
    }

    if (options.limit !== undefined) {
      query += ` LIMIT $${paramCount}`;
      values.push(options.limit);
      paramCount++;
    }

    const result = await client.query(query, values);
    client.release();

    return result.rows.map((row: any) => ({
      ...row,
      amenities: row.amenities || [],
      images: row.images || [],
      location: {
        address: row.address,
        city: row.city,
        county: row.county,
      },
    }));
  }

  static async countDocuments(filter: any = {}) {
    const client = await connectToDatabase();

    let query = `SELECT COUNT(*) as count FROM properties WHERE 1=1`;
    const values: any[] = [];
    let paramCount = 1;

    // Apply same filters as find method
    if (filter.city) {
      query += ` AND (city ILIKE $${paramCount} OR county ILIKE $${paramCount} OR address ILIKE $${paramCount})`;
      values.push(`%${filter.city}%`);
      paramCount++;
    }

    if (filter.county && !filter.city) {
      query += ` AND county ILIKE $${paramCount}`;
      values.push(`%${filter.county}%`);
      paramCount++;
    }

    if (filter.address && !filter.city) {
      query += ` AND address ILIKE $${paramCount}`;
      values.push(`%${filter.address}%`);
      paramCount++;
    }

    if (filter.propertyType) {
      query += ` AND property_type = $${paramCount}`;
      values.push(filter.propertyType);
      paramCount++;
    }

    if (filter.price?.$gte !== undefined) {
      query += ` AND price >= $${paramCount}`;
      values.push(filter.price.$gte);
      paramCount++;
    }

    if (filter.price?.$lte !== undefined) {
      query += ` AND price <= $${paramCount}`;
      values.push(filter.price.$lte);
      paramCount++;
    }

    if (filter.bedrooms?.$gte !== undefined) {
      query += ` AND bedrooms >= $${paramCount}`;
      values.push(filter.bedrooms.$gte);
      paramCount++;
    }

    if (filter.bathrooms?.$gte !== undefined) {
      query += ` AND bathrooms >= $${paramCount}`;
      values.push(filter.bathrooms.$gte);
      paramCount++;
    }

    if (filter.area?.$gte !== undefined) {
      query += ` AND area >= $${paramCount}`;
      values.push(filter.area.$gte);
      paramCount++;
    }

    if (filter.area?.$lte !== undefined) {
      query += ` AND area <= $${paramCount}`;
      values.push(filter.area.$lte);
      paramCount++;
    }

    if (filter.amenities?.$in) {
      query += ` AND amenities ?| $${paramCount}`;
      values.push(filter.amenities.$in);
      paramCount++;
    }

    if (filter.available === true) {
      query += ` AND available = true`;
    }

    if (filter.featured === true) {
      query += ` AND featured = true`;
    }

    const result = await client.query(query, values);
    client.release();

    return parseInt(result.rows[0].count);
  }

  static async create(data: Partial<IProperty>) {
    const client = await connectToDatabase();

    const query = `
      INSERT INTO properties (
        title, description, price, address, city, county, lat, lng, place_id,
        property_type, bedrooms, bathrooms, area, amenities, images,
        featured, available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const values = [
      data.title,
      data.description,
      data.price,
      data.address,
      data.city,
      data.county,
      data.lat,
      data.lng,
      data.placeId,
      data.propertyType,
      data.bedrooms,
      data.bathrooms,
      data.area,
      JSON.stringify(data.amenities || []),
      JSON.stringify(data.images || []),
      data.featured || false,
      data.available !== false,
    ];

    const result = await client.query(query, values);
    if (client) client.release();

    const row = result.rows[0];
    return {
      ...row,
      placeId: row.place_id,
      propertyType: row.property_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      amenities: row.amenities || [],
      images: row.images || [],
      location: {
        address: row.address,
        city: row.city,
        county: row.county,
      },
    };
  }

  static async findById(id: number) {
    const client = await connectToDatabase();

    const query = `
      SELECT id, title, description, price, address, city, county, lat, lng, place_id as "placeId",
             property_type as "propertyType", bedrooms, bathrooms, area, amenities, images,
             featured, available, created_at as "createdAt", updated_at as "updatedAt"
      FROM properties WHERE id = $1
    `;

    const result = await client.query(query, [id]);
    if (client) client.release();

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      placeId: row.place_id,
      propertyType: row.property_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      amenities: row.amenities || [],
      images: row.images || [],
      location: {
        address: row.address,
        city: row.city,
        county: row.county,
      },
    };
  }

  static async findByIdAndUpdate(id: number, updateData: Partial<IProperty>) {
    const client = await connectToDatabase();

    const setParts: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Build SET clause dynamically
    if (updateData.title !== undefined) {
      setParts.push(`title = $${paramCount}`);
      values.push(updateData.title);
      paramCount++;
    }

    if (updateData.description !== undefined) {
      setParts.push(`description = $${paramCount}`);
      values.push(updateData.description);
      paramCount++;
    }

    if (updateData.price !== undefined) {
      setParts.push(`price = $${paramCount}`);
      values.push(updateData.price);
      paramCount++;
    }

    if (updateData.address !== undefined) {
      setParts.push(`address = $${paramCount}`);
      values.push(updateData.address);
      paramCount++;
    }

    if (updateData.city !== undefined) {
      setParts.push(`city = $${paramCount}`);
      values.push(updateData.city);
      paramCount++;
    }

    if (updateData.county !== undefined) {
      setParts.push(`county = $${paramCount}`);
      values.push(updateData.county);
      paramCount++;
    }

    if (updateData.lat !== undefined) {
      setParts.push(`lat = $${paramCount}`);
      values.push(updateData.lat);
      paramCount++;
    }

    if (updateData.lng !== undefined) {
      setParts.push(`lng = $${paramCount}`);
      values.push(updateData.lng);
      paramCount++;
    }

    if (updateData.placeId !== undefined) {
      setParts.push(`place_id = $${paramCount}`);
      values.push(updateData.placeId);
      paramCount++;
    }

    if (updateData.propertyType !== undefined) {
      setParts.push(`property_type = $${paramCount}`);
      values.push(updateData.propertyType);
      paramCount++;
    }

    if (updateData.bedrooms !== undefined) {
      setParts.push(`bedrooms = $${paramCount}`);
      values.push(updateData.bedrooms);
      paramCount++;
    }

    if (updateData.bathrooms !== undefined) {
      setParts.push(`bathrooms = $${paramCount}`);
      values.push(updateData.bathrooms);
      paramCount++;
    }

    if (updateData.area !== undefined) {
      setParts.push(`area = $${paramCount}`);
      values.push(updateData.area);
      paramCount++;
    }

    if (updateData.amenities !== undefined) {
      setParts.push(`amenities = $${paramCount}`);
      values.push(JSON.stringify(updateData.amenities));
      paramCount++;
    }

    if (updateData.images !== undefined) {
      setParts.push(`images = $${paramCount}`);
      values.push(JSON.stringify(updateData.images));
      paramCount++;
    }

    if (updateData.featured !== undefined) {
      setParts.push(`featured = $${paramCount}`);
      values.push(updateData.featured);
      paramCount++;
    }

    if (updateData.available !== undefined) {
      setParts.push(`available = $${paramCount}`);
      values.push(updateData.available);
      paramCount++;
    }

    if (setParts.length === 0) {
      // No updates, just return current data
      return PropertyModel.findById(id);
    }

    const query = `
      UPDATE properties
      SET ${setParts.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, title, description, price, address, city, county, lat, lng, place_id as "placeId",
                property_type as "propertyType", bedrooms, bathrooms, area, amenities, images,
                featured, available, created_at as "createdAt", updated_at as "updatedAt"
    `;

    values.push(id);

    const result = await client.query(query, values);
    if (client) client.release();

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      placeId: row.place_id,
      propertyType: row.property_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      amenities: row.amenities || [],
      images: row.images || [],
      location: {
        address: row.address,
        city: row.city,
        county: row.county,
      },
    };
  }

  static async findByIdAndDelete(id: number) {
    const client = await connectToDatabase();

    const query = `DELETE FROM properties WHERE id = $1 RETURNING *`;
    const result = await client.query(query, [id]);
    if (client) client.release();

    return result.rows.length > 0;
  }

  static async deleteAll() {
    const client = await connectToDatabase();

    const query = `DELETE FROM properties`;
    await client.query(query);
    if (client) client.release();

    return true;
  }
}

export default PropertyModel;
