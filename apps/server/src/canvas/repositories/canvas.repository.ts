import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface CanvasEntity {
  id: string;
  title: string;
  description?: string | null;
  projectId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasWithCountEntity extends CanvasEntity {
  _count: {
    nodes: number;
    edges: number;
  };
}

@Injectable()
export class CanvasRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private get pool() {
    return this.databaseService.getPool();
  }

  async findUserCanvases(userId: string): Promise<CanvasWithCountEntity[]> {
    const query = `
      SELECT 
        c.*,
        COALESCE(nodes_count, 0) as nodes_count,
        COALESCE(edges_count, 0) as edges_count
      FROM canvases c
      LEFT JOIN (
        SELECT canvas_id, COUNT(*) as nodes_count 
        FROM nodes 
        GROUP BY canvas_id
      ) n ON c.id = n.canvas_id
      LEFT JOIN (
        SELECT canvas_id, COUNT(*) as edges_count 
        FROM edges 
        GROUP BY canvas_id
      ) e ON c.id = e.canvas_id
      WHERE c.owner_id = $1
      ORDER BY c.created_at DESC
    `;

    const result = await this.pool.query(query, [userId]);

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      projectId: row.project_id,
      ownerId: row.owner_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      _count: {
        nodes: parseInt(row.nodes_count) || 0,
        edges: parseInt(row.edges_count) || 0,
      },
    }));
  }

  async findProjectCanvases(
    projectId: string,
    userId: string,
  ): Promise<CanvasWithCountEntity[]> {
    const query = `
      SELECT 
        c.*,
        COALESCE(nodes_count, 0) as nodes_count,
        COALESCE(edges_count, 0) as edges_count
      FROM canvases c
      LEFT JOIN (
        SELECT canvas_id, COUNT(*) as nodes_count 
        FROM nodes 
        GROUP BY canvas_id
      ) n ON c.id = n.canvas_id
      LEFT JOIN (
        SELECT canvas_id, COUNT(*) as edges_count 
        FROM edges 
        GROUP BY canvas_id
      ) e ON c.id = e.canvas_id
      WHERE c.project_id = $1 AND c.owner_id = $2
      ORDER BY c.created_at DESC
    `;

    const result = await this.pool.query(query, [projectId, userId]);

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      projectId: row.project_id,
      ownerId: row.owner_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      _count: {
        nodes: parseInt(row.nodes_count) || 0,
        edges: parseInt(row.edges_count) || 0,
      },
    }));
  }

  async findById(id: string, userId?: string): Promise<CanvasEntity | null> {
    let query = `SELECT * FROM canvases WHERE id = $1`;
    const params: any[] = [id];

    if (userId) {
      query += ` AND owner_id = $2`;
      params.push(userId);
    }

    const result = await this.pool.query(query, params);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      projectId: row.project_id,
      ownerId: row.owner_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(data: {
    title: string;
    description?: string;
    projectId: string;
    ownerId: string;
  }): Promise<CanvasEntity> {
    const result = await this.pool.query(
      `INSERT INTO canvases (title, description, project_id, owner_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [data.title, data.description || null, data.projectId, data.ownerId],
    );

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      projectId: row.project_id,
      ownerId: row.owner_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async update(
    id: string,
    userId: string,
    data: { title?: string; description?: string; projectId?: string },
  ): Promise<CanvasEntity | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(data.title);
      paramCount++;
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }

    if (data.projectId !== undefined) {
      updates.push(`project_id = $${paramCount}`);
      values.push(data.projectId);
      paramCount++;
    }

    if (updates.length === 0) {
      return this.findById(id, userId);
    }

    values.push(id, userId);

    const result = await this.pool.query(
      `UPDATE canvases 
       SET ${updates.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} AND owner_id = $${paramCount + 1}
       RETURNING *`,
      values,
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      projectId: row.project_id,
      ownerId: row.owner_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Проверяем права и существование канваса
      const canvasCheck = await client.query(
        `SELECT id FROM canvases WHERE id = $1 AND owner_id = $2`,
        [id, userId],
      );

      if (canvasCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }

      // Находим все ID нод этого канваса
      const nodesResult = await client.query(
        `SELECT id, data_id FROM nodes WHERE canvas_id = $1`,
        [id],
      );
      const nodeIds = nodesResult.rows.map((row) => row.id);
      const nodeDataIds = nodesResult.rows
        .map((row) => row.data_id)
        .filter(Boolean);

      // Удаляем edges
      if (nodeIds.length > 0) {
        await client.query(`DELETE FROM edges WHERE canvas_id = $1`, [id]);
      }

      // Удаляем сами ноды
      if (nodeIds.length > 0) {
        await client.query(`DELETE FROM nodes WHERE canvas_id = $1`, [id]);
      }

      // Удаляем данные нод которые больше нигде не используются
      if (nodeDataIds.length > 0) {
        await client.query(
          `DELETE FROM node_data WHERE id = ANY($1) 
           AND NOT EXISTS (SELECT 1 FROM nodes WHERE data_id = node_data.id)`,
          [nodeDataIds],
        );
      }

      // Удаляем использование глобальных нод
      await client.query(`DELETE FROM user_node_usage WHERE canvas_id = $1`, [
        id,
      ]);

      // Удаляем сам канвас
      await client.query(`DELETE FROM canvases WHERE id = $1`, [id]);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting canvas:', error);
      return false;
    } finally {
      client.release();
    }
  }

  async countProjectCanvases(projectId: string): Promise<number> {
    const result = await this.pool.query(
      'SELECT COUNT(*) FROM canvases WHERE project_id = $1',
      [projectId],
    );
    return parseInt(result.rows[0].count);
  }

  private mapRowToCanvasWithCount(row: any): CanvasWithCountEntity {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      projectId: row.project_id,
      ownerId: row.owner_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      _count: {
        nodes: parseInt(row.nodes_count) || 0,
        edges: parseInt(row.edges_count) || 0,
      },
    };
  }
}
