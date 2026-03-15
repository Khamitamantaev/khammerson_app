import { Module } from '@nestjs/common';
import { CanvasModule } from '../canvas/canvas.module'; // Импортируем CanvasModule
import { ProjectService } from './project.service';
import { ProjectRepository } from './repositories/project.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule, // для DatabaseService
    CanvasModule, // для CanvasRepository, NodeRepository, EdgeRepository
  ],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
