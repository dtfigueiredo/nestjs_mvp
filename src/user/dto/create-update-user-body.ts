import { IsNotEmpty, Length } from 'class-validator';

export class CreateUpdateUserBody {
  @IsNotEmpty()
  @Length(5, 100)
  name: string;

  @IsNotEmpty()
  email: string;
}
