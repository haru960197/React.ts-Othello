import Square, { SquareState } from "./Square";
import { useState } from 'react';

const boardSize = 8; // 盤面のサイズ（偶数）

export type BoardState = {
    readonly squares: SquareState[];
    readonly blackIsNext: boolean;
}

type Point = {
    x: number;
    y: number;
}

export default function Board() {
    const [state, setState] = useState<BoardState>({
        squares: makeInitialSquares(),
        blackIsNext: true
    });

    function handleClick(index: number): void {
        const point: Point = {
            x: index % boardSize,
            y: Math.floor(index / boardSize)
        };
        // すでに石が置かれている場合は何もしない
        if (state.squares[boardSize * point.y + point.x]) {
            return;
        }
        const color: SquareState = state.blackIsNext ? '●' : '〇';

        const result = renewSquares(point, color, state.squares);
        if (result === null) {
            // 石を置いても一つも反転がなかった
            return;
        }
        const newSquares: SquareState[] = result!;

        setState((prev) => ({
            squares: newSquares,
            blackIsNext: !prev.blackIsNext
        }));
    }

    const showSquares = (boardSize: number) => {
        const lineNums = Array<number>(boardSize);
        for (let i = 0; i < boardSize; i++) {
            lineNums[i] = i;
        }
        return lineNums.map((lineNum: number) => (
            <div key={`lineNum-${lineNum}`} className="board-row">
                {state.squares.map((square, i) => {
                    if (Math.floor(i / boardSize) !== lineNum) {
                        return;
                    }        
                    return (
                        <Square
                            key={`${lineNum}-${i}`}
                            value={square}
                            onClick={() => handleClick(i)}
                        />
                    );
                })}
            </div>
        ));
    };

    return (
        <div>
            {showSquares(boardSize)}
        </div>
    );
}

/**
 * ゲーム開始時の盤面を生成する
 */
function makeInitialSquares(): SquareState[] {
    const initSquares = Array<SquareState>(boardSize * boardSize).fill(null);
    const corePoint: Point = { x: boardSize / 2 - 1, y: boardSize / 2 - 1 };
    initSquares[boardSize * corePoint.y + corePoint.x] = '●';
    initSquares[boardSize * corePoint.y + corePoint.x + 1] = '〇';
    initSquares[boardSize * (corePoint.y + 1) + corePoint.x] = '〇';
    initSquares[boardSize * (corePoint.y + 1) + corePoint.x + 1] = '●';
    return initSquares;
}

/**
 * 石を置いて反転処理があった場合、更新後の新たな盤面を返す
 * @param point 置かれた石の位置
 * @param color 置かれた石の色
 * @param squares 反転処理を行う盤面
 * @returns 反転あり：新たな盤面　反転なし：null
 */
function renewSquares(
    point: Point,
    color: SquareState,
    squares: SquareState[]
): SquareState[] | null {
    let newSquares = squares.slice();
    // 石の置かれた位置を更新
    newSquares[boardSize * point.y + point.x] = color;

    // 反転があるか否かのフラグ
    let isChanged: boolean = false;

    // 探索方向
    const vecArray: Point[] = [
        { x:  0, y: -1 },
        { x: +1, y:  0 },
        { x:  0, y: +1 },
        { x: -1, y:  0 },
        { x: +1, y: -1 },
        { x: +1, y: +1 },
        { x: -1, y: +1 },
        { x: -1, y: -1 },
    ]
    vecArray.forEach((vec) => {
        // vec方向に同じ色の石がないか探索を行う
        for (let i = 1; i < boardSize; i++) {
            const curPoint : Point = { x: point.x, y: point.y };
            curPoint.x += vec.x * i;
            curPoint.y += vec.y * i;

            if (curPoint.x < 0 || curPoint.x >= boardSize
                || curPoint.y < 0 || curPoint.y >= boardSize) {
                // 範囲内に同じ色の石がなかったので探索を終了
                break;
            } else if (squares[curPoint.y * boardSize + curPoint.x] === null) {
                // 石がなかったので、探索を終了
                break;
            } else if (squares[curPoint.y * boardSize + curPoint.x] === color) {
                // vec方向で最も近い同じ色の石が見つかった
                if (i === 1) {
                    // すぐ隣の石であるため、探索を終了
                    break;
                }

                // 間に異なる色の石があるため、反対方向に反転処理を行う
                const reverseVec = { x: -vec.x, y: -vec.y };
                newSquares = reverseSquares(curPoint, color, reverseVec, newSquares);
                // 反転があったのでフラグを更新
                isChanged = true;
                break;
            } else {
                // 異なる色の石が見つかったので、探索を継続
                continue;
            }
        }
    });

    // 更新があった場合のみ新たな盤面を返す
    return (isChanged ? newSquares : null);
}

/**
 * 指定方向に反転処理を行った盤面を返す
 * @param point 反転処理を開始する石の位置
 * @param color 置かれた石の色
 * @param vec 処理を行う方向
 * @param squares 反転処理を行う盤面
 */
function reverseSquares(
    point: Point,
    color: SquareState,
    vec: Point,
    squares: SquareState[]
): SquareState[] {
    const curPoint: Point = {
        x: point.x + vec.x,
        y: point.y + vec.y
    };
    while (squares[boardSize * curPoint.y + curPoint.x] !== color) {
        if (color === '●') {
            squares[boardSize * curPoint.y + curPoint.x] = '●';
        } else {
            squares[boardSize * curPoint.y + curPoint.x] = '〇';
        }
        curPoint.x += vec.x;
        curPoint.y += vec.y;
    }
    return squares;
}