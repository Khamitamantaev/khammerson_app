/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface NodeData {
  id: string;
  label?: string | null;
  description?: string | null;
  code?: string | null;
  filePath?: string | null;
  image?: string | null;
  customPage?: any;
  nodeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Author {
  id: string;
  userName: string;
  email: string;
}

export interface Node {
  id: string;
  canvasId: string;
  positionX: number;
  positionY: number;
  type?: string | null;
  nodeType: string;
  rating: number;
  usageCount: number;
  views: number;
  isPublic: boolean;
  tags: string[];
  authorId?: string | null;
  originalGlobalNodeId?: string | null;
  parentId?: string | null;
  children: string[];
  dataId?: string | null;
  data?: NodeData | null;
  author?: Author | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class NodeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private get pool() {
    return this.databaseService.getPool();
  }

  // ==================== FIND METHODS ====================

  async findCanvasNodes(canvasId: string): Promise<Node[]> {
    const query = `
      SELECT 
        n.*,
        nd.id as data_id, 
        nd.label as data_label, 
        nd.description as data_description, 
        nd.code as data_code,
        nd.file_path as data_file_path, 
        nd.image as data_image, 
        nd.custom_page as data_custom_page,
        nd.created_at as data_created_at,
        nd.updated_at as data_updated_at,
        u.id as author_id,
        u.user_name as author_user_name,
        u.email as author_email
      FROM nodes n
      LEFT JOIN node_data nd ON n.data_id = nd.id
      LEFT JOIN "users" u ON n.author_id = u.id
      WHERE n.canvas_id = $1
      ORDER BY n.created_at
    `;

    const result = await this.pool.query(query, [canvasId]);
    return result.rows.map((row) => this.mapRowToNode(row));
  }

  async findById(id: string): Promise<Node | null> {
    const query = `
      SELECT 
        n.*,
        nd.id as data_id, 
        nd.label as data_label, 
        nd.description as data_description, 
        nd.code as data_code,
        nd.file_path as data_file_path, 
        nd.image as data_image, 
        nd.custom_page as data_custom_page,
        nd.created_at as data_created_at,
        nd.updated_at as data_updated_at,
        u.id as author_id,
        u.user_name as author_user_name,
        u.email as author_email
      FROM nodes n
      LEFT JOIN node_data nd ON n.data_id = nd.id 
      LEFT JOIN "users" u ON n.author_id = u.id
      WHERE n.id = $1
    `;

    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToNode(result.rows[0]);
  }

  async findManyByIds(ids: string[]): Promise<Node[]> {
    if (ids.length === 0) return [];

    const query = `
      SELECT 
        n.*,
        nd.id as data_id, 
        nd.label as data_label, 
        nd.description as data_description, 
        nd.code as data_code,
        nd.file_path as data_file_path, 
        nd.image as data_image, 
        nd.custom_page as data_custom_page,
        nd.created_at as data_created_at,
        nd.updated_at as data_updated_at,
        u.id as author_id,
        u.user_name as author_user_name,
        u.email as author_email
      FROM nodes n
      LEFT JOIN node_data nd ON n.data_id = nd.id
      LEFT JOIN "users" u ON n.author_id = u.id
      WHERE n.id = ANY($1)
      ORDER BY n.created_at
    `;

    const result = await this.pool.query(query, [ids]);
    return result.rows.map((row) => this.mapRowToNode(row));
  }

  // ==================== CREATE METHODS ====================

  async create(data: {
    canvasId: string;
    type: string;
    positionX: number;
    positionY: number;
    parentId?: string | null;
    children?: string[];
    data: {
      code: string;
      description: string;
      label: string;
      image?: string | null;
    };
  }): Promise<Node> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Создаем ноду
      const nodeResult = await client.query(
        `INSERT INTO nodes (canvas_id, type, position_x, position_y, parent_id, children) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, canvas_id, type, position_x, position_y, parent_id, children, created_at, updated_at`,
        [
          data.canvasId,
          data.type,
          data.positionX,
          data.positionY,
          data.parentId || null,
          data.children || [],
        ],
      );

      const nodeRow = nodeResult.rows[0];
      const nodeId = nodeRow.id;

      // 2. Создаем данные ноды
      const dataResult = await client.query(
        `INSERT INTO node_data (node_id, code, description, label, image) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, code, description, label, image, created_at, updated_at`,
        [
          nodeId,
          data.data.code,
          data.data.description,
          data.data.label,
          data.data.image || null,
        ],
      );

      const nodeData = dataResult.rows[0];

      // 3. Обновляем ноду, устанавливая data_id
      await client.query(`UPDATE nodes SET data_id = $1 WHERE id = $2`, [
        nodeData.id,
        nodeId,
      ]);

      await client.query('COMMIT');

      // 4. Возвращаем полную ноду
      const fullNode = await this.findById(nodeId);
      if (!fullNode) throw new Error('Failed to retrieve created node');
      return fullNode;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating node:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ==================== UPDATE METHODS ====================

  async update(
    id: string,
    updates: {
      positionX?: number;
      positionY?: number;
      parentId?: string | null;
      children?: string[];
      type?: string;
      nodeType?: string;
      rating?: number;
      usageCount?: number;
      views?: number;
      isPublic?: boolean;
      tags?: string[];
      authorId?: string | null;
      originalGlobalNodeId?: string | null;
      data?: {
        label?: string;
        description?: string;
        code?: string;
        image?: string | null;
        filePath?: string;
        customPage?: any;
      };
    },
  ): Promise<Node> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Обновляем поля nodes
      const nodeUpdates: string[] = [];
      const nodeValues: any[] = [];
      let paramIndex = 1;

      if (updates.positionX !== undefined) {
        nodeUpdates.push(`position_x = $${paramIndex++}`);
        nodeValues.push(updates.positionX);
      }
      if (updates.positionY !== undefined) {
        nodeUpdates.push(`position_y = $${paramIndex++}`);
        nodeValues.push(updates.positionY);
      }
      if (updates.parentId !== undefined) {
        nodeUpdates.push(`parent_id = $${paramIndex++}`);
        nodeValues.push(updates.parentId);
      }
      if (updates.children !== undefined) {
        nodeUpdates.push(`children = $${paramIndex++}`);
        nodeValues.push(updates.children);
      }
      if (updates.type !== undefined) {
        nodeUpdates.push(`type = $${paramIndex++}`);
        nodeValues.push(updates.type);
      }
      if (updates.nodeType !== undefined) {
        nodeUpdates.push(`node_type = $${paramIndex++}`);
        nodeValues.push(updates.nodeType);
      }
      if (updates.rating !== undefined) {
        nodeUpdates.push(`rating = $${paramIndex++}`);
        nodeValues.push(updates.rating);
      }
      if (updates.usageCount !== undefined) {
        nodeUpdates.push(`usage_count = $${paramIndex++}`);
        nodeValues.push(updates.usageCount);
      }
      if (updates.views !== undefined) {
        nodeUpdates.push(`views = $${paramIndex++}`);
        nodeValues.push(updates.views);
      }
      if (updates.isPublic !== undefined) {
        nodeUpdates.push(`is_public = $${paramIndex++}`);
        nodeValues.push(updates.isPublic);
      }
      if (updates.tags !== undefined) {
        nodeUpdates.push(`tags = $${paramIndex++}`);
        nodeValues.push(updates.tags);
      }
      if (updates.authorId !== undefined) {
        nodeUpdates.push(`author_id = $${paramIndex++}`);
        nodeValues.push(updates.authorId);
      }
      if (updates.originalGlobalNodeId !== undefined) {
        nodeUpdates.push(`original_global_node_id = $${paramIndex++}`);
        nodeValues.push(updates.originalGlobalNodeId);
      }

      if (nodeUpdates.length > 0) {
        nodeUpdates.push(`updated_at = NOW()`);
        nodeValues.push(id);

        await client.query(
          `UPDATE nodes SET ${nodeUpdates.join(', ')} WHERE id = $${paramIndex}`,
          nodeValues,
        );
      }

      // Обновляем данные если указаны
      if (updates.data) {
        const dataResult = await client.query(
          `SELECT id FROM node_data WHERE node_id = $1`,
          [id],
        );

        const dataId = dataResult.rows[0]?.id;

        if (dataId) {
          // UPDATE существующих данных
          const dataUpdates: string[] = [];
          const dataValues: any[] = [];
          let dataParamIndex = 1;

          if (updates.data.label !== undefined) {
            dataUpdates.push(`label = $${dataParamIndex++}`);
            dataValues.push(updates.data.label);
          }
          if (updates.data.description !== undefined) {
            dataUpdates.push(`description = $${dataParamIndex++}`);
            dataValues.push(updates.data.description);
          }
          if (updates.data.code !== undefined) {
            dataUpdates.push(`code = $${dataParamIndex++}`);
            dataValues.push(updates.data.code);
          }
          if (updates.data.image !== undefined) {
            dataUpdates.push(`image = $${dataParamIndex++}`);
            dataValues.push(updates.data.image);
          }
          if (updates.data.filePath !== undefined) {
            dataUpdates.push(`file_path = $${dataParamIndex++}`);
            dataValues.push(updates.data.filePath);
          }
          if (updates.data.customPage !== undefined) {
            dataUpdates.push(`custom_page = $${dataParamIndex++}`);
            dataValues.push(
              updates.data.customPage
                ? JSON.stringify(updates.data.customPage)
                : null,
            );
          }

          if (dataUpdates.length > 0) {
            dataUpdates.push(`updated_at = NOW()`);
            dataValues.push(dataId);

            await client.query(
              `UPDATE node_data SET ${dataUpdates.join(', ')} WHERE id = $${dataParamIndex}`,
              dataValues,
            );
          }
        } else {
          // INSERT новых данных
          await client.query(
            `INSERT INTO node_data (
              node_id, label, description, code, image, file_path, custom_page
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              id,
              updates.data.label || '',
              updates.data.description || '',
              updates.data.code || '',
              updates.data.image || null,
              updates.data.filePath || '',
              updates.data.customPage
                ? JSON.stringify(updates.data.customPage)
                : null,
            ],
          );
        }
      }

      await client.query('COMMIT');

      const updatedNode = await this.findById(id);
      if (!updatedNode) throw new Error('Node not found after update');
      return updatedNode;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating node:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updatePosition(
    id: string,
    positionX: number,
    positionY: number,
  ): Promise<boolean> {
    const result = await this.pool.query(
      `UPDATE nodes SET position_x = $1, position_y = $2, updated_at = NOW() WHERE id = $3`,
      [positionX, positionY, id],
    );
    return (result.rowCount ?? 0) > 0;
  }

  // ==================== DELETE METHODS ====================

  async delete(id: string): Promise<boolean> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Сначала удаляем связанные данные
      await client.query(`DELETE FROM node_data WHERE node_id = $1`, [id]);

      // Затем удаляем саму ноду
      const deleteResult = await client.query(
        'DELETE FROM nodes WHERE id = $1',
        [id],
      );

      await client.query('COMMIT');
      return (deleteResult.rowCount ?? 0) > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting node:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteMany(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;

    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      await client.query(`DELETE FROM node_data WHERE node_id = ANY($1)`, [
        ids,
      ]);
      const deleteResult = await client.query(
        'DELETE FROM nodes WHERE id = ANY($1)',
        [ids],
      );

      await client.query('COMMIT');
      return deleteResult.rowCount ?? 0;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting nodes:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ==================== HELPER METHODS ====================

  private mapRowToNode(row: any): Node {
    let customPage = row.data_custom_page;

    if (customPage && typeof customPage === 'string') {
      try {
        customPage = JSON.parse(customPage);
      } catch {
        customPage = null;
      }
    }

    return {
      id: row.id,
      canvasId: row.canvas_id,
      positionX: row.position_x,
      positionY: row.position_y,
      type: row.type,
      nodeType: row.node_type,
      rating: row.rating ?? 0,
      usageCount: row.usage_count ?? 0,
      views: row.views ?? 0,
      isPublic: row.is_public ?? false,
      tags: row.tags || [],
      authorId: row.author_id,
      originalGlobalNodeId: row.original_global_node_id,
      parentId: row.parent_id,
      children: row.children || [],
      dataId: row.data_id,
      data: row.data_id
        ? {
            id: row.data_id,
            label: row.data_label,
            description: row.data_description,
            code: row.data_code,
            filePath: row.data_file_path,
            image: row.data_image,
            customPage: customPage,
            nodeId: row.id,
            createdAt: row.data_created_at,
            updatedAt: row.data_updated_at,
          }
        : null,
      author: row.author_id
        ? {
            id: row.author_id,
            userName: row.author_user_name,
            email: row.author_email,
          }
        : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async countCanvasNodes(canvasId: string): Promise<number> {
    const result = await this.pool.query(
      'SELECT COUNT(*) FROM nodes WHERE canvas_id = $1',
      [canvasId],
    );
    return parseInt(result.rows[0].count) || 0;
  }
}
