import { connectToDatabase } from "@/lib/neon";

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  savedProperties: number[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  static async find(filter: any = {}, options: any = {}) {
    const client = await connectToDatabase();

    let query = `
      SELECT id, name, email, phone, role, saved_properties as "savedProperties",
             is_verified as "isVerified", created_at as "createdAt", updated_at as "updatedAt"
      FROM users WHERE 1=1
    `;

    const values: any[] = [];
    let paramCount = 1;

    if (filter.email) {
      query += ` AND email = $${paramCount}`;
      values.push(filter.email);
      paramCount++;
    }

    if (filter.phone) {
      query += ` AND phone = $${paramCount}`;
      values.push(filter.phone);
      paramCount++;
    }

    if (filter.role) {
      query += ` AND role = $${paramCount}`;
      values.push(filter.role);
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

    return result.rows.map((row) => ({
      ...row,
      savedProperties: row.savedProperties || [],
    }));
  }

  static async countDocuments(filter: any = {}) {
    const client = await connectToDatabase();

    let query = `SELECT COUNT(*) as count FROM users WHERE 1=1`;
    const values: any[] = [];
    let paramCount = 1;

    if (filter.email) {
      query += ` AND email = $${paramCount}`;
      values.push(filter.email);
      paramCount++;
    }

    if (filter.phone) {
      query += ` AND phone = $${paramCount}`;
      values.push(filter.phone);
      paramCount++;
    }

    if (filter.role) {
      query += ` AND role = $${paramCount}`;
      values.push(filter.role);
      paramCount++;
    }

    const result = await client.query(query, values);
    if (client) client.release();

    return parseInt(result.rows[0].count);
  }

  static async create(data: Partial<IUser>) {
    const client = await connectToDatabase();

    const query = `
      INSERT INTO users (name, email, phone, role, saved_properties, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      data.name,
      data.email,
      data.phone,
      data.role || "user",
      data.savedProperties ? `{${data.savedProperties.join(",")}}` : "{}",
      data.isVerified || false,
    ];

    const result = await client.query(query, values);
    if (client) client.release();

    const row = result.rows[0];
    return {
      ...row,
      savedProperties: row.saved_properties || [],
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findById(id: number) {
    const client = await connectToDatabase();

    const query = `
      SELECT id, name, email, phone, role, saved_properties as "savedProperties",
             is_verified as "isVerified", created_at as "createdAt", updated_at as "updatedAt"
      FROM users WHERE id = $1
    `;

    const result = await client.query(query, [id]);
    if (client) client.release();

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      savedProperties: row.savedProperties || [],
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findOne(filter: any = {}) {
    const users = await UserModel.find(filter, { limit: 1 });
    return users.length > 0 ? users[0] : null;
  }

  static async findByIdAndUpdate(id: number, updateData: Partial<IUser>) {
    const client = await connectToDatabase();

    const setParts: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

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

    if (updateData.role !== undefined) {
      setParts.push(`role = $${paramCount}`);
      values.push(updateData.role);
      paramCount++;
    }

    if (updateData.savedProperties !== undefined) {
      setParts.push(`saved_properties = $${paramCount}`);
      values.push(`{${updateData.savedProperties.join(",")}}`);
      paramCount++;
    }

    if (updateData.isVerified !== undefined) {
      setParts.push(`is_verified = $${paramCount}`);
      values.push(updateData.isVerified);
      paramCount++;
    }

    if (setParts.length === 0) {
      return UserModel.findById(id);
    }

    const query = `
      UPDATE users
      SET ${setParts.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, role, saved_properties as "savedProperties",
                is_verified as "isVerified", created_at as "createdAt", updated_at as "updatedAt"
    `;

    values.push(id);

    const result = await client.query(query, values);
    if (client) client.release();

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      savedProperties: row.savedProperties || [],
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findByIdAndDelete(id: number) {
    const client = await connectToDatabase();

    const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
    const result = await client.query(query, [id]);
    if (client) client.release();

    return result.rows.length > 0;
  }

  static async deleteAll() {
    const client = await connectToDatabase();

    const query = `DELETE FROM users`;
    await client.query(query);
    if (client) client.release();

    return true;
  }
}

export default UserModel;
