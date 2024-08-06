import { css, html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Move, Player } from "./types";
import "./piece"

@customElement('game-container')
export class Game extends LitElement {
  @state()
  winner: Player | null = null;

  @state()
  currentMove = Player.x

  @state()
  state: Move[] = []

  static styles = css`
    #grid {
      display: grid;
      grid-template-rows: repeat(3, min(25vw, 25vh));
      grid-template-columns: repeat(3, min(25vw, 25vh));

      gap: 10px;
      border: solid 10px #f0f0f0;
      background: #f0f0f0;
    }

    .square {
      background: #333;
      padding: 10px;
    }

    code {
      color: #333;
    }

    @media (prefers-color-scheme: light) {
      #grid {
        border: solid 10px #333;
        background: #333;
      }
      
      .square {
        background-color: #f0f0f0;
      }

      code {
        color: #f0f0f0;
      }
    }
  `

  private _handleMove(e: Event) {
    if (this.winner) return

    const coordString = (e.target as Element).getAttribute('key')
    if (coordString) {
      const x = parseInt(coordString[0])
      const y = parseInt(coordString[1])
      
      if (
        x !== undefined
        && y !== undefined 
        && !this.state.some(move => move.x === x && move.y === y)
      ) {
        if (this.state.length >= 6) this.state = this.state.slice(1)
        this.state.push({ player: this.currentMove, x, y })
        
        if (this.currentMove === Player.x) this.currentMove = Player.o
        else if (this.currentMove === Player.o) this.currentMove = Player.x
      } 
    }

    this.winner = this._getWin()
  }

  private _moveAt(x: number, y: number) {
    return this.state.find(
      move => move.x === x && move.y === y
    )
  }

  private _moveStageAt(x: number, y: number) {
    const index = (this.state.length - 1) - this.state.findIndex(
      move => move.x === x && move.y === y
    )
    return Math.floor(index / 2) + 1
  }

  private _getWin(): Player | null {
    const winPos = [
      [0, 1, 2],
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
      [2, 1, 0]
    ]

    const hasXWon = winPos.some(win => 
      win.every((x, y) => this.state.some(s => 
        s.player === Player.x
        && s.x === x
        && s.y === y
      )) 
      ||
      win.every((y, x) => this.state.some(s => 
        s.player === Player.x
        && s.x === x
        && s.y === y
      )) 
    )

    const hasOWon = winPos.some(win =>
      win.every((x, y) => this.state.some(s => 
        s.player === Player.o
        && s.x === x
        && s.y === y
      )) 
      ||
      win.every((y, x) => this.state.some(s => 
        s.player === Player.o
        && s.x === x
        && s.y === y
      )) 
    )

    if (hasXWon) return Player.x
    if (hasOWon) return Player.o
    else return null
  }

  render() {
    return html`
      <div id="grid">
        ${Array.from({ length: 3 }).map((_, i) => 
          Array.from({ length: 3 }).map((_, j) => 
            html`
              <div class="square" @click="${this._handleMove}" key="${i}${j}">
                ${this._moveAt(i, j) ? 
                  html`
                    <game-piece 
                      type=${this._moveAt(i, j)?.player}
                      stage=${this._moveStageAt(i, j)}
                    ></game-piece>
                  `
                  : nothing
                }
              </div>
              `
          )
        )}
        ${
          this.winner 
          ? html`<code>${this.winner} wins</code>`
          : html`<code>${this.currentMove}s turn</code>`
        }
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'game-container': Game
  }
}