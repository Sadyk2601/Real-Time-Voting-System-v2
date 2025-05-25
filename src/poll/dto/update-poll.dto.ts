import { IsOptional, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class UpdatePollDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  options?: string[];
}
