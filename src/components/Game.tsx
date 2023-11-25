import { SquareState } from './Square';
import Board from './Board';
import BoardSizeRadio from './BoardSizeRadio';
import { useState } from 'react';

type Point = {
    x: number;
    y: number;
}

type MatchResult = '●' | '○' | 'x' | null;

type Step = {
    squares: SquareState[];
    blackIsNext: boolean;
}

type GameState = {
    curStep: Step;
    prevStep: Step | null;
    boardSize: number;
}

export default function Game() {
    const [state, setState] = useState<GameState>({
        curStep: {
            squares: makeInitialSquares(8),
            blackIsNext: true,
        },
        prevStep: null,
        boardSize: 8
    });
    const [blackNum, whiteNum] = countStones(state.curStep.squares);
    const matchResult = calcMatchResult(blackNum, whiteNum, state.boardSize);
    const resultMessage = (result: MatchResult) => {
        if (result === null) {
            return "";
        } else if (result === '●') {
            return "●の勝ちです！";
        } else if (result === '○') {
            return "○の勝ちです！";
        } else {
            return "引き分けです！";
        }
    };

    function handleClick(index: number): void {
        const point: Point = {
            x: index % state.boardSize,
            y: Math.floor(index / state.boardSize)
        };

       if (matchResult !== null) {
            // 試合が終了している場合は何もしない
            return;
        } else if (state.curStep.squares[state.boardSize * point.y + point.x]) {
            // すでに石が置かれている場合は何もしない
            return;
        }

        const color: SquareState = state.curStep.blackIsNext ? '●' : '○';

        const result = renewSquares(point, color, state.curStep.squares);
        if (result === null) {
            // 石を置いても一つも反転がなかった
            return;
        }
        const newSquares: SquareState[] = result!;

        setState((prevState) => ({
            ...prevState,
            curStep: {
                squares: newSquares,
                blackIsNext: !prevState.curStep.blackIsNext
            },
            prevStep: prevState.curStep
        }));
    }

    /**
     * 盤面サイズのラジオボックスを制御
     */
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newBoardSize = Number((e.target as HTMLInputElement).value);
        setState({
            curStep: {
                squares: makeInitialSquares(newBoardSize),
                blackIsNext: true,
            },
            prevStep: null,
            boardSize: newBoardSize
        });
    }

    return (
        <div>
            <Board
                squares={state.curStep.squares}
                onClick={handleClick}
                boardSize={state.boardSize}
            />
            <p>{"Next is " + (state.curStep.blackIsNext ? '●' : '○')}</p>
            <p>{`●：${blackNum}`}</p>
            <p>{`○：${whiteNum}`}</p>
            <p>{resultMessage(matchResult)}</p>
            <button onClick={
                () => setState((prev) => ({
                    ...prev,
                    curStep: {
                        ...prev.curStep,
                        blackIsNext: !prev.curStep.blackIsNext
                    }
                }))}>
                    置けないのでパス
            </button>
            <button
                disabled={state.prevStep === null}
                onClick={() => setState(
                    (prev) => ({ ...prev, curStep: prev.prevStep!, prevStep: null }))}
            >ひとつ前の状態に戻る</button>
            <BoardSizeRadio value={state.boardSize} onChange={handleChange} />
        </div>
    );
}

/**
 * ゲーム開始時の盤面を生成する
 */
function makeInitialSquares(boardSize: number): SquareState[] {
    const initSquares = Array<SquareState>(boardSize * boardSize).fill(null);
    const corePoint: Point = { x: boardSize / 2 - 1, y: boardSize / 2 - 1 };
    initSquares[boardSize * corePoint.y + corePoint.x] = '●';
    initSquares[boardSize * corePoint.y + corePoint.x + 1] = '○';
    initSquares[boardSize * (corePoint.y + 1) + corePoint.x] = '○';
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
    const boardSize = Math.sqrt(squares.length);
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
    const boardSize = Math.sqrt(squares.length);
    const curPoint: Point = {
        x: point.x + vec.x,
        y: point.y + vec.y
    };
    while (squares[boardSize * curPoint.y + curPoint.x] !== color) {
        if (color === '●') {
            squares[boardSize * curPoint.y + curPoint.x] = '●';
        } else {
            squares[boardSize * curPoint.y + curPoint.x] = '○';
        }
        curPoint.x += vec.x;
        curPoint.y += vec.y;
    }
    return squares;
}

/**
 * 盤面から双方の石の数をカウントする
 * @param squares 現在の盤面
 * @returns [黒の数, 白の数]
 */
function countStones(squares: SquareState[]): number[] {
    let blackNum = 0, whiteNum = 0;
    squares.forEach((square: SquareState) => {
        if (square === '●') {
            blackNum++;
        } else if (square === '○') {
            whiteNum++;
        }
    });
    return [blackNum, whiteNum];
}

/**
 * 石の数から試合の結果を算出
 * @param blackNum 黒の数
 * @param whiteNum 白の数
 * @param boardSize 盤面のサイズ
 * @returns 試合の途中ならnull、引き分けなら'x'
 */
function calcMatchResult(
    blackNum: number, whiteNum: number, boardSize: number): MatchResult {
    if (blackNum === 0 || whiteNum === 0) {
        return whiteNum === 0 ? '●' : '○';
    } else if (blackNum + whiteNum < boardSize * boardSize) {
        return null;
    } else if (blackNum === whiteNum) {
        return 'x';
    } else {
        return blackNum > whiteNum ? '●' : '○';
    }
}