import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

/** Portion of a media to keep, in seconds from its start. */
export class ClipDto {
  @ApiProperty({
    type: 'number',
    description: 'Start of the kept portion in seconds (defaults to 0)',
    example: 12,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  start?: number;

  @ApiProperty({
    type: 'number',
    description:
      'End of the kept portion in seconds (defaults to the end of the media)',
    example: 225,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  end?: number;
}
