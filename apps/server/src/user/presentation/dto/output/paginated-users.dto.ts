import { PaginateResponseDto } from 'src/shared/presentation/dto/paginate-response.dto';
import { UserDto } from 'src/user/presentation/dto/output/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedUsersDto implements PaginateResponseDto<UserDto> {
  @ApiProperty({ type: [UserDto], description: 'Users' })
  records: UserDto[];

  @ApiProperty({ type: 'number', description: 'Total users' })
  total: number;
}
