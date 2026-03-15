/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
// src/modules/project/repositories/project.repository.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  ownerId: string;
  isPublic: boolean;
  stars: number;
  downloads: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithStats extends Project {
  _count: {
    canvases: number;
    stars: number;
    downloads: number;
  };
  ownerName?: string;
  ownerEmail?: string;
}

@Injectable()
export class ProjectRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private get pool() {
    return this.databaseService.getPool();
  }

  async findUserProjects(userId: string): Promise<ProjectWithStats[]> {
    const query = `
    SELECT 
      p.*,
      COALESCE(canvases_count, 0) as canvases_count,
      COALESCE(stars_count, 0) as stars_count,
      COALESCE(downloads_count, 0) as downloads_count
    FROM projects p
    LEFT JOIN (
      SELECT project_id, COUNT(*) as canvases_count 
      FROM canvases 
      GROUP BY project_id
    ) c ON p.id = c.project_id
    LEFT JOIN (
      SELECT project_id, COUNT(*) as stars_count 
      FROM stars 
      GROUP BY project_id
    ) s ON p.id = s.project_id
    LEFT JOIN (
      SELECT project_id, COUNT(*) as downloads_count 
      FROM downloads 
      GROUP BY project_id
    ) d ON p.id = d.project_id
    WHERE p.owner_id = $1
    ORDER BY p.created_at DESC
  `;

    try {
      const result = await this.pool.query(query, [userId]);
      return result.rows.map(this.mapRowToProjectWithStats);
    } catch (error) {
      console.error('Error in findUserProjects:', error);
      throw error;
    }
  }

  async findPublicProjects(filters?: {
    tags?: string[];
    search?: string;
    sortBy?: 'stars' | 'downloads' | 'newest';
  }): Promise<ProjectWithStats[]> {
    let query = `
  SELECT 
    p.*,
    COALESCE(canvases_count, 0) as canvases_count,
    COALESCE(stars_count, 0) as stars_count,
    COALESCE(downloads_count, 0) as downloads_count,
    u.user_name as owner_name,
    u.email as owner_email
  FROM projects p
  LEFT JOIN "users" u ON p.owner_id = u.id
  LEFT JOIN (
    SELECT project_id, COUNT(*) as canvases_count 
    FROM canvases 
    GROUP BY project_id
  ) c ON p.id = c.project_id
  LEFT JOIN (
    SELECT project_id, COUNT(*) as stars_count 
    FROM stars 
    GROUP BY project_id
  ) s ON p.id = s.project_id
  LEFT JOIN (
    SELECT project_id, COUNT(*) as downloads_count 
    FROM downloads 
    GROUP BY project_id
  ) d ON p.id = d.project_id
  WHERE p.is_public = true
`;

    const params: any[] = [];

    if (filters?.search) {
      query += ` AND (p.title ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`;
      params.push(`%${filters.search}%`);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query += ` AND p.tags && $${params.length + 1}`;
      params.push(filters.tags);
    }

    // Сортировка
    switch (filters?.sortBy) {
      case 'stars':
        query += ` ORDER BY stars_count DESC`;
        break;
      case 'downloads':
        query += ` ORDER BY downloads_count DESC`;
        break;
      case 'newest':
      default:
        query += ` ORDER BY p.created_at DESC`;
    }

    const result = await this.pool.query(query, params);
    return result.rows.map(this.mapRowToProjectWithStats);
  }

  async findById(
    id: string,
    userId?: string,
  ): Promise<ProjectWithStats | null> {
    let query = `
      SELECT 
        p.*,
        COALESCE(canvases_count, 0) as canvases_count,
        COALESCE(stars_count, 0) as stars_count,
        COALESCE(downloads_count, 0) as downloads_count,
        u.user_name as owner_name,
        u.email as owner_email
      FROM projects p
      LEFT JOIN "users" u ON p.owner_id = u.id
      LEFT JOIN (
        SELECT project_id, COUNT(*) as canvases_count 
        FROM canvases 
        GROUP BY project_id
      ) c ON p.id = c.project_id
      LEFT JOIN (
        SELECT project_id, COUNT(*) as stars_count 
        FROM stars 
        GROUP BY project_id
      ) s ON p.id = s.project_id
      LEFT JOIN (
        SELECT project_id, COUNT(*) as downloads_count 
        FROM downloads 
        GROUP BY project_id
      ) d ON p.id = d.project_id
      WHERE p.id = $1
    `;

    const params: any[] = [id];

    if (userId) {
      query += ` AND p.owner_id = $2`;
      params.push(userId);
    }

    const result = await this.pool.query(query, params);
    if (result.rows.length === 0) return null;
    return this.mapRowToProjectWithStats(result.rows[0]);
  }

  async create(data: {
    title: string;
    description?: string;
    ownerId: string;
    isPublic?: boolean;
    tags?: string[];
  }): Promise<Project> {
    const result = await this.pool.query(
      `INSERT INTO projects (title, description, owner_id, is_public, tags) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        data.title,
        data.description || null,
        data.ownerId,
        data.isPublic ?? false,
        data.tags || [],
      ],
    );

    return this.mapRowToProject(result.rows[0]);
  }

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      isPublic?: boolean;
      tags?: string[];
    },
  ): Promise<Project | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.isPublic !== undefined) {
      updates.push(`is_public = $${paramCount++}`);
      values.push(data.isPublic);
    }
    if (data.tags !== undefined) {
      updates.push(`tags = $${paramCount++}`);
      values.push(data.tags);
    }

    if (updates.length === 0) {
      const project = await this.findById(id, userId);
      return project || null;
    }

    values.push(id, userId);

    const result = await this.pool.query(
      `UPDATE projects 
       SET ${updates.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} AND owner_id = $${paramCount + 1}
       RETURNING *`,
      values,
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToProject(result.rows[0]);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Проверяем права
      const check = await client.query(
        'SELECT id FROM projects WHERE id = $1 AND owner_id = $2',
        [id, userId],
      );

      if (check.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }

      // Удаляем все связанные данные через каскадные внешние ключи
      // (предполагаем, что в таблицах настроены ON DELETE CASCADE)
      await client.query('DELETE FROM projects WHERE id = $1', [id]);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting project:', error);
      return false;
    } finally {
      client.release();
    }
  }

  async toggleStar(
    projectId: string,
    userId: string,
  ): Promise<{ starred: boolean; starsCount: number }> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Проверяем, существует ли уже звезда
      const existing = await client.query(
        'SELECT id FROM stars WHERE project_id = $1 AND user_id = $2',
        [projectId, userId],
      );

      if (existing.rows.length > 0) {
        // Удаляем звезду
        await client.query(
          'DELETE FROM stars WHERE project_id = $1 AND user_id = $2',
          [projectId, userId],
        );
      } else {
        // Добавляем звезду
        await client.query(
          'INSERT INTO stars (project_id, user_id) VALUES ($1, $2)',
          [projectId, userId],
        );
      }

      // Получаем новое количество звезд
      const starsCountResult = await client.query(
        'SELECT COUNT(*) FROM stars WHERE project_id = $1',
        [projectId],
      );

      await client.query('COMMIT');

      return {
        starred: existing.rows.length === 0,
        starsCount: parseInt(starsCountResult.rows[0].count),
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async incrementDownloads(
    projectId: string,
    userId: string,
    canvasId?: string,
  ): Promise<void> {
    await this.pool.query(
      `INSERT INTO downloads (project_id, user_id, canvas_id) 
       VALUES ($1, $2, $3)`,
      [projectId, userId, canvasId || null],
    );
  }

  private mapRowToProject = (row: any): Project => {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      ownerId: row.owner_id,
      isPublic: row.is_public,
      stars: parseInt(row.stars) || 0,
      downloads: parseInt(row.downloads) || 0,
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  };

  private mapRowToProjectWithStats = (row: any): ProjectWithStats => {
    return {
      ...this.mapRowToProject(row),
      _count: {
        canvases: parseInt(row.canvases_count) || 0,
        stars: parseInt(row.stars_count) || 0,
        downloads: parseInt(row.downloads_count) || 0,
      },
      ownerName: row.owner_name,
      ownerEmail: row.owner_email,
    };
  };
}
