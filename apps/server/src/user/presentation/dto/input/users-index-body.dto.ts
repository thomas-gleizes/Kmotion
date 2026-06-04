import { PaginateRequestDto } from 'src/shared/presentation/dto/paginate-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserFiltersDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class UserOrderByDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  field?: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  order?: string;
}

export class UsersIndexBodyDto implements PaginateRequestDto<UserFiltersDto> {
  @ApiProperty({
    type: [UserFiltersDto],
    description: 'Filters',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFiltersDto)
  filters?: UserFiltersDto[];

  @ApiProperty({
    type: [UserOrderByDto],
    description: 'Order by',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserOrderByDto)
  orderBy?: UserOrderByDto[];

  @ApiProperty({ type: 'number', description: 'Page size', required: false })
  @IsNumber()
  @IsOptional()
  @Min(10)
  @Max(100)
  pageSize?: number;

  @ApiProperty({ type: 'string', description: 'Page token', required: false })
  @IsString()
  @IsOptional()
  pageToken?: string;
}
