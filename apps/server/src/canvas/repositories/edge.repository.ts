import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  type?: string | null;
  canvasId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EdgeWithNodes extends Edge {
  source?: {
    id: string;
    positionX: number;
    positionY: number;
    type?: string | null;
  };
  target?: {
    id: string;
    positionX: number;
    positionY: number;
    type?: string | null;
  };
}

@Injectable()
export class EdgeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private get pool() {
    return this.databaseService.getPool();
  }

  // ==================== FIND METHODS ====================

  async findCanvasEdges(canvasId: string): Promise<Edge[]> {
    const result = await this.pool.query(
      `SELECT * FROM edges WHERE canvas_id = $1 ORDER BY created_at`,
      [canvasId],
    );

    return result.rows.map((row) => this.mapRowToEdge(row));
  }

  async findCanvasEdgesWithNodes(canvasId: string): Promise<EdgeWithNodes[]> {
    const query = `
      SELECT 
        e.*,
        s.id as source_id_full,
        s.position_x as source_position_x,
        s.position_y as source_position_y,
        s.type as source_type,
        t.id as target_id_full,
        t.position_x as target_position_x,
        t.position_y as target_position_y,
        t.type as target_type
      FROM edges e
      LEFT JOIN nodes s ON e.source_id = s.id
      LEFT JOIN nodes t ON e.target_id = t.id
      WHERE e.canvas_id = $1
      ORDER BY e.created_at
    `;

    const result = await this.pool.query(query, [canvasId]);

    return result.rows.map((row) => ({
      id: row.id,
      sourceId: row.source_id,
      targetId: row.target_id,
      type: row.type,
      canvasId: row.canvas_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      source: row.source_id_full
        ? {
            id: row.source_id_full,
            positionX: row.source_position_x,
            positionY: row.source_position_y,
            type: row.source_type,
          }
        : undefined,
      target: row.target_id_full
        ? {
            id: row.target_id_full,
            positionX: row.target_position_x,
            positionY: row.target_position_y,
            type: row.target_type,
          }
        : undefined,
    }));
  }

  async findById(id: string): Promise<Edge | null> {
    const result = await this.pool.query('SELECT * FROM edges WHERE id = $1', [
      id,
    ]);

    if (result.rows.length === 0) return null;

    return this.mapRowToEdge(result.rows[0]);
  }

  async findByIdWithNodes(id: string): Promise<EdgeWithNodes | null> {
    const query = `
      SELECT 
        e.*,
        s.id as source_id_full,
        s.position_x as source_position_x,
        s.position_y as source_position_y,
        s.type as source_type,
        t.id as target_id_full,
        t.position_x as target_position_x,
        t.position_y as target_position_y,
        t.type as target_type
      FROM edges e
      LEFT JOIN nodes s ON e.source_id = s.id
      LEFT JOIN nodes t ON e.target_id = t.id
      WHERE e.id = $1
    `;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      sourceId: row.source_id,
      targetId: row.target_id,
      type: row.type,
      canvasId: row.canvas_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      source: row.source_id_full
        ? {
            id: row.source_id_full,
            positionX: row.source_position_x,
            positionY: row.source_position_y,
            type: row.source_type,
          }
        : undefined,
      target: row.target_id_full
        ? {
            id: row.target_id_full,
            positionX: row.target_position_x,
            positionY: row.target_position_y,
            type: row.target_type,
          }
        : undefined,
    };
  }

  async findByTarget(targetId: string, canvasId: string): Promise<Edge | null> {
    const result = await this.pool.query(
      'SELECT * FROM edges WHERE target_id = $1 AND canvas_id = $2',
      [targetId, canvasId],
    );

    if (result.rows.length === 0) return null;

    return this.mapRowToEdge(result.rows[0]);
  }

  async findBySource(sourceId: string): Promise<Edge[]> {
    const result = await this.pool.query(
      'SELECT * FROM edges WHERE source_id = $1',
      [sourceId],
    );

    return result.rows.map((row) => this.mapRowToEdge(row));
  }

  // ==================== CREATE METHODS ====================

  async create(data: {
    sourceId: string;
    targetId: string;
    type?: string;
    canvasId: string;
  }): Promise<Edge> {
    const result = await this.pool.query(
      `INSERT INTO edges (source_id, target_id, type, canvas_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [data.sourceId, data.targetId, data.type || null, data.canvasId],
    );

    return this.mapRowToEdge(result.rows[0]);
  }

  // ==================== UPDATE METHODS ====================

  async update(
    id: string,
    data: {
      type?: string;
    },
  ): Promise<Edge | null> {
    const result = await this.pool.query(
      `UPDATE edges SET type = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [data.type || null, id],
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToEdge(result.rows[0]);
  }

  // ==================== DELETE METHODS ====================

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM edges WHERE id = $1', [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }

  async deleteByTarget(targetId: string, canvasId: string): Promise<boolean> {
    const result = await this.pool.query(
      'DELETE FROM edges WHERE target_id = $1 AND canvas_id = $2',
      [targetId, canvasId],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async deleteMany(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;

    const result = await this.pool.query(
      'DELETE FROM edges WHERE id = ANY($1)',
      [ids],
    );
    return result.rowCount ?? 0;
  }

  async deleteCanvasEdges(canvasId: string): Promise<number> {
    const result = await this.pool.query(
      'DELETE FROM edges WHERE canvas_id = $1',
      [canvasId],
    );
    return result.rowCount ?? 0;
  }

  // ==================== TRANSACTION METHODS ====================

  async createEdgeAndUpdateNode(data: {
    sourceId: string;
    targetId: string;
    type?: string;
    canvasId: string;
  }): Promise<Edge> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Проверяем существующую связь для target ноды
      const oldEdgeResult = await client.query(
        'SELECT * FROM edges WHERE target_id = $1 AND canvas_id = $2',
        [data.targetId, data.canvasId],
      );

      // 2. Если есть старая связь - удаляем ее
      if (oldEdgeResult.rows.length > 0) {
        const oldEdge = oldEdgeResult.rows[0];

        await client.query('DELETE FROM edges WHERE id = $1', [oldEdge.id]);

        // 3. Удаляем связь у старого родителя
        await client.query(
          `UPDATE nodes 
           SET children = array_remove(children, $1),
               updated_at = NOW()
           WHERE id = $2`,
          [data.targetId, oldEdge.source_id],
        );
      }

      // 4. Создаем новую связь
      const edgeResult = await client.query(
        `INSERT INTO edges (source_id, target_id, type, canvas_id) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [data.sourceId, data.targetId, data.type || null, data.canvasId],
      );

      // 5. Обновляем children у нового родителя
      await client.query(
        `UPDATE nodes 
         SET children = array_append(COALESCE(children, ARRAY[]::text[]), $1),
             updated_at = NOW()
         WHERE id = $2`,
        [data.targetId, data.sourceId],
      );

      await client.query('COMMIT');

      return this.mapRowToEdge(edgeResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteEdgeAndUpdateNode(edgeId: string): Promise<{ deleted: boolean }> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Получаем информацию о эдже
      const edgeResult = await client.query(
        'SELECT * FROM edges WHERE id = $1',
        [edgeId],
      );

      if (edgeResult.rows.length === 0) {
        await client.query('COMMIT');
        return { deleted: false };
      }

      const edge = edgeResult.rows[0];

      // 2. Удаляем эдж
      await client.query('DELETE FROM edges WHERE id = $1', [edgeId]);

      // 3. Удаляем связь у родителя
      await client.query(
        `UPDATE nodes 
         SET children = array_remove(children, $1),
             updated_at = NOW()
         WHERE id = $2`,
        [edge.target_id, edge.source_id],
      );

      await client.query('COMMIT');

      return { deleted: true };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // ==================== HELPER METHODS ====================

  private mapRowToEdge(row: any): Edge {
    return {
      id: row.id,
      sourceId: row.source_id,
      targetId: row.target_id,
      type: row.type,
      canvasId: row.canvas_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async countCanvasEdges(canvasId: string): Promise<number> {
    const result = await this.pool.query(
      'SELECT COUNT(*) FROM edges WHERE canvas_id = $1',
      [canvasId],
    );
    return parseInt(result.rows[0].count) || 0;
  }
}
