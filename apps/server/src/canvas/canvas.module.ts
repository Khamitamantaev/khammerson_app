import { Module } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { CanvasRepository } from './repositories/canvas.repository';
import { NodeRepository } from './repositories/node.repository';
import { EdgeRepository } from './repositories/edge.repository';
import { DatabaseModule } from '../database/database.module';
import { TransformService } from './services/transform.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    CanvasService,
    CanvasRepository,
    NodeRepository,
    EdgeRepository,
    TransformService,
  ],
  exports: [
    CanvasService,
    CanvasRepository, // Экспортируем репозитории
    NodeRepository, // чтобы они были доступны
    EdgeRepository, // в других модулях
  ],
})
export class CanvasModule {}
