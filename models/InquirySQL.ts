import { connectToDatabase } from "@/lib/neon";

export interface IInquiry {
  id: number;
  propertyId: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: "whatsapp" | "phone" | "email";
  status: "pending" | "contacted" | "resolved";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class InquiryModel {
  static async find(filter: any = {}, options: any = {}) {
    const client = await connectToDatabase();

    let query = `
      SELECT id, property_id as "propertyId", name, email, phone, message,
             preferred_contact as "preferredContact", status, is_verified as "isVerified",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM inquiries WHERE 1=1
    `;

    const values: any[] = [];
    let paramCount = 1;

    // Build WHERE clause
    if (filter.propertyId) {
      query += ` AND property_id = $${paramCount}`;
      values.push(filter.propertyId);
      paramCount++;
    }

    if (filter.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filter.status);
      paramCount++;
    }

    if (filter.email) {
      query += ` AND email = $${paramCount}`;
      values.push(filter.email);
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
    if (client) client.release();

    return result.rows;
  }

  static async countDocuments(filter: any = {}) {
    const client = await connectToDatabase();

    let query = `SELECT COUNT(*) as count FROM inquiries WHERE 1=1`;
    const values: any[] = [];
    let paramCount = 1;

    if (filter.propertyId) {
      query += ` AND property_id = $${paramCount}`;
      values.push(filter.propertyId);
      paramCount++;
    }

    if (filter.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filter.status);
      paramCount++;
    }

    if (filter.email) {
      query += ` AND email = $${paramCount}`;
      values.push(filter.email);
      paramCount++;
    }

    const result = await client.query(query, values);
    if (client) client.release();

    return parseInt(result.rows[0].count);
  }

  static async create(data: Partial<IInquiry>) {
    const client = await connectToDatabase();

    const query = `
      INSERT INTO inquiries (property_id, name, email, phone, message, preferred_contact, status, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      data.propertyId,
      data.name,
      data.email,
      data.phone,
      data.message,
      data.preferredContact,
      data.status || "pending",
      data.isVerified || false,
    ];

    const result = await client.query(query, values);
    if (client) client.release();

    const row = result.rows[0];
    return {
      ...row,
      propertyId: row.property_id,
      preferredContact: row.preferred_contact,
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findById(id: number) {
    const client = await connectToDatabase();

    const query = `
      SELECT id, property_id as "propertyId", name, email, phone, message,
             preferred_contact as "preferredContact", status, is_verified as "isVerified",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM inquiries WHERE id = $1
    `;

    const result = await client.query(query, [id]);
    if (client) client.release();

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      propertyId: row.property_id,
      preferredContact: row.preferred_contact,
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findByIdAndUpdate(id: number, updateData: Partial<IInquiry>) {
    const client = await connectToDatabase();

    const setParts: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updateData.propertyId !== undefined) {
      setParts.push(`property_id = $${paramCount}`);
      values.push(updateData.propertyId);
      paramCount++;
    }

    if (updateData.name !== undefined) {
      setParts.push(`name = $${paramCount}`);
      values.push(updateData.name);
      paramCount++;
    }

    if (updateData.email !== undefined) {
      setParts.push(`email = $${paramCount}`);
      values.push(updateData.email);
      paramCount++;
    }

    if (updateData.phone !== undefined) {
      setParts.push(`phone = $${paramCount}`);
      values.push(updateData.phone);
      paramCount++;
    }

    if (updateData.message !== undefined) {
      setParts.push(`message = $${paramCount}`);
      values.push(updateData.message);
      paramCount++;
    }

    if (updateData.preferredContact !== undefined) {
      setParts.push(`preferred_contact = $${paramCount}`);
      values.push(updateData.preferredContact);
      paramCount++;
    }

    if (updateData.status !== undefined) {
      setParts.push(`status = $${paramCount}`);
      values.push(updateData.status);
      paramCount++;
    }

    if (updateData.isVerified !== undefined) {
      setParts.push(`is_verified = $${paramCount}`);
      values.push(updateData.isVerified);
      paramCount++;
    }

    if (setParts.length === 0) {
      return InquiryModel.findById(id);
    }

    const query = `
      UPDATE inquiries
      SET ${setParts.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, property_id as "propertyId", name, email, phone, message,
                preferred_contact as "preferredContact", status, is_verified as "isVerified",
                created_at as "createdAt", updated_at as "updatedAt"
    `;

    values.push(id);

    const result = await client.query(query, values);
    if (client) client.release();

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      propertyId: row.property_id,
      preferredContact: row.preferred_contact,
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findByIdAndDelete(id: number) {
    const client = await connectToDatabase();

    const query = `DELETE FROM inquiries WHERE id = $1 RETURNING *`;
    const result = await client.query(query, [id]);
    if (client) client.release();

    return result.rows.length > 0;
  }
}

export default InquiryModel;
