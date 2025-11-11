import { connectToDatabase } from "@/lib/neon";

export interface IAdmin {
  id: number;
  email: string;
  password: string;
  isSuperAdmin: boolean;
  createdBy: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AdminModel {
  static async find(filter: any = {}, options: any = {}) {
    const client = await connectToDatabase();

    let query = `
      SELECT id, email, password, is_super_admin as "isSuperAdmin",
             created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt"
      FROM admins WHERE 1=1
    `;

    const values: any[] = [];
    let paramCount = 1;

    if (filter.email) {
      query += ` AND email = $${paramCount}`;
      values.push(filter.email);
      paramCount++;
    }

    if (filter.isSuperAdmin !== undefined) {
      query += ` AND is_super_admin = $${paramCount}`;
      values.push(filter.isSuperAdmin);
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
      isSuperAdmin: row.isSuperAdmin,
      createdBy: row.createdBy,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  static async countDocuments(filter: any = {}) {
    const client = await connectToDatabase();

    let query = `SELECT COUNT(*) as count FROM admins WHERE 1=1`;
    const values: any[] = [];
    let paramCount = 1;

    if (filter.email) {
      query += ` AND email = $${paramCount}`;
      values.push(filter.email);
      paramCount++;
    }

    if (filter.isSuperAdmin !== undefined) {
      query += ` AND is_super_admin = $${paramCount}`;
      values.push(filter.isSuperAdmin);
      paramCount++;
    }

    const result = await client.query(query, values);
    if (client) client.release();

    return parseInt(result.rows[0].count);
  }

  static async create(data: Partial<IAdmin>) {
    const client = await connectToDatabase();

    const query = `
      INSERT INTO admins (email, password, is_super_admin, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      data.email,
      data.password,
      data.isSuperAdmin || false,
      data.createdBy || null,
    ];

    const result = await client.query(query, values);
    if (client) client.release();

    const row = result.rows[0];
    return {
      ...row,
      isSuperAdmin: row.is_super_admin,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findById(id: number) {
    const client = await connectToDatabase();

    const query = `
      SELECT id, email, password, is_super_admin as "isSuperAdmin",
             created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt"
      FROM admins WHERE id = $1
    `;

    const result = await client.query(query, [id]);
    if (client) client.release();

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      isSuperAdmin: row.isSuperAdmin,
      createdBy: row.createdBy,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findOne(filter: any = {}) {
    const admins = await AdminModel.find(filter, { limit: 1 });
    return admins.length > 0 ? admins[0] : null;
  }

  static async findByIdAndUpdate(id: number, updateData: Partial<IAdmin>) {
    const client = await connectToDatabase();

    const setParts: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updateData.email !== undefined) {
      setParts.push(`email = $${paramCount}`);
      values.push(updateData.email);
      paramCount++;
    }

    if (updateData.password !== undefined) {
      setParts.push(`password = $${paramCount}`);
      values.push(updateData.password);
      paramCount++;
    }

    if (updateData.isSuperAdmin !== undefined) {
      setParts.push(`is_super_admin = $${paramCount}`);
      values.push(updateData.isSuperAdmin);
      paramCount++;
    }

    if (updateData.createdBy !== undefined) {
      setParts.push(`created_by = $${paramCount}`);
      values.push(updateData.createdBy);
      paramCount++;
    }

    if (setParts.length === 0) {
      return AdminModel.findById(id);
    }

    const query = `
      UPDATE admins
      SET ${setParts.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, email, password, is_super_admin as "isSuperAdmin",
                created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt"
    `;

    values.push(id);

    const result = await client.query(query, values);
    if (client) client.release();

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      isSuperAdmin: row.isSuperAdmin,
      createdBy: row.createdBy,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findByIdAndDelete(id: number) {
    const client = await connectToDatabase();

    const query = `DELETE FROM admins WHERE id = $1 RETURNING *`;
    const result = await client.query(query, [id]);
    if (client) client.release();

    return result.rows.length > 0;
  }

  static async deleteAll() {
    const client = await connectToDatabase();

    const query = `DELETE FROM admins`;
    await client.query(query);
    if (client) client.release();

    return true;
  }
}

export default AdminModel;
