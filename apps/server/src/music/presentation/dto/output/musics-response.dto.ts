import { PaginateResponseDto } from 'src/shared/presentation/dto/paginate-response.dto';
import { PaginateResult } from 'src/core/paginations/paginations.type';
import { MusicRead } from 'src/music/application/port/music-read-repository.port';
import { ApiProperty } from '@nestjs/swagger';
import { MusicResponseDto } from 'src/music/presentation/dto/output/music-response.dto';

export class MusicsResponseDto implements PaginateResponseDto<MusicResponseDto> {
  @ApiProperty({ type: [MusicResponseDto] })
  records: MusicResponseDto[];

  @ApiProperty({ type: Number })
  total: number;

  static fromResult(result: PaginateResult<MusicRead>): MusicsResponseDto {
    const dto = new MusicsResponseDto();

    dto.total = result.total;
    dto.records = result.records.map((record) =>
      MusicResponseDto.fromReadModel(record),
    );

    return dto;
  }
}
