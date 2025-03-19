import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';
import { PageOptionsDto } from './page-options.dto';

export class PageDto<T extends { toDto?: () => any }> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], totalCount: number, pageOptions: PageOptionsDto) {
    this.data = data.map((record) => record.toDto?.() || record);
    this.meta = new PageMetaDto(pageOptions, totalCount);
  }
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
