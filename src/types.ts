export interface Move {
  player: Player;
  x: number;
  y: number;
}

export enum Player {
  x = 'x',
  o = 'o'
}