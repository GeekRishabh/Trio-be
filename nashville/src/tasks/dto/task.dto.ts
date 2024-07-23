import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateTaskDto {
    @IsUUID()
    @IsOptional()
    @ApiPropertyOptional()
    parentId: string | null;

    @IsString()
    @ApiProperty()
    title: string;

    @IsString()
    @ApiProperty()
    description: string;
}

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    title?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    description?: string;
}

export class QueryTasksDto {
    @ApiPropertyOptional({ description: 'Page number for pagination', default: 1, example: 1 })
    page: number;

    @ApiPropertyOptional({ description: 'Limit of items per page', default: 10, example: 0 })
    limit: number;

    @ApiPropertyOptional({ description: 'Sort order', example: 'ASC or DESC' })
    sort: string;

    @ApiPropertyOptional({ description: 'Filter by status', example: 'completed or pending' })
    filter: string;

    @ApiPropertyOptional({ description: 'Search term for title or description', example: 'task' })
    search: string;
}
