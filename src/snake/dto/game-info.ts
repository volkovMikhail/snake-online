import { Snake } from '../models';

export class GameInfoDto {
  playerSnakes: Record<string, Snake>;

  id: string;
}
