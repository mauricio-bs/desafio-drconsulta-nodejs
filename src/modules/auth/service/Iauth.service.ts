import { SignInDTO } from '../dto/signin.dto';

export abstract class IAuthService {
  abstract sigin(data: SignInDTO): Promise<string>;
}
