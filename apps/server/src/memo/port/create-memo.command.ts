import { IsNumber, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateMemoCommand {
  @IsUUID()
  deviceId: string;

  @IsString()
  @MinLength(1)
  sttText: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
