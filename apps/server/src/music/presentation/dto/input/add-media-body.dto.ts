import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ClipDto } from 'src/music/presentation/dto/input/clip.dto';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export class AddMediaBodyDto {
  @ApiProperty({
    enum: MediaSource,
    description: 'Media source of track',
    example: MediaSource.youtube,
  })
  @IsEnum(MediaSource, { message: 'Invalid source media' })
  mediaSource: MediaSource;

  @ApiProperty({
    type: String,
    description: 'Id of source media',
    example: 'dQw4w9WgXcQ',
  })
  @IsString()
  @IsNotEmpty()
  mediaId: string;

  @ApiProperty({
    type: ClipDto,
    description: 'Only convert this portion of the media',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClipDto)
  clip?: ClipDto;
}
