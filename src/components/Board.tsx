import Square, { SquareState } from "./Square";

type BoardProps = {
    squares: SquareState[];
    onClick: (i: number) => void;
    boardSize: number;
}

export default function Board(props: BoardProps) {
    const lineNums = Array<number>(props.boardSize);
    for (let i = 0; i < props.boardSize; i++) {
        lineNums[i] = i;
    }

    return (
        <div>
            {lineNums.map((lineNum: number) => (
                <div key={`lineNum-${lineNum}`} className="board-row">
                    {props.squares.map((square, i) => {
                        if (Math.floor(i / props.boardSize) !== lineNum) {
                            return;
                        }
                        return (
                            <Square
                                key={`${lineNum}-${i}`}
                                value={square}
                                onClick={() => props.onClick(i)}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}